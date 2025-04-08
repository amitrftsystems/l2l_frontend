import  { useState } from "react";
// import { useNavigate } from "react-router-dom";

const AddNewPlan = () => {
  const [formData, setFormData] = useState({
    installment_no: "",
    days: "",
    date: "",
    percentage: "",
    amount: "",
    remarks: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  // const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user types
    setErrors((prev) => ({ ...prev, [name]: "" }));

    // Clear both days/date errors when either is changed
    if (name === "days" || name === "date") {
      setErrors((prev) => ({ ...prev, days: "", date: "" }));
    }

    // Clear both percentage/amount errors when either is changed
    if (name === "percentage" || name === "amount") {
      setErrors((prev) => ({ ...prev, percentage: "", amount: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Validate percentage range
    if (name === "percentage" && value) {
      const percentageValue = parseFloat(value);
      if (percentageValue < 0 || percentageValue > 100) {
        setErrors((prev) => ({
          ...prev,
          percentage: "Percentage must be between 0 and 100",
        }));
      }
    }

    // Validate amount non-negative
    if (name === "amount" && value) {
      const amountValue = parseFloat(value);
      if (amountValue < 0) {
        setErrors((prev) => ({
          ...prev,
          amount: "Amount cannot be negative",
        }));
      }
    }

    // Validate days positive
    if (name === "days" && value) {
      const daysValue = parseInt(value);
      if (daysValue <= 0) {
        setErrors((prev) => ({
          ...prev,
          days: "Days must be greater than 0",
        }));
      }
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.installment_no)
      newErrors.installment_no = "Installment No is required";

    // Days/date validation
    if (!formData.days && !formData.date) {
      newErrors.days = "Either days or date is required";
      newErrors.date = "Either days or date is required";
    }

    // Percentage/amount validation
    if (!formData.percentage && !formData.amount) {
      newErrors.percentage = "Either percentage or amount is required";
      newErrors.amount = "Either percentage or amount is required";
    }

    // Individual field validations
    if (formData.percentage) {
      const percentageValue = parseFloat(formData.percentage);
      if (percentageValue < 0 || percentageValue > 100) {
        newErrors.percentage = "Percentage must be between 0 and 100";
      }
    }
    if (formData.amount) {
      const amountValue = parseFloat(formData.amount);
      if (amountValue < 0) {
        newErrors.amount = "Amount cannot be negative";
      }
    }
    if (formData.days) {
      const daysValue = parseInt(formData.days);
      if (daysValue <= 0) {
        newErrors.days = "Days must be greater than 0";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/master/add-new-installment-plan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            installment_no: formData.installment_no,
            due_days: formData.days || null,
            due_date: formData.date || null,
            percentage: formData.percentage || null,
            lumpsum_amount: formData.amount || null,
            remarks: formData.remarks || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.message) {
          setErrors((prev) => ({ ...prev, installment_no: data.message }));
        } else {
          throw new Error("Something went wrong");
        }
        return;
      }

      setShowSuccessPopup(true);

      // Reset form
      setFormData({
        installment_no: "",
        days: "",
        date: "",
        percentage: "",
        amount: "",
        remarks: "",
      });
    } catch (error) {
      console.error("Error:", error);
      setErrors((prev) => ({ ...prev, form: error.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    // navigate("/");
  };


  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#272727] p-30">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-[700px] bg-white p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center text-black mb-2">
          Add New Plan
        </h2>

        <p className="text-center text-sm text-red-500 mb-6">
          Fields marked by <span className="text-red-500">*</span> are mandatory
        </p>

        {errors.form && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
            {errors.form}
          </div>
        )}

        <div className="space-y-6">
          {/* Installment No */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Installment No <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="installment_no"
              value={formData.installment_no}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:outline-none ${
                errors.installment_no
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-green-500"
              }`}
              placeholder="Enter installment number"
              min="1"
            />
            {errors.installment_no && (
              <p className="text-red-500 text-sm mt-1">
                {errors.installment_no}
              </p>
            )}
          </div>

          {/* Days or Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Due after (Days OR Date) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex items-center w-full">
                    <input
                      type="number"
                      name="days"
                      value={formData.days}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full p-2 border rounded-md focus:outline-none ${
                        errors.days
                          ? "border-red-500"
                          : "focus:ring-2 focus:ring-green-500"
                      } ${
                        formData.date
                          ? "bg-gray-200 opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      placeholder="Enter days"
                      min="1"
                      disabled={!!formData.date}
                    />
                    <span className="ml-2">days</span>
                  </div>
                </div>
                {errors.days && (
                  <p className="text-red-500 text-sm mt-1">{errors.days}</p>
                )}
              </div>

              <div className="text-gray-500 font-bold">OR</div>

              <div className="flex-1">
                <div className="flex items-center">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={today}
                    className={`w-full p-2 border rounded-md focus:outline-none ${
                      errors.date
                        ? "border-red-500"
                        : "focus:ring-2 focus:ring-green-500"
                    } ${
                      formData.days
                        ? "bg-gray-200 opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={!!formData.days}
                  />
                </div>
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                )}
              </div>
            </div>
          </div>

          {/* Percentage or Amount */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Percentage OR Lump-sum Amount{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex items-center w-full">
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
                        formData.amount
                          ? "bg-gray-200 opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      placeholder="Enter percentage"
                      min="0"
                      max="100"
                      step="0.01"
                      disabled={!!formData.amount}
                    />
                    <span className="ml-2">%</span>
                  </div>
                </div>
                {errors.percentage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.percentage}
                  </p>
                )}
              </div>

              <div className="text-gray-500 font-bold">OR</div>

              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex items-center w-full">
                    <span className="mr-2">₹</span>
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
                        formData.percentage
                          ? "bg-gray-200 opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                      disabled={!!formData.percentage}
                    />
                  </div>
                </div>
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>
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

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Plan Added Successfully!
              </h3>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={closeSuccessPopup}
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

export default AddNewPlan;
