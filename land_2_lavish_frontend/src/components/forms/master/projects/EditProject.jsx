import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { CheckCircle } from "lucide-react";

const EditProject = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    project_name: "",
    company_name: "",
    address: "",
    landmark: "",
    plan: "",
    sign_image: null,
  });

  const [errors, setErrors] = useState({
    project_name: "",
    company_name: "",
    address: "",
    plan: ""
  });

  const [touched, setTouched] = useState({
    project_name: false,
    company_name: false,
    address: false,
    plan: false
  });

  const [installmentOptions, setInstallmentOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [currentSignImage, setCurrentSignImage] = useState("");

  useEffect(() => {
    const fetchInstallments = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/master/get-installment-plan",
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
            value: installment.plan_name,
            label: `${installment.plan_name} (${installment.no_of_installments} installments)`,
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

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/master/projects/${id}`,
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

        if (data.success) {
          setFormData({
            project_name: data.data.project_name,
            company_name: data.data.company_name,
            address: data.data.address,
            landmark: data.data.landmark || "",
            plan: data.data.plan,
            sign_image: null,
          });
          
          if (data.data.sign_img) {
            setCurrentSignImage(data.data.sign_img);
          }
        } else {
          throw new Error(data.message || "Failed to fetch project");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        setErrors((prev) => ({ ...prev, project_name: error.message }));
      }
    };

    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
      setSelectedFileName(files[0] ? files[0].name : "");
    } else {
      setFormData({ ...formData, [name]: value });
    }

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
      error = "Installment plan name is required";
    } else if (
      (field === "project_name" ||
        field === "company_name" ||
        field === "address") &&
      !value
    ) {
      error = "Please fill out this field";
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
      newErrors.plan = "Installment plan name is required";
      isValid = false;
    }
    setErrors(newErrors);
    setTouched({
      project_name: true,
      company_name: true,
      address: true,
      plan: true,
    });

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    // Create FormData object for file upload
    const formDataToSend = new FormData();
    formDataToSend.append("project_name", formData.project_name);
    formDataToSend.append("company_name", formData.company_name);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("landmark", formData.landmark || "");
    formDataToSend.append("plan", formData.plan);
    
    // Append sign image if it exists
    if (formData.sign_image) {
      formDataToSend.append("sign_image", formData.sign_image);
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/master/project/${id}`,
        {
          method: "PUT",
          body: formDataToSend,
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
        throw new Error(data.message || "Failed to update project");
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 p-30">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl relative border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-black mb-2">
          Edit Project
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
              Installment Plan Name <span className="text-red-500">*</span>
            </label>
            <Select
              options={installmentOptions}
              styles={customStyles}
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

          {/* Sign Image */}
          <div className="md:col-span-2 space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Sign Image
            </label>
            <div className="flex items-center">
              <input
                type="file"
                name="sign_image"
                onChange={handleChange}
                accept="image/*"
                className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {selectedFileName && (
              <p className="text-sm text-gray-600 mt-1">
                Selected file: {selectedFileName}
              </p>
            )}
            {currentSignImage && !selectedFileName && (
              <p className="text-sm text-gray-600 mt-1">
                Current image: {currentSignImage}
              </p>
            )}
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
                "Update Project"
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
              Project updated successfully.
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

export default EditProject; 