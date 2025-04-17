import  { useState } from "react";

import FormsNavbar from "../../formsNavbar/FormsNavbar";

const AddNewPLC = () => {
  const [formData, setFormData] = useState({
    plc_name: "",
    percentage: "",
    amount: "",
    remarks: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    // Clear errors for the changed field
    setErrors((prev) => ({
      ...prev,
      [name]: "",
      ...(name === "percentage" || name === "amount"
        ? { percentage: "", amount: "" }
        : {}),
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });

    // Validate individual fields on blur
    if (value) {
      if (name === "percentage") {
        if (parseFloat(value) < 0) {
          setErrors((prev) => ({
            ...prev,
            [name]: "Percentage cannot be negative",
          }));
        } else if (parseFloat(value) > 100) {
          setErrors((prev) => ({
            ...prev,
            [name]: "Percentage cannot exceed 100%",
          }));
        }
      }
      if (name === "amount" && parseFloat(value) < 0) {
        setErrors((prev) => ({ ...prev, [name]: "Amount cannot be negative" }));
      }
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.plc_name) newErrors.plc_name = "PLC Name is required";

    if (formData.percentage) {
      if (parseFloat(formData.percentage) < 0) {
        newErrors.percentage = "Percentage cannot be negative";
      }
      if (parseFloat(formData.percentage) > 100) {
        newErrors.percentage = "Percentage cannot exceed 100%";
      }
    }

    if (formData.amount && parseFloat(formData.amount) < 0) {
      newErrors.amount = "Amount cannot be negative";
    }

    if (!formData.percentage && !formData.amount) {
      newErrors.percentage = "Either percentage or amount is required";
      newErrors.amount = "Either percentage or amount is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const submissionData = {
        plc_name: formData.plc_name,
        value: parseFloat(formData.percentage || formData.amount),
        is_percentage: !!formData.percentage,
        remarks: formData.remarks || null,
      };

      const response = await fetch(
        "http://localhost:5000/api/master/add-new-plc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (
          data.message &&
          data.message.toLowerCase().includes("already exists")
        ) {
          setErrors((prev) => ({ ...prev, plc_name: data.message }));
        } else {
          throw new Error(data.message || "Failed to add PLC");
        }
        return;
      }

      alert("PLC added successfully!");
      window.history.back();
    } catch (error) {
      console.error("Submission error:", error);
      if (!error.message.toLowerCase().includes("already exists")) {
        setErrors({
          submit: error.message || "An error occurred while adding PLC",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      
      <div className="flex justify-center items-center min-h-screen bg-[#272727] p-4">
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-[700px] bg-white p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-bold text-center text-black mb-2">
            Add New PLC
          </h2>

          <p className="text-center text-sm text-red-500 mb-6">
            Fields marked by <span className="text-red-500">*</span> are
            mandatory
          </p>

          <div className="space-y-6">
            {/* PLC Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                PLC Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="plc_name"
                value={formData.plc_name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-2 border rounded-md focus:outline-none ${
                  errors.plc_name || errors.submit
                    ? "border-red-500"
                    : "focus:ring-2 focus:ring-green-500"
                }`}
                placeholder="Enter PLC name"
                disabled={isSubmitting}
              />
              {(errors.plc_name || errors.submit) && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.plc_name || errors.submit}
                </p>
              )}
            </div>

            {/* Percentage and Amount */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 font-medium mb-1">
                  Percentage (%)
                </label>
                <input
                  type="number"
                  name="percentage"
                  value={formData.percentage}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded-md focus:outline-none ${
                    errors.percentage
                      ? "border-red-500"
                      : "focus:ring-2 focus:ring-green-500"
                  } ${
                    formData.amount || isSubmitting
                      ? "bg-gray-200 opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  placeholder="Enter percentage"
                  disabled={!!formData.amount || isSubmitting}
                  step="0.01"
                  min="0"
                  max="100"
                />
                {errors.percentage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.percentage}
                  </p>
                )}
              </div>

              <div className="mt-6 text-gray-500 font-bold">OR</div>

              <div className="flex-1">
                <label className="block text-gray-700 font-medium mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded-md focus:outline-none ${
                    errors.amount
                      ? "border-red-500"
                      : "focus:ring-2 focus:ring-green-500"
                  } ${
                    formData.percentage || isSubmitting
                      ? "bg-gray-200 opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  placeholder="Enter amount"
                  disabled={!!formData.percentage || isSubmitting}
                  step="0.01"
                  min="0"
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Remarks
              </label>
              <input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter remarks (optional)"
                disabled={isSubmitting}
              />
            </div>

            {/* Submit button */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className={`w-1/3 p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddNewPLC;
