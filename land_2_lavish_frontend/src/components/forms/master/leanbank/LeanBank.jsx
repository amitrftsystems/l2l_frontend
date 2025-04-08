import { useState } from "react";
import { X, CheckCircle } from "lucide-react";

const LeanBank = () => {
  const [formData, setFormData] = useState({
    bankName: "",
    ifscCode: "",
    branch: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const validateIFSC = (code) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(code);

  const handleIFSCChange = async (e) => {
    const code = e.target.value.toUpperCase();
    setFormData(prev => ({ ...prev, ifscCode: code }));
    setErrors(prev => ({ ...prev, ifscCode: "", duplicateIfsc: "" }));
    setApiError("");

    if (code.length === 11) {
      if (!validateIFSC(code)) {
        setErrors(prev => ({ ...prev, ifscCode: "Invalid IFSC format. Must be 11 characters (e.g., SBIN0001234)" }));
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await fetch(`https://ifsc.razorpay.com/${code}`);
        if (!response.ok) throw new Error("Invalid IFSC Code");
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          bankName: data.BANK || "",
          branch: data.BRANCH || ""
        }));
      } catch (error) {
        setErrors(prev => ({ 
          ...prev, 
          ifscCode: "Invalid IFSC or network issue. Please verify manually."
        }));
        setFormData(prev => ({
          ...prev,
          bankName: "",
          branch: ""
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError("");

    // Validate all fields
    const newErrors = {};
    if (!formData.bankName.trim()) newErrors.bankName = "Bank name is required";
    if (!formData.ifscCode.trim()) newErrors.ifscCode = "IFSC code is required";
    else if (!validateIFSC(formData.ifscCode)) newErrors.ifscCode = "Invalid IFSC format";
    if (!formData.branch.trim()) newErrors.branch = "Branch is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/master/add-bank", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bank_name: formData.bankName.trim(),
          ifsc_code: formData.ifscCode.trim(),
          bank_branch: formData.branch.trim()
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(text || "Server returned non-JSON response");
      }

      const data = await response.json();

      if (!response.ok) {
        if (data.message?.includes("already exists")) {
          setErrors(prev => ({ ...prev, duplicateIfsc: "This IFSC code is already registered" }));
          throw new Error("IFSC code already exists");
        }
        throw new Error(data.message || "Failed to add bank");
      }

      // Show success modal
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        window.history.back();
      }, 2000);
    } catch (error) {
      console.error("Detailed API Error:", error);
      if (!error.message.includes("already exists")) {
        setApiError(error.message || "Failed to submit. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#272727] p-40">
      <form onSubmit={handleSubmit} className="relative w-full max-w-[700px] bg-white px-8 py-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-black py-1">Add Bank</h2>
        <p className="text-center text-sm text-gray-600 mb-3">
          Fields marked by <span className="text-red-500">*</span> are mandatory
        </p>

        {/* Bank Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Bank Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.bankName ? "border-red-500 focus:ring-red-500" : "focus:ring-green-500"
            }`}
            placeholder="Type bank name"
            disabled={isLoading}
          />
          {errors.bankName && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
               {errors.bankName}
            </p>
          )}
        </div>

        {/* IFSC Code */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            IFSC Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleIFSCChange}
            maxLength={11}
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.ifscCode || errors.duplicateIfsc ? "border-red-500 focus:ring-red-500" : "focus:ring-green-500"
            }`}
            placeholder="Enter 11-character IFSC (e.g., SBIN0001234)"
            disabled={isLoading}
          />
          {errors.ifscCode && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              {errors.ifscCode}
            </p>
          )}
          {errors.duplicateIfsc && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <X className="h-4 w-4 mr-1" /> {errors.duplicateIfsc}
            </p>
          )}
          {!errors.ifscCode && !errors.duplicateIfsc && formData.ifscCode.length > 0 && formData.ifscCode.length < 11 && (
            <p className="text-gray-500 text-sm mt-1">
              IFSC must be exactly 11 characters
            </p>
          )}
        </div>

        {/* Branch */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            Branch <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.branch ? "border-red-500 focus:ring-red-500" : "focus:ring-green-500"
            }`}
            placeholder="Branch Name"
            disabled={isLoading}
          />
          {errors.branch && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              {errors.branch}
            </p>
          )}
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
            {apiError}
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            className={`w-1/3 p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
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
                Submitting...
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="text-green-500 h-12 w-12" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
            <p className="text-gray-600 mb-6">
              Bank details added successfully.
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

export default LeanBank;