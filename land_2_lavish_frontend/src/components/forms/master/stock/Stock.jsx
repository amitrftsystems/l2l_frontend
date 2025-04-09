import  { useState, useEffect, useRef, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { X, Loader2, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from 'prop-types';

const ErrorBoundary = ({ children }) => {
  const [error] = useState(null);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#272727]">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Oops! Something went wrong</h2>
          <p className="mb-4 text-gray-600">{error.message || "Please try refreshing the page"}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return children;
};

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

const propertyDescriptions = [
  "2BHK Flat", "3BHK Apt", "4BHK Pent", "Villa", "Row House", "Duplex", "Studio", 
  "Shop Complex", "Office", "Co-work", "Warehouse", "Farmhouse", "Resort", "Service Apt", "Showroom",
  "Other"
];

const BASE_URL = "http://localhost:5000/api/master";

const Stock = () => {
  const initialFormData = {
    projectId: "", propertyDescription: "", propertyId: "", size: "", bsp: "", 
    collaborator: "", remarks: "", onHold: "Hold",  tillDate: new Date()
  };

  const [formData, setFormData] = useState(initialFormData);
  const [customPropertyType, setCustomPropertyType] = useState("");
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [propertyValidation, setPropertyValidation] = useState({ isValid: true, message: "" });
  const [bspValidation, setBspValidation] = useState({ isValid: true, message: "" });
  const [formErrors, setFormErrors] = useState({});
  const [projects, setProjects] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState({ projects: true, brokers: false, submission: false, checkStock: false, fetchProperty: false });
  const [availableSizes, setAvailableSizes] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({ project: false, size: false, broker: false });
  const [searchTerm, setSearchTerm] = useState({ project: "", size: "", broker: "" });

  const dropdownRefs = {
    project: useRef(null),
    size: useRef(null),
    broker: useRef(null)
  };

  const fetchData = useCallback(async (url, setData, key) => {
    try {
      setLoading(prev => ({ ...prev, [key]: true }));
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to load ${key}: ${response.status}`);
      const data = await response.json();
      setData(data.data || []);
    } catch (error) {
      console.error(`Fetch ${key} error:`, error);
      toast.error(error.message || `Failed to load ${key}`);
      setData([]);
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  useEffect(() => {
    fetchData(`${BASE_URL}/get-projects`, setProjects, 'projects');
  }, [fetchData]);

  useEffect(() => {
    if (!formData.projectId) return setBrokers([]);
    fetchData(`${BASE_URL}/get-brokers?project_id=${formData.projectId}`, setBrokers, 'brokers');
  }, [formData.projectId, fetchData]);

  useEffect(() => {
    const selectedProject = projects.find(p => p.project_id === parseInt(formData.projectId));
    setAvailableSizes(selectedProject?.size?.split(",").map(s => s.trim()) || []);
  }, [formData.projectId, projects]);

  useEffect(() => {
    if (formData.projectId || formData.propertyId) {
      setIsUpdateMode(false);
      setPropertyValidation({ isValid: true, message: "" });
    }
  }, [formData.projectId, formData.propertyId]);

  const checkPropertyInStock = async () => {
    if (!formData.projectId || !formData.propertyId) return;
    
    try {
      const response = await fetch(`${BASE_URL}/stock/check-property?project_id=${formData.projectId}&property_id=${formData.propertyId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error(`Check stock failed: ${response.status}`);
      const data = await response.json();
      setPropertyValidation({ isValid: !data.exists, message: data.exists ? "Property already exists in stock" : "" });
    } catch (error) {
      console.error("Check property error:", error);
      setPropertyValidation({ isValid: true, message: "" });
    }
  };

  const fetchPropertyDetails = async () => {
    if (!formData.projectId || !formData.propertyId) return;
    
    try {
      setLoading(prev => ({ ...prev, fetchProperty: true }));
      const response = await fetch(`${BASE_URL}/stock/get-property?project_id=${formData.projectId}&property_id=${formData.propertyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Property details not found");
        }
        throw new Error(`Failed to fetch property: ${response.status}`);
      }
      
      const data = await response.json();
      if (data?.success && data.data) {
        setFormData(prev => ({
          ...prev,
          propertyDescription: data.data.property_type || "",
          size: data.data.size || "",
          bsp: data.data.bsp || "",
          collaborator: data.data.broker_id || "",
          remarks: data.data.remarks || "",
          onHold: data.data.on_hold_status || "Hold",
          holdRemarks: data.data.hold_remarks || "",
          tillDate: data.data.hold_till_date ? new Date(data.data.hold_till_date) : new Date()
        }));
      } else {
        throw new Error("Invalid property data received");
      }
    } catch (error) {
      console.error("Fetch property error:", error);
      toast.error(error.message || "Failed to load property details");
      setPropertyValidation({ 
        isValid: false, 
        message: error.message || "Failed to load property details" 
      });
    } finally {
      setLoading(prev => ({ ...prev, fetchProperty: false }));
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setCustomPropertyType("");
    setPropertyValidation({ isValid: true, message: "" });
    setBspValidation({ isValid: true, message: "" });
    setFormErrors({});
    setIsUpdateMode(false);
    setSearchTerm({ project: "", size: "", broker: "" });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.projectId) errors.projectId = "Project is required";
    if (!formData.propertyDescription) errors.propertyDescription = "Property type is required";
    if (formData.propertyDescription === "Other" && !customPropertyType) {
      errors.propertyDescription = "Please specify property type";
    }
    if (!formData.propertyId) errors.propertyId = "Property ID is required";
    else if (!/^\d+$/.test(formData.propertyId)) errors.propertyId = "Property ID must be a number";
    if (!formData.size) errors.size = "Size is required";
    if (formData.onHold === "Hold" && !formData.tillDate) errors.tillDate = "Till date is required";
    if (!isUpdateMode && formData.onHold === "Free") errors.onHold = "New properties must be Hold or Allocated";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSelect = (type, value) => {
    if (type === "project") {
      const selectedProject = projects.find(p => p.project_id === parseInt(value));
      setFormData(prev => ({
        ...prev,
        projectId: selectedProject?.project_id || "",
        projectName: selectedProject?.project_name || "",
        size: "",
        collaborator: ""
      }));
    } else if (type === "size") {
      setFormData(prev => ({ ...prev, size: value }));
    } else if (type === "broker") {
      setFormData(prev => ({ ...prev, collaborator: parseInt(value) }));
    }
    setDropdownOpen(prev => ({ ...prev, [type]: false }));
    setSearchTerm(prev => ({ ...prev, [type]: "" }));
  };

  const handleStockUpdateClick = async () => {
    if (!formData.projectId || !formData.propertyId || !/^\d+$/.test(formData.propertyId)) {
      toast.error("Valid Project and Property ID are required");
      return;
    }

    try {
      setLoading(prev => ({ ...prev, checkStock: true }));
      const response = await fetch(`${BASE_URL}/stock/check-property?project_id=${formData.projectId}&property_id=${formData.propertyId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Stock check endpoint not found");
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to check stock");
      }

      const responseData = await response.json();
      console.log("Stock check response:", responseData);

      if (responseData.exists) {
        setIsUpdateMode(true);
        await fetchPropertyDetails();
        toast.success("Property found - now in update mode");
      } else {
        setIsUpdateMode(false);
        setPropertyValidation({ isValid: false, message: "Property not found in stock" });
        toast.warning("Property not found in stock");
      }
    } catch (error) {
      console.error("Stock update error:", error);
      toast.error(error.message || "Error checking stock");
      setPropertyValidation({ 
        isValid: false, 
        message: error.message || "Error checking stock" 
      });
    } finally {
      setLoading(prev => ({ ...prev, checkStock: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: "" }));

    if (name === "propertyId" && !isUpdateMode && formData.projectId && value) {
      const debounceTimer = setTimeout(() => checkPropertyInStock(), 500);
      return () => clearTimeout(debounceTimer);
    }
  };

  const handlePropertyDescriptionChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, propertyDescription: value }));
    if (formErrors.propertyDescription) {
      setFormErrors(prev => ({ ...prev, propertyDescription: "" }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, tillDate: date }));
    if (formErrors.tillDate) setFormErrors(prev => ({ ...prev, tillDate: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return toast.error("Please fix form errors");

    try {
      if (!isUpdateMode) {
        setLoading(prev => ({ ...prev, checkStock: true }));
        const checkResponse = await fetch(`${BASE_URL}/stock/check-property?project_id=${formData.projectId}&property_id=${formData.propertyId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!checkResponse.ok) {
          if (checkResponse.status === 404) {
            throw new Error("Stock check endpoint not found");
          }
          const errorData = await checkResponse.json();
          throw new Error(errorData.message || "Failed to check stock");
        }

        const checkData = await checkResponse.json();
        console.log("Stock check response:", checkData);

        if (checkData.exists) {
          setPropertyValidation({ isValid: false, message: "Property already exists" });
          return toast.error("Property already exists");
        }
      }

      const propertyId = parseInt(formData.propertyId);
      if (!propertyId) throw new Error("Invalid Property ID");

      const finalPropertyDescription = formData.propertyDescription === "Other" 
        ? customPropertyType 
        : formData.propertyDescription;

      setLoading(prev => ({ ...prev, submission: true }));
      const payload = {
        project_id: parseInt(formData.projectId),
        property_id: propertyId,
        property_type: finalPropertyDescription,
        size: parseInt(formData.size) || null,
        bsp: formData.bsp ? parseFloat(formData.bsp) : null,
        broker_id: formData.collaborator ? parseInt(formData.collaborator) : null,
        remarks: formData.remarks || null,
        on_hold_status: formData.onHold,
        hold_remarks: formData.holdRemarks || null,
        hold_till_date: formData.onHold === "Hold" ? formData.tillDate.toISOString() : null
      };

      console.log("Submitting payload:", payload);

      let endpoint, method;
      if (isUpdateMode) {
        endpoint = formData.onHold === "Free" 
          ? `${BASE_URL}/stock/delete/${formData.projectId}/${propertyId}`
          : `${BASE_URL}/stock/update/${formData.projectId}/${propertyId}`;
        method = formData.onHold === "Free" ? "DELETE" : "PUT";
      } else {
        endpoint = `${BASE_URL}/stock`;
        method = "POST";
      }

      const response = await fetch(endpoint, {
        method,
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: method !== "DELETE" ? JSON.stringify(payload) : null
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Endpoint not found");
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Operation failed");
      }

      const result = await response.json();
      if (!result?.success) throw new Error(result?.message || "Operation failed");

      const successMessage = isUpdateMode
        ? formData.onHold === "Free" ? "Property removed" : "Stock updated"
        : "Stock added";

      toast.success(successMessage);
      if (window.confirm(`${successMessage}! Go back?`)) window.history.back();
      else handleClear();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Operation Failed");
      setPropertyValidation({ 
        isValid: false, 
        message: error.message || "Operation Failed" 
      });
    } finally {
      setLoading(prev => ({ ...prev, submission: false, checkStock: false }));
    }
  };

  const getSelectedName = (data, id, nameKey = "name", idKey = "id") => {
    if (!data || !id) return "";
    const item = data.find(i => i[idKey] === id);
    return item ? `${item[nameKey] || ""} (${item[idKey] || ""})` : "";
  };

  const filteredData = (data, term, nameKey = "name", idKey = "id") => 
    data?.filter(i => 
      i?.[nameKey]?.toLowerCase().includes(term.toLowerCase()) || 
      i?.[idKey]?.toString().includes(term)
    ) || [];

  const isLoading = loading.submission || loading.checkStock || loading.fetchProperty;

  return (
    <ErrorBoundary>
      <div className="flex justify-center items-center min-h-screen bg-[#272727]">
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
              <Loader2 className="animate-spin h-8 w-8 text-blue-500 mb-2" />
              <p className="text-lg font-semibold">
                {loading.submission 
                  ? isUpdateMode 
                    ? formData.onHold === "Free" ? "Removing..." : "Updating..." 
                    : "Adding..."
                  : loading.checkStock ? "Checking..." : "Loading..."}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative w-[700px] bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-center text-black mb-2">
            {isUpdateMode ? "Update Stock" : "Add Stock"}
          </h2>
          <p className="text-center text-sm text-red-500 mb-6">
            Fields marked by <span className="text-red-500">*</span> are mandatory
          </p>

          <div className="grid grid-cols-2 gap-4">
            {/* Project Dropdown */}
            <div className="relative" ref={dropdownRefs.project}>
              <label className="block text-gray-700 font-medium">Project<span className="text-red-500">*</span></label>
              <div className="relative mt-1">
                <input
                  value={getSelectedName(projects, parseInt(formData.projectId), "project_name", "project_id") || searchTerm.project}
                  onChange={e => setSearchTerm(p => ({ ...p, project: e.target.value }))}
                  onClick={() => setDropdownOpen(p => ({ ...p, project: true }))}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${formErrors.projectId ? "border-red-500 focus:ring-red-500" : "border-black focus:ring-green-500"}`}
                  placeholder="Search project..."
                  readOnly
                />
                {formData.projectId && <X className="absolute right-10 top-3 cursor-pointer hover:text-red-500" onClick={() => handleSelect("project", "")} />}
                <ChevronDown className="absolute right-3 top-3 pointer-events-none" />
              </div>
              {formErrors.projectId && <p className="text-red-500 text-sm mt-1">{formErrors.projectId}</p>}
              {dropdownOpen.project && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredData(projects, searchTerm.project, "project_name", "project_id").length > 0 ? (
                    filteredData(projects, searchTerm.project, "project_name", "project_id").map(p => (
                      <div key={p.project_id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelect("project", p.project_id)}>
                        {p.project_name} ({p.project_id})
                      </div>
                    ))
                  ) : <div className="p-2 text-gray-500">No projects found</div>}
                </div>
              )}
            </div>

            {/* Property Description */}
            <div>
              <label className="block text-gray-700 font-medium">Property Type<span className="text-red-500">*</span></label>
              <select
                name="propertyDescription"
                value={formData.propertyDescription}
                onChange={handlePropertyDescriptionChange}
                className={`w-full p-2 border rounded-md mt-1 focus:outline-none focus:ring-2 ${formErrors.propertyDescription ? "border-red-500 focus:ring-red-500" : "border-black focus:ring-green-500"}`}
                required
              >
                <option value="">Select Type</option>
                {propertyDescriptions.map((desc, i) => (
                  <option key={i} value={desc}>{desc}</option>
                ))}
              </select>
              {formData.propertyDescription === "Other" && (
                <input
                  type="text"
                  value={customPropertyType}
                  onChange={(e) => setCustomPropertyType(e.target.value)}
                  className={`w-full p-2 border rounded-md mt-2 focus:outline-none focus:ring-2 ${
                    formErrors.propertyDescription ? "border-red-500 focus:ring-red-500" : "border-black focus:ring-green-500"
                  }`}
                  placeholder="Enter custom property type"
                />
              )}
              {formErrors.propertyDescription && (
                <p className="text-red-500 text-sm mt-1">{formErrors.propertyDescription}</p>
              )}
            </div>

            {/* Property ID */}
            <div>
              <label className="block text-gray-700 font-medium">Property ID<span className="text-red-500">*</span></label>
              <input
                name="propertyId"
                value={formData.propertyId}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md mt-1 focus:outline-none focus:ring-2 ${!propertyValidation.isValid || formErrors.propertyId ? "border-red-500 focus:ring-red-500" : "border-black focus:ring-green-500"}`}
                placeholder="Enter numeric ID"
                required
              />
              {(!propertyValidation.isValid || formErrors.propertyId) && (
                <p className="text-red-500 text-sm mt-1">{propertyValidation.message || formErrors.propertyId}</p>
              )}
            </div>

            {/* Size Dropdown */}
            <div className="relative" ref={dropdownRefs.size}>
              <label className="block text-gray-700 font-medium">Size<span className="text-red-500">*</span></label>
              <div className="relative mt-1">
                <input
                  value={formData.size || searchTerm.size}
                  onChange={e => setSearchTerm(p => ({ ...p, size: e.target.value }))}
                  onClick={() => setDropdownOpen(p => ({ ...p, size: true }))}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${formErrors.size ? "border-red-500 focus:ring-red-500" : "border-black focus:ring-green-500"}`}
                  placeholder="Select size"
                  disabled={!formData.projectId}
                  readOnly
                />
                {formData.size && <X className="absolute right-10 top-3 cursor-pointer hover:text-red-500" onClick={() => handleSelect("size", "")} />}
                <ChevronDown className="absolute right-3 top-3 pointer-events-none" />
              </div>
              {formErrors.size && <p className="text-red-500 text-sm mt-1">{formErrors.size}</p>}
              {dropdownOpen.size && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                  {availableSizes.filter(s => s.toLowerCase().includes(searchTerm.size.toLowerCase())).length > 0 ? (
                    availableSizes.filter(s => s.toLowerCase().includes(searchTerm.size.toLowerCase())).map((size, i) => (
                      <div key={i} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelect("size", size)}>
                        {size}
                      </div>
                    ))
                  ) : <div className="p-2 text-gray-500">No sizes available</div>}
                </div>
              )}
            </div>

            {/* BSP Input */}
            <div>
              <label className="block text-gray-700 font-medium">BSP</label>
              <input
                name="bsp"
                type="number"
                min={0}
                value={formData.bsp}
                onChange={handleChange}
                onBlur={e => {
                  const value = e.target.value;
                  const numValue = parseFloat(value);
                  const isValid = !value || (!isNaN(numValue) && numValue >= 0);
                  setBspValidation({
                    isValid,
                    message: isValid ? "" : "Invalid BSP (must be positive number)"
                  });
                }}
                className={`w-full p-2 border rounded-md mt-1 focus:outline-none focus:ring-2 ${!bspValidation.isValid ? "border-red-500 focus:ring-red-500" : "border-black focus:ring-green-500"}`}
                placeholder="Enter amount"
              />
              {!bspValidation.isValid && <p className="text-red-500 text-sm mt-1">{bspValidation.message}</p>}
            </div>

            {/* Collaborator Dropdown */}
            <div className="relative" ref={dropdownRefs.broker}>
              <label className="block text-gray-700 font-medium">Collaborator</label>
              <div className="relative mt-1">
                <input
                  value={getSelectedName(brokers, formData.collaborator, "name", "broker_id") || searchTerm.broker}
                  onChange={e => setSearchTerm(p => ({ ...p, broker: e.target.value }))}
                  onClick={() => setDropdownOpen(p => ({ ...p, broker: true }))}
                  className="w-full p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Search broker..."
                  disabled={!formData.projectId}
                  readOnly
                />
                {formData.collaborator && <X className="absolute right-10 top-3 cursor-pointer hover:text-red-500" onClick={() => handleSelect("broker", "")} />}
                <ChevronDown className="absolute right-3 top-3 pointer-events-none" />
              </div>
              {dropdownOpen.broker && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredData(brokers, searchTerm.broker).length > 0 ? (
                    filteredData(brokers, searchTerm.broker).map(b => (
                      <div 
                        key={b.broker_id} 
                        className="p-2 hover:bg-gray-100 cursor-pointer" 
                        onClick={() => handleSelect("broker", b.broker_id)}
                      >
                        {b.name} ({b.broker_id})
                      </div>
                    ))
                  ) : <div className="p-2 text-gray-500">No brokers found</div>}
                </div>
              )}
            </div>

            {/* On Hold Status */}
            <div>
              <label className="block text-gray-700 font-medium">On Hold</label>
              <select
                name="onHold"
                value={formData.onHold}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md mt-1 focus:outline-none focus:ring-2 ${formErrors.onHold ? "border-red-500 focus:ring-red-500" : "border-black focus:ring-green-500"}`}
              >
                <option value="Hold">Hold</option>
                <option value="Free">Free</option>
              </select>
              {formErrors.onHold && <p className="text-red-500 text-sm mt-1">{formErrors.onHold}</p>}
            </div>

            {/* Till Date Picker */}
            <div>
              <label className="block text-gray-700 font-medium">
                {formData.onHold === "Hold" ? "Till Date" : "Till Date (disabled)"}
              </label>
              <DatePicker
                selected={formData.tillDate}
                onChange={handleDateChange}
                className={`w-full p-2 border rounded-md mt-1 focus:outline-none focus:ring-2 ${formErrors.tillDate ? "border-red-500 focus:ring-red-500" : "border-black focus:ring-green-500"}`}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date"
                isClearable
                minDate={new Date()}
                disabled={formData.onHold !== "Hold"}
              />
              {formErrors.tillDate && <p className="text-red-500 text-sm mt-1">{formErrors.tillDate}</p>}
            </div>

            {/* Remarks */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium">Remarks</label>
              <input
                name="holdRemarks"
                value={formData.holdRemarks}
                onChange={handleChange}
                className="w-full p-2 border border-black rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Optional remarks"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                disabled={isLoading}
              >
                Clear
              </button>
              <button
                type="submit"
                className={`flex-1 py-2 text-white rounded-md transition ${
                  isUpdateMode
                    ? formData.onHold === "Free" ? "bg-red-500 hover:bg-red-600" : "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                disabled={isLoading}
              >
                {loading.submission ? (
                  <><Loader2 className="animate-spin h-4 w-4 mr-2 inline" /> Processing...</>
                ) : isUpdateMode ? (
                  formData.onHold === "Free" ? "Remove from Stock" : "Update Stock"
                ) : "Add to Stock"}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleStockUpdateClick}
                disabled={isLoading}
                className="flex-1 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center justify-center"
              >
                {loading.checkStock ? (
                  <><Loader2 className="animate-spin h-4 w-4 mr-2" /> Checking...</>
                ) : "Stock Update"}
              </button>
              <button
                type="button"
                className="flex-1 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                onClick={() => toast.info("Allotment feature coming soon!")}
                disabled={isLoading}
              >
                Allotment
              </button>
            </div>
          </div>
        </form>
      </div>
    </ErrorBoundary>
  );
};

export default Stock;