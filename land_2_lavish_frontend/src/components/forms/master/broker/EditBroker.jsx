import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from 'prop-types';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ErrorMessage = ({ error }) => (
  <div className="text-sm text-red-600 mb-1 flex items-center">
    <svg className="mr-1 h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
    {error}
  </div>
);

ErrorMessage.propTypes = {
  error: PropTypes.string.isRequired
};

const InputField = React.memo(({ 
  label, 
  name, 
  type = "text", 
  required = false, 
  placeholder, 
  validationState, 
  validationError,
  value,
  onChange,
  onBlur,
  onKeyDown,
  error,
  inputRef,
  submitting
}) => {
  return (
    <div className="mb-1">
      <label className="text-lg font-medium">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {(error || validationState) && (
        <ErrorMessage error={error || validationError} />
      )}
      <div className="relative mt-1">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          ref={inputRef}
          onKeyDown={onKeyDown}
          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
            error || validationState ? "border-red-500 focus:ring-red-500" : "focus:ring-green-500"
          }`}
          placeholder={placeholder}
          required={required}
          disabled={submitting}
        />
      </div>
    </div>
  );
});

InputField.displayName = 'InputField';
InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  validationState: PropTypes.bool,
  validationError: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  error: PropTypes.string,
  inputRef: PropTypes.object,
  submitting: PropTypes.bool
};

const SearchableDropdown = React.memo(({
  options,
  value,
  onChange,
  placeholder,
  loading,
  error,
  disabled,
  inputRef,
  onKeyDown,
  displayKey = "name"
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter(option =>
    option[displayKey].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleSelect = (selectedValue) => {
    onChange({ target: { name: "project_id", value: selectedValue } });
    setIsOpen(false);
    setSearchTerm("");
  };

  const selectedOption = options.find(opt => opt.project_id === value || opt.broker_id === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 cursor-pointer ${
          error ? "border-red-500 focus:ring-red-500" : "focus:ring-green-500"
        } ${disabled ? "bg-gray-100" : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {loading ? (
          <div className="animate-pulse">Loading...</div>
        ) : selectedOption ? (
          selectedOption[displayKey]
        ) : (
          placeholder
        )}
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <input
            type="text"
            className="w-full p-2 border-b border-gray-300 focus:outline-none"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filteredOptions.length > 0) {
                handleSelect(filteredOptions[0].project_id || filteredOptions[0].broker_id);
              } else {
                onKeyDown && onKeyDown(e);
              }
            }}
          />
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <div
                  key={option.project_id || option.broker_id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(option.project_id || option.broker_id)}
                >
                  {option[displayKey]}
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

SearchableDropdown.displayName = 'SearchableDropdown';
SearchableDropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    project_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    broker_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string
  })).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  inputRef: PropTypes.object,
  onKeyDown: PropTypes.func,
  displayKey: PropTypes.string
};

const EditBroker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    project_id: "",
    name: "",
    address: "",
    mobile: "",
    email: "",
    phone: "",
    fax: "",
    income_tax_ward_no: "",
    dist_no: "",
    pan_no: "",
    net_commission_rate: ""
  });
  
  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [brokerLoading, setBrokerLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjectsLoading(true);
        const response = await axios.get('http://localhost:5000/api/master/get-projects');
        if (response.data.success) {
          setProjects(response.data.data || []);
        } else {
          setErrors({...errors, project: 'Failed to load projects'});
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setErrors({...errors, project: 'Failed to load projects'});
      } finally {
        setProjectsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  // Fetch broker data
  useEffect(() => {
    const fetchBroker = async () => {
      try {
        setBrokerLoading(true);
        const response = await axios.get(`http://localhost:5000/api/master/get-broker/${id}`);
        
        if (response.data.success) {
          const broker = response.data.data;
          setFormData({
            project_id: broker.project_id || "",
            name: broker.name || "",
            address: broker.address || "",
            mobile: broker.mobile || "",
            email: broker.email || "",
            phone: broker.phone || "",
            fax: broker.fax || "",
            income_tax_ward_no: broker.income_tax_ward_no || "",
            dist_no: broker.dist_no || "",
            pan_no: broker.pan_no || "",
            net_commission_rate: broker.net_commission_rate || ""
          });
        } else {
          throw new Error(response.data.message || "Failed to fetch broker");
        }
      } catch (error) {
        console.error("Error fetching broker:", error);
        setErrors({...errors, fetch: "Failed to load broker. Please try again later."});
      } finally {
        setBrokerLoading(false);
      }
    };

    if (id) {
      fetchBroker();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for PAN number
    if (name === "pan_no") {
      const upperCaseValue = value.toUpperCase();
      setFormData({ ...formData, [name]: upperCaseValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({...errors, [name]: ''});
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.mobile && (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile))) {
      newErrors.mobile = 'Mobile must be exactly 10 digits';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (formData.pan_no && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_no)) {
      newErrors.pan_no = 'Invalid PAN format (must be 10 characters: 5 letters, 4 numbers, 1 letter)';
    }
    
    if (formData.net_commission_rate && parseFloat(formData.net_commission_rate) < 0) {
      newErrors.net_commission_rate = 'Commission rate cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare data to submit
      const dataToSubmit = {
        broker_id: parseInt(id),
        name: formData.name,
        address: formData.address,
        mobile: formData.mobile,
        email: formData.email,
        phone: formData.phone,
        fax: formData.fax,
        income_tax_ward_no: formData.income_tax_ward_no,
        dist_no: formData.dist_no,
        pan_no: formData.pan_no,
        net_commission_rate: formData.net_commission_rate ? parseFloat(formData.net_commission_rate) : 0
      };

      // Add project_ids if we have a project_id
      if (formData.project_id) {
        dataToSubmit.project_ids = [parseInt(formData.project_id)];
      }

      const response = await axios.put(`http://localhost:5000/api/master/edit-broker/${id}`, dataToSubmit);
      
      if (response.data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/masters/broker-list');
        }, 2000);
      } else {
        setErrors({submit: response.data.message || 'Failed to update broker'});
      }
    } catch (err) {
      console.error('Error updating broker:', err);
      setErrors({submit: err.response?.data?.message || 'Failed to update broker'});
    } finally {
      setLoading(false);
    }
  };

  if (brokerLoading || projectsLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Edit Broker</h1>
          <button
            onClick={() => navigate("/masters/broker-list")}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back to Brokers
          </button>
        </div>
      
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="mb-4 p-3 bg-gray-100 rounded-md">
            <p className="font-medium">Editing Broker: {formData.name}</p>
            {formData.project_id && (
              <p className="text-sm text-gray-600">
                Project: {projects.find(p => p.project_id === parseInt(formData.project_id))?.project_name || 'Unknown Project'}
              </p>
            )}
          </div>
          
          {errors.fetch && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errors.fetch}
            </div>
          )}
          
          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errors.submit}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Selection */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project
              </label>
              <select
                name="project_id"
                value={formData.project_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="">Select Project</option>
                {projects.map(project => (
                  <option key={project.project_id} value={project.project_id}>
                    {project.project_name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Broker Name */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-md focus:outline-none focus:ring-2`}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            
            {/* Address */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                disabled={loading}
              />
            </div>
            
            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile
              </label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.mobile
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-md focus:outline-none focus:ring-2`}
                disabled={loading}
              />
              {errors.mobile && (
                <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-md focus:outline-none focus:ring-2`}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            
            {/* Fax */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fax
              </label>
              <input
                type="text"
                name="fax"
                value={formData.fax}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            
            {/* Income Tax Ward No */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Income Tax Ward No
              </label>
              <input
                type="text"
                name="income_tax_ward_no"
                value={formData.income_tax_ward_no}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            
            {/* District No */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dist No
              </label>
              <input
                type="text"
                name="dist_no"
                value={formData.dist_no}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            
            {/* PAN No */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PAN No
              </label>
              <input
                type="text"
                name="pan_no"
                value={formData.pan_no}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.pan_no
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-md focus:outline-none focus:ring-2`}
                disabled={loading}
              />
              {errors.pan_no && (
                <p className="text-red-500 text-xs mt-1">{errors.pan_no}</p>
              )}
            </div>
            
            {/* Net Commission Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Net Commission Rate (%)
              </label>
              <input
                type="number"
                name="net_commission_rate"
                value={formData.net_commission_rate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.net_commission_rate
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-md focus:outline-none focus:ring-2`}
                step="0.01"
                disabled={loading}
              />
              {errors.net_commission_rate && (
                <p className="text-red-500 text-xs mt-1">{errors.net_commission_rate}</p>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full p-3 text-white rounded-md transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
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
                  "Update Broker"
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-md w-full text-center">
              <div className="flex justify-center mb-4">
                <svg 
                  className="h-12 w-12 text-green-500" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
              <p className="text-gray-600 mb-6">
                Broker updated successfully.
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full animate-[progress_2s_ease-in-out]" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditBroker;