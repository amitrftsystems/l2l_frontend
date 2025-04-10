import  { useState, useEffect } from "react";
import PropTypes from 'prop-types';
// import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {  CheckCircle } from "lucide-react";

const AddProject = () => {
  const [formData, setFormData] = useState({
    project_name: "",
    company_name: "",
    address: "",
    landmark: "",
    plan: "",
    size: "",
    measuring_unit: "",
    sign_image_name: "",
  });

  const [errors, setErrors] = useState({
    project_name: "",
    company_name: "",
    address: "",
    plan: "",
    size: "",
    measuring_unit: "",
  });

  const [touched, setTouched] = useState({
    project_name: false,
    company_name: false,
    address: false,
    plan: false,
    size: false,
    measuring_unit: false,
  });

  const [installmentOptions, setInstallmentOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchInstallments = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/master/installment-plans",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          const options = data.data.map((installment) => ({
            value: installment.installment_no,
            label: `${installment.installment_no}`,
          }));
          setInstallmentOptions(options);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error) {
        console.error("Error fetching installments:", error);
        setInstallmentOptions([]);
        setErrors((prev) => ({ ...prev, plan: "Failed to load installments" }));
      }
    };

    fetchInstallments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field, value) => {
    let error = "";
    if (field === "plan" && !value) {
      error = "Installment number is required";
    } else if (
      (field === "project_name" ||
        field === "company_name" ||
        field === "address") &&
      !value
    ) {
      error = "Please fill out this field";
    } else if (field === "measuring_unit" && !value) {
      error = "Measuring unit is required";
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.project_name) {
      newErrors.project_name = "Project name is required";
      isValid = false;
    }
    if (!formData.company_name) {
      newErrors.company_name = "Company name is required";
      isValid = false;
    }
    if (!formData.address) {
      newErrors.address = "Address is required";
      isValid = false;
    }
    if (!formData.plan) {
      newErrors.plan = "Installment number is required";
      isValid = false;
    }
    if (!formData.size) {
      newErrors.size = "Size is required";
      isValid = false;
    }
    if (!formData.measuring_unit) {
      newErrors.measuring_unit = "Measuring unit is required";
      isValid = false;
    }
    setErrors(newErrors);
    setTouched({
      project_name: true,
      company_name: true,
      address: true,
      plan: true,
      size: true,
      measuring_unit: true,
    });

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    const formattedData = {
      ...formData,
      plan: parseInt(formData.plan, 10) || null,
      size: parseInt(formData.size, 10) || null,  
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/master/add-project",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setErrors((prev) => ({
            ...prev,
            project_name: data.message || "This project already exists",
          }));
          throw new Error(data.message || "Duplicate entry");
        }
        throw new Error(data.message || "Failed to submit project");
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        // navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
      if (!error.message.includes("Duplicate")) {
        setErrors((prev) => ({ ...prev, project_name: error.message }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "40px",
      height: "40px",
      border: `1px solid ${
        errors.plan && touched.plan ? "#ef4444" : "#000000"
      }`,
      borderRadius: "0.375rem",
      boxShadow: state.isFocused
        ? `0 0 0 2px ${errors.plan && touched.plan ? "#fee2e2" : "#dcfce7"}`
        : "none",
      "&:hover": {
        borderColor: errors.plan && touched.plan ? "#ef4444" : "#059669",
      },
    }),
    menu: (provided) => ({
      ...provided,
      marginTop: "4px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#f0fdf4" : "white",
      color: "#374151",
      padding: "8px 12px",
      "&:active": {
        backgroundColor: "#dcfce7",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      lineHeight: "1.5",
      padding: "0",
    }),
    placeholder: (provided) => ({
      ...provided,
      lineHeight: "1.5",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 8px",
      display: "flex",
      alignItems: "center",
      height: "100%",
    }),
  };

  const CustomOption = ({ innerProps, label, isFocused }) => (
    <div
      {...innerProps}
      className={`px-3 py-2 cursor-pointer ${
        isFocused ? "bg-green-50" : "bg-white"
      } hover:bg-green-50 transition-colors`}
    >
      {label}
    </div>
  );

  CustomOption.propTypes = {
    innerProps: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    isFocused: PropTypes.bool.isRequired
  };

  const CustomSingleValue = ({ innerProps, data }) => (
    <div {...innerProps} className="ml-2">
      {data.label}
    </div>
  );

  CustomSingleValue.propTypes = {
    innerProps: PropTypes.object.isRequired,
    data: PropTypes.shape({
      label: PropTypes.string.isRequired
    }).isRequired
  };

  const ClearIndicator = ({ innerProps }) => (
    <div {...innerProps} className="mr-2 cursor-pointer">
    </div>
  );

  ClearIndicator.propTypes = {
    innerProps: PropTypes.object.isRequired
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 p-30">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl relative border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-black mb-2">
          Project Master
        </h2>
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-600">
            Fields marked by <span className="text-red-500 font-medium">*</span>{" "}
            are mandatory
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Project Name */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Project <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
              onBlur={() => handleBlur("project_name")}
              className={`w-full px-3 py-2 border ${
                errors.project_name && touched.project_name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-black focus:ring-green-500"
              } rounded-md focus:outline-none focus:ring-2`}
            />
            {errors.project_name && touched.project_name && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                {errors.project_name}
              </p>
            )}
          </div>

          {/* Company Name */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              onBlur={() => handleBlur("company_name")}
              className={`w-full px-3 py-2 border ${
                errors.company_name && touched.company_name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-black focus:ring-green-500"
              } rounded-md focus:outline-none focus:ring-2`}
            />
            {errors.company_name && touched.company_name && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                {errors.company_name}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2 space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={() => handleBlur("address")}
              className={`w-full px-3 py-2 border ${
                errors.address && touched.address
                  ? "border-red-500 focus:ring-red-500"
                  : "border-black focus:ring-green-500"
              } rounded-md focus:outline-none focus:ring-2`}
            />
            {errors.address && touched.address && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                {errors.address}
              </p>
            )}
          </div>

          {/* Landmark */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Landmark
            </label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Installment Dropdown */}
          <div className="space-y-1 w-full">
            <label className="block text-sm font-medium text-gray-700">
              Installment No <span className="text-red-500">*</span>
            </label>
            <Select
              options={installmentOptions}
              styles={customStyles}
              components={{
                Option: CustomOption,
                SingleValue: CustomSingleValue,
                IndicatorSeparator: () => null,
                DropdownIndicator: () => (
                  <div className="mr-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                ),
                ClearIndicator: ClearIndicator,
              }}
              placeholder="Select installment..."
              value={installmentOptions.find(
                (option) => option.value === formData.plan
              )}
              onChange={(selectedOption) => {
                setFormData({
                  ...formData,
                  plan: selectedOption?.value || "",
                });
                if (errors.plan) {
                  setErrors((prev) => ({ ...prev, plan: "" }));
                }
              }}
              onBlur={() => handleBlur("plan")}
              isClearable
              isSearchable
              menuPlacement="bottom"
              className="react-select-container"
              classNamePrefix="react-select"
            />
            {errors.plan && touched.plan && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                 {errors.plan}
              </p>
            )}
          </div>

          {/* Property Size */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Property Size <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              onBlur={() => handleBlur("size")}
              className={`w-full px-3 py-2 border ${
                errors.size && touched.size
                  ? "border-red-500 focus:ring-red-500"
                  : "border-black focus:ring-green-500"
              } rounded-md focus:outline-none focus:ring-2`}
            />
            {errors.size && touched.size && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                {errors.size}
              </p>
            )}
          </div>

          {/* Measuring Unit */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Measuring Unit <span className="text-red-500">*</span>
            </label>
            <select
              name="measuring_unit"
              value={formData.measuring_unit}
              onChange={handleChange}
              onBlur={() => handleBlur("measuring_unit")}
              className={`w-full px-3 py-2 border ${
                errors.measuring_unit && touched.measuring_unit
                  ? "border-red-500 focus:ring-red-500"
                  : "border-black focus:ring-green-500"
              } rounded-md focus:outline-none focus:ring-2`}
            >
              <option value="">Select unit</option>
              <option value="sq. ft.">sq. ft.</option>
              <option value="sq. metre">sq. metre</option>
              <option value="acres">acres</option>
              <option value="hectare">hectare</option>
            </select>
            {errors.measuring_unit && touched.measuring_unit && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                {errors.measuring_unit}
              </p>
            )}
          </div>

          {/* Sign Image Name */}
          <div className="md:col-span-2 space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Sign. Image Name
            </label>
            <input
              type="text"
              name="sign_image_name"
              value={formData.sign_image_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-1/3 p-3 text-white rounded-md transition ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
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
                "Add Project"
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
              <CheckCircle className="text-green-500 h-12 w-12" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
            <p className="text-gray-600 mb-6">
              Project added successfully.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full animate-progress"
                style={{ animationDuration: "2s" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProject;