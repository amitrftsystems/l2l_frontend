import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Select Project, 2: Select Broker, 3: Edit Form
  const [formData, setFormData] = useState({
    project_id: "",
    broker_id: "",
    name: "",
    address: "",
    mobile: "",
    email: "",
    phone: "",
    fax: "",
    incomeTaxWardNo: "",
    disttNo: "",
    panNo: "",
    netCommissionRate: "0.00"
  });

  const [projects, setProjects] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState({
    projects: true,
    brokers: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showMobileInvalid, setShowMobileInvalid] = useState(false);
  const [showEmailInvalid, setShowEmailInvalid] = useState(false);
  const [showPhoneInvalid, setShowPhoneInvalid] = useState(false);
  const [showPanNoInvalid, setShowPanNoInvalid] = useState(false);
  const [showCommissionInvalid, setShowCommissionInvalid] = useState(false);
  
  const inputRefs = {
    project_id: useRef(null),
    broker_id: useRef(null),
    name: useRef(null),
    address: useRef(null),
    mobile: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    fax: useRef(null),
    incomeTaxWardNo: useRef(null),
    disttNo: useRef(null),
    panNo: useRef(null),
    netCommissionRate: useRef(null)
  };

  // Fetch all projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/master/get-projects");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.success) setProjects(data.data);
        else setErrors({ fetch: data.message || "Failed to load projects" });
      } catch (error) {
        setErrors({ fetch: error.message });
      } finally {
        setLoading(prev => ({ ...prev, projects: false }));
      }
    };
    fetchProjects();
  }, []);

  // Fetch brokers when project is selected
  useEffect(() => {
    if (formData.project_id && step === 1) {
      const fetchBrokers = async () => {
        setLoading(prev => ({ ...prev, brokers: true }));
        try {
          const response = await fetch(`http://localhost:5000/api/master/get-brokers?project_id=${formData.project_id}`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          if (data.success) setBrokers(data.data);
          else setErrors({ fetch: data.message || "Failed to load brokers" });
        } catch (error) {
          setErrors({ fetch: error.message });
        } finally {
          setLoading(prev => ({ ...prev, brokers: false }));
        }
      };
      fetchBrokers();
    }
  }, [formData.project_id, step]);

  // Load broker details when broker is selected
  useEffect(() => {
    if (formData.broker_id && step === 2) {
      const fetchBrokerDetails = async () => {
        setLoading(prev => ({ ...prev, brokers: true }));
        try {
          const response = await fetch(`http://localhost:5000/api/master/get-broker/:broker_id/${formData.broker_id}`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          if (data.success) {
            setFormData({
              ...formData,
              name: data.data.name,
              address: data.data.address,
              mobile: data.data.mobile || "",
              email: data.data.email || "",
              phone: data.data.phone || "",
              fax: data.data.fax || "",
              incomeTaxWardNo: data.data.income_tax_ward_no || "",
              disttNo: data.data.dist_no || "",
              panNo: data.data.pan_no || "",
              netCommissionRate: data.data.net_commission_rate || "0.00"
            });
            setStep(3);
          } else {
            setErrors({ fetch: data.message || "Failed to load broker details" });
          }
        } catch (error) {
          setErrors({ fetch: error.message });
        } finally {
          setLoading(prev => ({ ...prev, brokers: false }));
        }
      };
      fetchBrokerDetails();
    }
  }, [formData.broker_id, step]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // Handle PAN number uppercase conversion first
    if (name === "panNo") {
      // Remove any non-alphanumeric characters and convert to uppercase
      const cleanedValue = value.replace(/[^a-zA-Z0-9]/g, '');
      const upperValue = cleanedValue.toUpperCase();
      setFormData(prev => ({ ...prev, [name]: upperValue }));
      
      // Clear PAN error if exists
      if (errors.panNo) {
        setErrors(prev => ({ ...prev, panNo: '' }));
      }
      return;
    }

    // Handle commission rate validation
    if (name === "netCommissionRate") {
      const numericValue = value.replace(/[^0-9.]/g, '');
      const decimalParts = numericValue.split('.');
      if (decimalParts.length > 1 && decimalParts[1].length > 2) {
        return; // Don't allow more than 2 decimal places
      }
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      
      // Validate commission rate is >= 0
      if (numericValue && parseFloat(numericValue) < 0) {
        setShowCommissionInvalid(true);
      } else {
        setShowCommissionInvalid(false);
      }
      return;
    }

    if (name === "mobile") {
      const onlyNums = value.replace(/[^0-9]/g, '');
      if (onlyNums !== value) { 
        e.target.value = formData.mobile; 
        return; 
      }
      if (value.length > 10) setShowMobileInvalid(true);
      else setShowMobileInvalid(false);
    }
    
    if (name === "phone") {
      const phoneRegex = /^[\d+\-\s]{6,15}$/;
      if (value && !phoneRegex.test(value)) setShowPhoneInvalid(true);
      else setShowPhoneInvalid(false);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }, [errors, formData.mobile, formData.panNo]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      if (value && value.length !== 10) setShowMobileInvalid(true);
      else setShowMobileInvalid(false);
    }
    if (name === "email" && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) setShowEmailInvalid(true);
      else setShowEmailInvalid(false);
    }
    if (name === "phone" && value) {
      const phoneRegex = /^[\d+\-\s]{6,15}$/;
      if (!phoneRegex.test(value)) setShowPhoneInvalid(true);
      else setShowPhoneInvalid(false);
    }
    if (name === "panNo" && value) {
      if (value.length < 10 || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) setShowPanNoInvalid(true);
      else setShowPanNoInvalid(false);
    }
    if (name === "netCommissionRate" && value) {
      if (parseFloat(value) < 0) setShowCommissionInvalid(true);
      else setShowCommissionInvalid(false);
    }
  }, []);

  const handleProjectSelect = (projectId) => {
    setFormData(prev => ({ ...prev, project_id: projectId, broker_id: "" }));
    setStep(2);
  };

  const handleBrokerSelect = (brokerId) => {
    setFormData(prev => ({ ...prev, broker_id: brokerId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.address) newErrors.address = "Address is required";
    
    if (formData.mobile && formData.mobile.length !== 10) {
      setShowMobileInvalid(true);
      newErrors.mobile = "Must be exactly 10 digits";
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setShowEmailInvalid(true);
      newErrors.email = "Invalid email format";
    }
    
    if (formData.phone && !/^[\d+\-\s]{6,15}$/.test(formData.phone)) {
      setShowPhoneInvalid(true);
      newErrors.phone = "Invalid phone number";
    }
    
    if (formData.panNo && (formData.panNo.length < 10 || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNo))) {
      setShowPanNoInvalid(true);
      newErrors.panNo = "Invalid PAN format (must be 10 characters: 5 letters, 4 numbers, 1 letter)";
    }
    
    if (formData.netCommissionRate && parseFloat(formData.netCommissionRate) < 0) {
      setShowCommissionInvalid(true);
      newErrors.netCommissionRate = "Commission rate cannot be negative";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/master/edit-broker/:broker__id/${formData.broker_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          mobile: formData.mobile,
          email: formData.email,
          phone: formData.phone,
          fax: formData.fax,
          income_tax_ward_no: formData.incomeTaxWardNo,
          dist_no: formData.disttNo,
          pan_no: formData.panNo,
          net_commission_rate: parseFloat(formData.netCommissionRate) || 0
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.field) {
          setErrors(prev => ({
            ...prev,
            [data.field]: data.message
          }));
          
          if (inputRefs[data.field]?.current) {
            inputRefs[data.field].current.focus();
            inputRefs[data.field].current.select();
          }
        } else {
          throw new Error(data.message || "Failed to update broker");
        }
      } else {
        alert("Broker updated successfully!");
        navigate(-1); // Go back to previous page
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, submit: error.message }));
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: // Select Project
        return (
          <div className="mb-4">
            <label className="text-lg font-medium">
              Project <span className="text-red-600">*</span>
            </label>
            {errors.project_id && <ErrorMessage error={errors.project_id} />}
            <div className="relative mt-1">
              <SearchableDropdown
                options={projects}
                value={formData.project_id}
                onChange={(e) => handleProjectSelect(e.target.value)}
                placeholder="Select Project"
                loading={loading.projects}
                error={errors.project_id}
                disabled={submitting}
                inputRef={inputRefs.project_id}
              />
            </div>
          </div>
        );

      case 2: // Select Broker
        return (
          <div className="mb-4">
            <label className="text-lg font-medium">
              Broker <span className="text-red-600">*</span>
            </label>
            {errors.broker_id && <ErrorMessage error={errors.broker_id} />}
            <div className="relative mt-1">
              <SearchableDropdown
                options={brokers}
                value={formData.broker_id}
                onChange={(e) => handleBrokerSelect(e.target.value)}
                placeholder="Select Broker"
                loading={loading.brokers}
                error={errors.broker_id}
                disabled={submitting || loading.brokers}
                inputRef={inputRefs.broker_id}
                displayKey="name"
              />
            </div>
          </div>
        );

      case 3: // Edit Form
        return (
          <>
            <div className="mb-4 p-2 bg-gray-100 rounded-md">
              <p className="font-medium">Editing Broker: {formData.name}</p>
              <p className="text-sm">Project: {projects.find(p => p.project_id === formData.project_id)?.project_name}</p>
            </div>

            {/* Name */}
            <InputField
              label="Name"
              name="name"
              type="text"
              required={true}
              placeholder="Enter broker name"
              validationState={showPanNoInvalid}
              validationError="Invalid PAN format (must be 10 characters: 5 letters, 4 numbers, 1 letter)"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              inputRef={inputRefs.name}
              submitting={submitting}
            />

            {/* Address */}
            <InputField
              label="Address"
              name="address"
              type="text"
              required={true}
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.address}
              inputRef={inputRefs.address}
              submitting={submitting}
            />

            {/* Mobile */}
            <InputField
              label="Mobile"
              name="mobile"
              type="tel"
              placeholder="Enter mobile number"
              validationState={showMobileInvalid}
              validationError="Must be exactly 10 digits"
              value={formData.mobile}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.mobile}
              inputRef={inputRefs.mobile}
              submitting={submitting}
            />

            {/* Email */}
            <InputField
              label="E-Mail"
              name="email"
              type="email"
              placeholder="Enter email"
              validationState={showEmailInvalid}
              validationError="Invalid email format"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              inputRef={inputRefs.email}
              submitting={submitting}
            />

            {/* Phone */}
            <InputField
              label="Phone"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              validationState={showPhoneInvalid}
              validationError="Invalid phone number (only numbers, +, - and spaces allowed)"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.phone}
              inputRef={inputRefs.phone}
              submitting={submitting}
            />

            {/* Fax */}
            <InputField
              label="Fax"
              name="fax"
              type="tel"
              placeholder="Enter fax number"
              value={formData.fax}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fax}
              inputRef={inputRefs.fax}
              submitting={submitting}
            />

            {/* Income Tax Ward No. */}
            <InputField
              label="Income Tax Ward No."
              name="incomeTaxWardNo"
              type="text"
              placeholder="Enter income tax ward no."
              value={formData.incomeTaxWardNo}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.incomeTaxWardNo}
              inputRef={inputRefs.incomeTaxWardNo}
              submitting={submitting}
            />

            {/* Distt No. */}
            <InputField
              label="Distt No."
              name="disttNo"
              type="text"
              placeholder="Enter district no."
              value={formData.disttNo}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.disttNo}
              inputRef={inputRefs.disttNo}
              submitting={submitting}
            />

            {/* Pan No. */}
            <InputField
              label="Pan No."
              name="panNo"
              type="text"
              placeholder="Enter PAN number"
              validationState={showPanNoInvalid}
              validationError="Invalid PAN format (must be 10 characters: 5 letters, 4 numbers, 1 letter)"
              value={formData.panNo}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.panNo}
              inputRef={inputRefs.panNo}
              submitting={submitting}
            />

            {/* Net Commission Rate */}
            <InputField
              label="Net Commission Rate (%)"
              name="netCommissionRate"
              type="number"
              step="0.01"
              placeholder="Enter commission rate"
              validationState={showCommissionInvalid}
              validationError="Commission rate cannot be negative"
              value={formData.netCommissionRate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.netCommissionRate}
              inputRef={inputRefs.netCommissionRate}
              submitting={submitting}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#272727]">
      <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()} className="relative w-[700px] h-auto bg-white p-10 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-extrabold text-black-800 text-center mb-2">
          <span className="px-4 py-2">
            {step === 1 ? "Select Project" : step === 2 ? "Select Broker" : "Edit Broker Details"}
          </span>
        </h2>
        
        {errors.fetch && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
            {errors.fetch}
          </div>
        )}

        <div className="grid grid-cols-1 gap-2">
          {renderStep()}

          {errors.submit && (
            <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-md text-center">
              {errors.submit.startsWith("<!DOCTYPE html>") 
                ? "Server error occurred" 
                : errors.submit}
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                className="w-1/3 p-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                onClick={() => setStep(step - 1)}
                disabled={submitting}
              >
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                className={`w-1/3 p-3 text-white rounded-md transition ml-auto ${
                  (step === 1 && !formData.project_id) || 
                  (step === 2 && !formData.broker_id) ? 
                  "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
                onClick={() => setStep(step + 1)}
                disabled={
                  submitting || 
                  (step === 1 && !formData.project_id) || 
                  (step === 2 && !formData.broker_id)
                }
              >
                {step === 1 ? "Select Broker" : "Continue"}
              </button>
            ) : (
              <button
                type="submit"
                className="w-1/3 p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition ml-auto"
                disabled={
                  submitting ||
                  showMobileInvalid ||
                  showEmailInvalid ||
                  showPhoneInvalid ||
                  showPanNoInvalid ||
                  showCommissionInvalid ||
                  !formData.name ||
                  !formData.address
                }
              >
                {submitting ? "Updating..." : "Update Broker"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditBroker;