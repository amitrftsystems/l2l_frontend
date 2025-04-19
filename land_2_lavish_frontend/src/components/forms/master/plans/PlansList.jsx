import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, Plus, Search } from "lucide-react";

const PlansList = () => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (plans.length > 0) {
      const filtered = plans.filter(
        (plan) =>
          plan.plan_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          plan.no_of_installments.toString().includes(searchQuery)
      );
      setFilteredPlans(filtered);
    }
  }, [searchQuery, plans]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/master/get-installment-plan");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPlans(data.data);
        setFilteredPlans(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch plans");
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setError("Failed to load plans. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (plan) => {
    setPlanToDelete(plan);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;
    
    try {
      const response = await fetch(
        `http://localhost:5000/api/master/delete-installment-plan/${planToDelete.plan_name}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        // Remove the deleted plan from the state
        const updatedPlans = plans.filter(plan => plan.plan_name !== planToDelete.plan_name);
        setPlans(updatedPlans);
        setFilteredPlans(updatedPlans);
        setDeleteModalOpen(false);
        setPlanToDelete(null);
      } else {
        throw new Error(data.message || "Failed to delete plan");
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
      setError("Failed to delete plan. Please try again later.");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setPlanToDelete(null);
  };

  const handleViewPlan = (planName) => {
    navigate(`/masters/plans/view/${planName}`);
  };

  const handleEditPlan = (planName) => {
    navigate(`/masters/plans/edit/${planName}`);
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Installment Plans</h1>
          <Link 
            to="/masters/add-new-plan" 
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus size={18} />
            <span>Add New Plan</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by plan name or number of installments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>
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
        ) : filteredPlans.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">
              {searchQuery 
                ? "No plans match your search criteria." 
                : "No installment plans found."}
            </p>
            <Link 
              to="/masters/add-new-plan" 
              className="inline-block mt-4 text-green-600 hover:text-green-800"
            >
              Create your first plan
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Number of Installments
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlans.map((plan) => (
                  <tr key={plan.plan_name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {plan.plan_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {plan.no_of_installments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button 
                          onClick={() => handleViewPlan(plan.plan_name)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleEditPlan(plan.plan_name)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Edit Plan"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(plan)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Plan"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete the plan &quot;{planToDelete?.plan_name}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansList; 