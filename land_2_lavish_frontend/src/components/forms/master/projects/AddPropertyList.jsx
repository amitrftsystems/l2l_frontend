import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL; 
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL; 

const AddPropertiesToProject = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [formData, setFormData] = useState({
    project_id: "",
    count: "",
    p_type: "",
    p_size: "", 
    bsp: "",
    p_desc: ""
  });
  const [errors, setErrors] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState({
    project: false,
    size: false
  });
  const [searchTerm, setSearchTerm] = useState({
    project: "",
    size: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const dropdownRef = useRef(null);
  const sizeDropdownRef = useRef(null);

  // Options for dropdowns
  const sizeTypeOptions = [
    { value: "small", label: "Small" },
    { value: "mid", label: "Mid" },
    { value: "large", label: "Large" }
  ];

  const propertyDescOptions = [
    { value: "option-1", label: "Option 1" },
    { value: "option-2", label: "Option 2" },
    { value: "option-3", label: "Option 3" },
    { value: "option-4", label: "Option 4" },
    { value: "option-5", label: "Option 5" }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${baseUrl}api/master/get-projects`);
        const data = await res.json();
        if (data.success) {
          setProjects(data.data);
        } else {
          setErrors((prev) => ({ ...prev, fetch: "Failed to load projects." }));
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setErrors((prev) => ({ ...prev, fetch: "Failed to fetch projects" }));
      }
    };

    fetchProjects();
  }, []);

  // Fetch available sizes when project is selected
  useEffect(() => {
    if (formData.project_id) {
      const selectedProject = projects.find(p => p.project_id === formData.project_id);
      if (selectedProject) {
        // Assuming sizes are stored in a 'size' property as comma-separated values
        const sizes = selectedProject.size ? selectedProject.size.split(',').map(s => s.trim()) : [];
        setAvailableSizes(sizes);
        // Reset size fields when project changes
        setFormData(prev => ({
          ...prev,
          p_type: "",
          p_size: ""
        }));
      }
    }
  }, [formData.project_id, projects]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(prev => ({ ...prev, project: false }));
      }
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(e.target)) {
        setDropdownOpen(prev => ({ ...prev, size: false }));
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const selectProject = (id) => {
    setFormData((prev) => ({ ...prev, project_id: id }));
    setDropdownOpen(prev => ({ ...prev, project: false }));
    setSearchTerm(prev => ({ ...prev, project: "" }));
    setErrors((prev) => ({ ...prev, project_id: "" }));
  };

  const selectSize = (size) => {
    setFormData(prev => ({ ...prev, p_size: size }));
    setDropdownOpen(prev => ({ ...prev, size: false }));
    setSearchTerm(prev => ({ ...prev, size: "" }));
    if (errors.p_size) {
      setErrors(prev => ({ ...prev, p_size: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccessPopup(false);
    const newErrors = {};
  
    // Validation
    if (!formData.project_id) newErrors.project_id = "Project is required";
    if (!formData.count) {
      newErrors.count = "Number of properties is required";
    } else if (isNaN(Number(formData.count))) {
      newErrors.count = "Must be a valid number";
    } else if (Number(formData.count) <= 0) {
      newErrors.count = "Must be greater than 0";
    } else if (Number(formData.count) > 1000) {
      newErrors.count = "Maximum 1000 properties at once";
    }
    
    // BSP validation - must be number and >= 0
    if (formData.bsp && isNaN(Number(formData.bsp))) {
      newErrors.bsp = "Must be a valid number";
    } else if (formData.bsp && Number(formData.bsp) < 0) {
      newErrors.bsp = "Must be zero or positive value";
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
  
    try {
      const res = await fetch(
        `${baseUrl}api/master/projects/${formData.project_id}/properties`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            no_of_properties: Number(formData.count),
            project_id: formData.project_id,
            p_type: formData.p_type || null,
            p_size: formData.p_size || null,
            bsp: formData.bsp ? Number(formData.bsp) : null,
            p_desc: formData.p_desc || null
          }),
        }
      );
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Failed to add properties");
      }
  
      setSuccessCount(Number(formData.count));
      setShowSuccessPopup(true);
      setFormData({
        project_id: "",
        count: "",
        p_type: "",
        p_size: "",
        bsp: "",
        p_desc: ""
      });
      setAvailableSizes([]);
    } catch (err) {
      console.error("Submit error:", err);
      setErrors((prev) => ({ ...prev, submit: err.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.project_name.toLowerCase().includes(searchTerm.project.toLowerCase())
  );

  const filteredSizes = availableSizes.filter(size =>
    size.toLowerCase().includes(searchTerm.size.toLowerCase())
  );

  const selectedProjectName = projects.find(
    (p) => p.project_id === formData.project_id
  )?.project_name;

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#09030cdb]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Add Properties to Project
        </h2>

        {errors.fetch && (
          <div className="p-3 bg-red-100 text-red-700 rounded">
            {errors.fetch}
          </div>
        )}

        {/* Project Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <label className="block font-medium text-gray-700 mb-1">
            Select Project <span className="text-red-500">*</span>
          </label>
          <div
            className={`w-full p-3 border rounded cursor-pointer flex justify-between items-center ${
              errors.project_id ? "border-red-500" : "border-gray-300"
            }`}
            onClick={() => setDropdownOpen(prev => ({ ...prev, project: true }))}
          >
            <span className={!formData.project_id ? "text-gray-400" : ""}>
              {selectedProjectName || "Select Project"}
            </span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                dropdownOpen.project ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {dropdownOpen.project && (
            <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <div className="p-2 border-b">
                <input
                  type="text"
                  value={searchTerm.project}
                  onChange={(e) => setSearchTerm(prev => ({ ...prev, project: e.target.value }))}
                  placeholder="Search projects..."
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                  autoFocus
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((p) => (
                    <div
                      key={p.project_id}
                      className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => selectProject(p.project_id)}
                    >
                      <div className="font-medium">{p.project_name}</div>
                      <div className="text-sm text-gray-500">
                        ID: {p.project_id}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-500 text-center">
                    No projects found
                  </div>
                )}
              </div>
            </div>
          )}

          {errors.project_id && (
            <p className="mt-1 text-sm text-red-600">{errors.project_id}</p>
          )}
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Number of Properties to Add <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="count"
            min="1"
            max="1000"
            placeholder="Enter number (e.g., 50)"
            className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
              errors.count
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
            value={formData.count}
            onChange={handleChange}
          />
          {errors.count && (
            <p className="mt-1 text-sm text-red-600">{errors.count}</p>
          )}
        </div>

        {/* Size Type Dropdown */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Size Type
          </label>
          <select
            name="p_type"
            value={formData.p_type}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select Size Type (Optional)</option>
            {sizeTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Project Size Dropdown with search */}
        <div className="relative" ref={sizeDropdownRef}>
          <label className="block font-medium text-gray-700 mb-1">
            Project Size (sq ft)
          </label>
          <div
            className={`w-full p-3 border rounded cursor-pointer flex justify-between items-center ${
              errors.p_size ? "border-red-500" : "border-gray-300"
            } ${!formData.project_id ? "bg-gray-100 cursor-not-allowed" : ""}`}
            onClick={() => formData.project_id && setDropdownOpen(prev => ({ ...prev, size: true }))}
          >
            <span className={!formData.p_size ? "text-gray-400" : ""}>
              {formData.p_size ? `${formData.p_size} sq ft` : "Select Project Size (Optional)"}
            </span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                dropdownOpen.size ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {dropdownOpen.size && (
            <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <div className="p-2 border-b">
                <input
                  type="text"
                  value={searchTerm.size}
                  onChange={(e) => setSearchTerm(prev => ({ ...prev, size: e.target.value }))}
                  placeholder="Search sizes..."
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                  autoFocus
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredSizes.length > 0 ? (
                  filteredSizes.map((size) => (
                    <div
                      key={size}
                      className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => selectSize(size)}
                    >
                      {size} sq ft
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-500 text-center">
                    {availableSizes.length === 0 ? "No sizes available for this project" : "No matching sizes found"}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            BSP (Price)
          </label>
          <input
            type="number"
            name="bsp"
            min="0"
            step="0.01"
            placeholder="Enter BSP (Optional)"
            className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
              errors.bsp
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
            value={formData.bsp}
            onChange={handleChange}
          />
          {errors.bsp && (
            <p className="mt-1 text-sm text-red-600">{errors.bsp}</p>
          )}
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Property Description
          </label>
          <select
            name="p_desc"
            value={formData.p_desc}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select Description (Optional)</option>
            {propertyDescOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-md font-medium text-white ${
              isSubmitting
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } transition-colors`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Add Properties"
            )}
          </button>
        </div>

        {errors.submit && (
          <div className="p-3 bg-red-100 text-red-700 rounded">
            {errors.submit}
          </div>
        )}
      </form>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Success!
              </h3>
              <div className="mt-2 text-sm text-gray-500">
                Successfully added {successCount} properties to project!
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                  onClick={() => setShowSuccessPopup(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPropertiesToProject;