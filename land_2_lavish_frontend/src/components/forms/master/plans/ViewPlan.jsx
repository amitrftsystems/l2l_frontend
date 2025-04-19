import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";

const ViewPlan = () => {
  const { planName } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            to="/master/plans" 
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={18} className="mr-1" />
            <span>Back to Plans</span>
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
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
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">{plan.plan_name}</h1>
                <Link 
                  to={`/master/plans/edit/${plan.plan_name}`}
                  className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
                >
                  <Pencil size={18} />
                  <span>Edit Plan</span>
                </Link>
              </div>
              <p className="text-gray-500 mt-2">
                {plan.no_of_installments} installments
              </p>
            </div>

            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Installment Details</h2>
              
              {plan.installment_details && plan.installment_details.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Installment #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Percentage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due After Days
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {plan.installment_details.map((detail) => (
                        <tr key={detail.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {detail.installment_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {detail.amount ? `₹${detail.amount.toLocaleString()}` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {detail.percentage ? `${detail.percentage}%` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {detail.due_after_days ? `${detail.due_after_days} days` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {detail.due_date ? new Date(detail.due_date).toLocaleDateString() : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No installment details found for this plan.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPlan; 