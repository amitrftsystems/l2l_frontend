import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import PropTypes from 'prop-types';
import { X } from "lucide-react";


const ErrorMessage = ({ error }) => (
  <div className="text-xs text-red-600 mt-1 flex items-start">
    <svg
      className="mr-1 h-3 w-3 flex-shrink-0 mt-0.5"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
    {error}
  </div>
);

ErrorMessage.propTypes = {
  error: PropTypes.string.isRequired
};

const InputField = React.memo(
  ({
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
    submitting,
    showErrorInline = false,
    submitted = false,
  }) => {
    const showMandatoryError = submitted && required && !value;
    const showValidationError = validationState;
    const showError = showMandatoryError || error;

    return (
      <>
      <div className="mb-4 flex items-start">
        <label className="w-1/4 text-sm font-medium mt-2">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
        <div className="w-3/4">
          <div className="relative">
            <input
              type={type}
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              ref={inputRef}
              onKeyDown={onKeyDown}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-1 ${
                showError || showValidationError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-500"
              }`}
              placeholder={placeholder}
              required={required}
              disabled={submitting}
            />
            {(showError || showValidationError) && showErrorInline && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <X className="h-4 w-4 text-red-500" />
              </div>
            )}
          </div>
          {showError && <ErrorMessage error={error || `${label} is required`} />}
          {showValidationError && <ErrorMessage error={validationError} />}
        </div>
      </div>
      </>
    );
  }
);

InputField.displayName = 'InputField';
InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  nextField: PropTypes.string,
  validationState: PropTypes.bool,
  validationError: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  error: PropTypes.string,
  inputRef: PropTypes.object,
  submitting: PropTypes.bool,
  showErrorInline: PropTypes.bool,
  submitted: PropTypes.bool
};

const SearchableDropdown = React.memo(
  ({
    options,
    value,
    onChange,
    placeholder,
    loading,
    error,
    disabled,
    inputRef,
    onKeyDown,
    showErrorInline = false,
    required = false,
    submitted = false,
  }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const filteredOptions = options.filter((option) =>
      option.project_name.toLowerCase().includes(searchTerm.toLowerCase())
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

    const handleSelect = (projectId) => {
      onChange({ target: { name: "project_id", value: projectId } });
      setIsOpen(false);
      setSearchTerm("");
    };

    const selectedProject = options.find((opt) => opt.project_id === value);
    const showError = submitted && required && !value;

    return (
      <div className="mb-4 flex items-start">
        <label className="w-1/4 text-sm font-medium mt-2">
          {placeholder} {required && <span className="text-red-600">*</span>}
        </label>
        <div className="w-3/4">
          <div className="relative" ref={dropdownRef}>
            <div
              className={`w-full p-2 border rounded focus:outline-none focus:ring-1 cursor-pointer ${
                showError || error
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-500"
              } ${disabled ? "bg-gray-100" : ""}`}
              onClick={() => !disabled && setIsOpen(!isOpen)}
            >
              {loading ? (
                <div className="text-sm">Loading projects...</div>
              ) : selectedProject ? (
                selectedProject.project_name
              ) : (
                <span className="text-gray-400">{placeholder}</span>
              )}
              {(showError || error) && showErrorInline && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <X className="h-4 w-4 text-red-500" />
                </div>
              )}
            </div>
            {showError && <ErrorMessage error={`${placeholder} is required`} />}
            {error && <ErrorMessage error={error} />}

            {isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
                <input
                  type="text"
                  className="w-full p-2 border-b border-gray-300 focus:outline-none text-sm"
                  placeholder="Type to search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  ref={inputRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && filteredOptions.length > 0) {
                      handleSelect(filteredOptions[0].project_id);
                    } else {
                      onKeyDown && onKeyDown(e);
                    }
                  }}
                />
                <div className="max-h-60 overflow-y-auto">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((project) => (
                      <div
                        key={project.project_id}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleSelect(project.project_id)}
                      >
                        {project.project_name}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500 text-sm">No projects found</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

SearchableDropdown.displayName = 'SearchableDropdown';
SearchableDropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    project_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    project_name: PropTypes.string.isRequired
  })).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  inputRef: PropTypes.object,
  onKeyDown: PropTypes.func,
  showErrorInline: PropTypes.bool,
  required: PropTypes.bool,
  submitted: PropTypes.bool
};

const AddBroker = () => {
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
  });

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [validationStates, setValidationStates] = useState({
    broker_id: false,
    mobile: false,
    email: false,
    phone: false,
    panNo: false,
  });
  const [validationErrors] = useState({
    broker_id: "Only numbers allowed",
    mobile: "Must be exactly 10 digits",
    email: "Invalid email format",
    phone: "Invalid phone number (only numbers, +, - and spaces allowed)",
    panNo: "Invalid PAN format (must be 10 characters: 5 letters, 4 numbers, 1 letter)",
  });

  const projectIdRef = useRef(null);
  const brokerIdRef = useRef(null);
  const nameRef = useRef(null);
  const addressRef = useRef(null);
  const mobileRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const faxRef = useRef(null);
  const incomeTaxWardNoRef = useRef(null);
  const disttNoRef = useRef(null);
  const panNoRef = useRef(null);

  const inputRefs = useMemo(() => ({
    project_id: projectIdRef,
    broker_id: brokerIdRef,
    name: nameRef,
    address: addressRef,
    mobile: mobileRef,
    email: emailRef,
    phone: phoneRef,
    fax: faxRef,
    incomeTaxWardNo: incomeTaxWardNoRef,
    disttNo: disttNoRef,
    panNo: panNoRef,
  }), []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/master/get-projects"
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.success) setProjects(data.data);
        else setErrors({ fetch: data.message || "Failed to load projects" });
      } catch (error) {
        setErrors({ fetch: error.message });
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      if (name === "panNo") {
        const cleanedValue = value.replace(/[^a-zA-Z0-9]/g, "");
        const upperValue = cleanedValue.toUpperCase();
        setFormData((prev) => ({ ...prev, [name]: upperValue }));

        if (errors.panNo) {
          setErrors((prev) => ({ ...prev, panNo: "" }));
        }
        return;
      }

      if (name === "broker_id") {
        const isValid = value && !/^\d*$/.test(value);
        setValidationStates((prev) => ({ ...prev, [name]: isValid }));
        if (!isValid && errors.broker_id) {
          setErrors((prev) => ({ ...prev, broker_id: "" }));
        }
      }

      if (name === "mobile") {
        const onlyNums = value.replace(/[^0-9]/g, "");
        if (onlyNums !== value) {
          e.target.value = formData.mobile;
          return;
        }
        const isValid = value.length > 10;
        setValidationStates((prev) => ({ ...prev, [name]: isValid }));
        if (!isValid && errors.mobile) {
          setErrors((prev) => ({ ...prev, mobile: "" }));
        }
      }

      if (name === "phone") {
        const phoneRegex = /^[\d+\-\s]{6,15}$/;
        const isValid = value && !phoneRegex.test(value);
        setValidationStates((prev) => ({ ...prev, [name]: isValid }));
        if (!isValid && errors.phone) {
          setErrors((prev) => ({ ...prev, phone: "" }));
        }
      }

      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors, formData.mobile]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      
      if (name === "mobile") {
        const isValid = value && value.length !== 10;
        setValidationStates((prev) => ({ ...prev, [name]: isValid }));
      }
      
      if (name === "email") {
        const isValid = value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        setValidationStates((prev) => ({ ...prev, [name]: isValid }));
      }
      
      if (name === "phone") {
        const phoneRegex = /^[\d+\-\s]{6,15}$/;
        const isValid = value && !phoneRegex.test(value);
        setValidationStates((prev) => ({ ...prev, [name]: isValid }));
      }
      
      if (name === "panNo") {
        const isValid =
          value && (value.length < 10 || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value));
        setValidationStates((prev) => ({ ...prev, [name]: isValid }));
      }
    },
    []
  );

  const handleKeyDown = useCallback(
    (e, nextField) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (nextField && inputRefs[nextField]?.current) {
          inputRefs[nextField].current.focus();
        }
      }
    },
    [inputRefs]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setSubmitting(true);
    setErrors({});

    // Define all mandatory fields
    const mandatoryFields = [
      { name: 'project_id', message: 'Location is required' },
      { name: 'broker_id', message: 'Code is required' },
      { name: 'name', message: 'Name is required' },
      { name: 'address', message: 'Address is required' }
    ];

    // Check for empty mandatory fields
    const newErrors = {};
    mandatoryFields.forEach(field => {
      if (!formData[field.name]) {
        newErrors[field.name] = field.message;
      }
    });

    // Validate mobile format if provided
    if (formData.mobile && formData.mobile.length !== 10) {
      setValidationStates((prev) => ({ ...prev, mobile: true }));
    }

    // Validate email format if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setValidationStates((prev) => ({ ...prev, email: true }));
    }

    // Validate phone format if provided
    if (formData.phone && !/^[\d+\-\s]{6,15}$/.test(formData.phone)) {
      setValidationStates((prev) => ({ ...prev, phone: true }));
    }

    // Validate PAN format if provided
    if (
      formData.panNo &&
      (formData.panNo.length < 10 ||
        !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNo))
    ) {
      setValidationStates((prev) => ({ ...prev, panNo: true }));
    }

    // If there are any errors, stop submission
    if (Object.keys(newErrors).length > 0 || Object.values(validationStates).some(v => v)) {
      setErrors(newErrors);
      setSubmitting(false);
      
      // Focus on the first error field
      const firstErrorField = mandatoryFields.find(field => newErrors[field.name])?.name || 
                            Object.keys(validationStates).find(field => validationStates[field]);
      if (firstErrorField && inputRefs[firstErrorField]?.current) {
        inputRefs[firstErrorField].current.focus();
      }
      
      return;
    }

    // Submit the form if validation passes
    try {
      const response = await fetch(
        "http://localhost:5000/api/master/add-broker",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            project_id: Number(formData.project_id),
            code: formData.broker_id,
            name: formData.name,
            address: formData.address,
            mobile: formData.mobile,
            email: formData.email,
            phone: formData.phone,
            fax: formData.fax,
            income_tax_ward_no: formData.incomeTaxWardNo,
            dist_no: formData.disttNo,
            pan_no: formData.panNo,
            net_commission_rate: 0
          }),
        }
      );

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        if (data.field) {
          setErrors((prev) => ({
            ...prev,
            [data.field]: data.message,
          }));

          if (inputRefs[data.field]?.current) {
            inputRefs[data.field].current.focus();
            inputRefs[data.field].current.select();
          }
        } else {
          throw new Error(data.message || "Failed to add broker");
        }
      } else {
        alert("Broker added successfully!");
        window.history.back();
        console.log("Broker added successfully!");
        setFormData({
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
        });
      }
    } catch (error) {
      if (error.message.includes("Broker with ID")) {
        setErrors((prev) => ({ ...prev, broker_id: error.message }));
      } else {
        setErrors((prev) => ({ ...prev, submit: error.message }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#040009d3]">
      <form
        onSubmit={handleSubmit}
        className="relative w-[600px] bg-white p-6 rounded shadow"
      >
        <h2 className="text-xl font-bold text-center text-black mb-2">
          Broker Details
        </h2>
        <p className="text-center text-xs text-red-500 mb-4">
          Fields marked by <span className="text-red-600">*</span> are mandatory
        </p>

        {errors.fetch && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {errors.fetch}
          </div>
        )}

        <div className="grid grid-cols-1 gap-1">
          {/* Project Dropdown */}
          <SearchableDropdown
            options={projects}
            value={formData.project_id}
            onChange={handleChange}
            placeholder="Select Location"
            loading={loading}
            error={errors.project_id}
            disabled={submitting}
            inputRef={inputRefs.project_id}
            onKeyDown={(e) => handleKeyDown(e, "broker_id")}
            showErrorInline={!!errors.project_id}
            required={true}
            submitted={submitted}
          />

          {/* Broker ID */}
          <InputField
            label="Code"
            name="broker_id"
            type="text"
            required={true}
            placeholder="Enter code"
            nextField="name"
            validationState={validationStates.broker_id}
            validationError={validationErrors.broker_id}
            value={formData.broker_id}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, "name")}
            error={errors.broker_id}
            inputRef={inputRefs.broker_id}
            submitting={submitting}
            showErrorInline={validationStates.broker_id || !!errors.broker_id}
            submitted={submitted}
          />

          {/* Name */}
          <InputField
            label="Name"
            name="name"
            type="text"
            required={true}
            placeholder="Enter name"
            nextField="address"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, "address")}
            error={errors.name}
            inputRef={inputRefs.name}
            submitting={submitting}
            showErrorInline={!!errors.name}
            submitted={submitted}
          />

          {/* Address */}
          <InputField
            label="Address"
            name="address"
            type="text"
            required={true}
            placeholder="Enter address"
            nextField="mobile"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, "mobile")}
            error={errors.address}
            inputRef={inputRefs.address}
            submitting={submitting}
            showErrorInline={!!errors.address}
            submitted={submitted}
          />

          {/* Mobile */}
          <InputField
            label="Mobile"
            name="mobile"
            type="tel"
            placeholder="Enter mobile (10 digits)"
            nextField="email"
            validationState={validationStates.mobile}
            validationError={validationErrors.mobile}
            value={formData.mobile}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, "email")}
            error={errors.mobile}
            inputRef={inputRefs.mobile}
            submitting={submitting}
            showErrorInline={validationStates.mobile || !!errors.mobile}
            submitted={submitted}
          />

          {/* Email */}
          <InputField
            label="E-Mail"
            name="email"
            type="email"
            placeholder="Enter email"
            nextField="phone"
            validationState={validationStates.email}
            validationError={validationErrors.email}
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, "phone")}
            error={errors.email}
            inputRef={inputRefs.email}
            submitting={submitting}
            showErrorInline={validationStates.email || !!errors.email}
            submitted={submitted}
          />

          {/* Phone */}
          <InputField
            label="Phone"
            name="phone"
            type="tel"
            placeholder="Enter phone"
            nextField="fax"
            validationState={validationStates.phone}
            validationError={validationErrors.phone}
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, "fax")}
            error={errors.phone}
            inputRef={inputRefs.phone}
            submitting={submitting}
            showErrorInline={validationStates.phone || !!errors.phone}
            submitted={submitted}
          />

          {/* Fax */}
          <InputField
            label="Fax"
            name="fax"
            type="tel"
            placeholder="Enter fax"
            nextField="incomeTaxWardNo"
            value={formData.fax}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, "incomeTaxWardNo")}
            error={errors.fax}
            inputRef={inputRefs.fax}
            submitting={submitting}
            showErrorInline={!!errors.fax}
            submitted={submitted}
          />

          {/* Income Tax Ward No. */}
          <InputField
            label="Income Tax"
            name="incomeTaxWardNo"
            type="text"
            placeholder="Enter income tax"
            nextField="disttNo"
            value={formData.incomeTaxWardNo}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, "disttNo")}
            error={errors.incomeTaxWardNo}
            inputRef={inputRefs.incomeTaxWardNo}
            submitting={submitting}
            showErrorInline={!!errors.incomeTaxWardNo}
            submitted={submitted}
          />

          {/* Distt No. */}
          <InputField
            label="Distr No."
            name="disttNo"
            type="text"
            placeholder="Enter district no."
            nextField="panNo"
            value={formData.disttNo}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, "panNo")}
            error={errors.disttNo}
            inputRef={inputRefs.disttNo}
            submitting={submitting}
            showErrorInline={!!errors.disttNo}
            submitted={submitted}
          />

          {/* Pan No. */}
          <InputField
            label="Pan No."
            name="panNo"
            type="text"
            placeholder="Enter PAN number"
            validationState={validationStates.panNo}
            validationError={validationErrors.panNo}
            value={formData.panNo}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.panNo}
            inputRef={inputRefs.panNo}
            submitting={submitting}
            showErrorInline={validationStates.panNo || !!errors.panNo}
            submitted={submitted}
          />

          {errors.submit && (
            <div className="mt-2 p-2 bg-red-100 text-red-700 rounded text-sm text-center">
              {errors.submit.startsWith("<!DOCTYPE html>")
                ? "Server error occurred"
                : errors.submit}
            </div>
          )}

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="w-1/3 p-2 bg-green-400 text-white rounded hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
              disabled={loading || submitting}
            >
              {submitting ? "Submitting..." : "Add"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddBroker;