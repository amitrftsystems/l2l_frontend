import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";

const EditPlan = () => {
  const { planName } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    no_of_installments: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    fetchPlanDetails();
  }, [planName]);

  const fetchPlanDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/master/get-installment-plan-by-name/${planName}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPlan(data.data);
        setFormData({
          no_of_installments: data.data.no_of_installments.toString(),
        });
      } else {
        throw new Error(data.message || "Failed to fetch plan details");
      }
    } catch (error) {
      console.error("Error fetching plan details:", error);
      setError("Failed to load plan details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleBlur = (field) => {
    setTouched({
      ...touched,
      [field]: true,
    });
    validateField(field, formData[field]);
  };

  const validateField = (field, value) => {
    let error = "";
    if (field === "no_of_installments") {
      if (!value) {
        error = "Number of installments is required";
      } else if (isNaN(Number(value))) {
        error = "Must be a number";
      } else if (Number(value) < 1) {
        error = "Must be at least 1";
      }
    }

    setErrors({
      ...errors,
      [field]: error,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    const newErrors = { ...errors };
    
    if (!formData.no_of_installments) {
      newErrors.no_of_installments = "Number of installments is required";
      isValid = false;
    } else if (isNaN(Number(formData.no_of_installments)) || Number(formData.no_of_installments) < 1) {
      newErrors.no_of_installments = "Must be a number greater than 0";
      isValid = false;
    }
    
    setErrors(newErrors);
    setTouched({
      no_of_installments: true,
    });
    
    if (!isValid) {
      return;
    }
    
    try {
      const response = await fetch(
        `http://localhost:5000/api/master/update-installment-plan/${planName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            no_of_installments: formData.no_of_installments,
          }),
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/master/plans");
        }, 2000);
      } else {
        throw new Error(data.message || "Failed to update plan");
      }
    } catch (error) {
      console.error("Error updating plan:", error);
      setError("Failed to update plan. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/master/plans")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={18} className="mr-1" />
            <span>Back to Plans</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
            <CheckCircle className="mr-2" size={18} />
            <span>Plan updated successfully!</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : !plan ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">Plan not found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-800">Edit Plan: {plan.plan_name}</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label htmlFor="no_of_installments" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Installments <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="no_of_installments"
                  name="no_of_installments"
                  value={formData.no_of_installments}
                  onChange={handleChange}
                  onBlur={() => handleBlur("no_of_installments")}
                  className={`w-full px-3 py-2 border ${
                    errors.no_of_installments && touched.no_of_installments
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  min="1"
                />
                {errors.no_of_installments && touched.no_of_installments && (
                  <p className="mt-1 text-sm text-red-600">{errors.no_of_installments}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Update Plan
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPlan; 