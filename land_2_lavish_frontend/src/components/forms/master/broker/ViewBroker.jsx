import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewBroker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [broker, setBroker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBroker = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/master/get-broker/${id}`);

        if (response.data.success) {
          setBroker(response.data.data);
        } else {
          throw new Error(response.data.message || "Failed to fetch broker");
        }
      } catch (error) {
        console.error("Error fetching broker:", error);
        setError("Failed to load broker. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBroker();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Broker Details</h1>
          <button
            onClick={() => navigate("/masters/broker-list")}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back to Brokers
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          broker && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
                      Broker Information
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Broker ID</p>
                        <p className="text-base font-medium text-gray-900">{broker.broker_id}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="text-base font-medium text-gray-900">{broker.name}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Project</p>
                        <p className="text-base font-medium text-gray-900">{broker.project_name || 'N/A'}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500">Address</p>
                        <p className="text-base font-medium text-gray-900">{broker.address || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
                      Contact Details
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Mobile</p>
                        <p className="text-base font-medium text-gray-900">{broker.mobile || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-base font-medium text-gray-900">{broker.email || 'N/A'}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-base font-medium text-gray-900">{broker.phone || 'N/A'}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500">Fax</p>
                        <p className="text-base font-medium text-gray-900">{broker.fax || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
                    Additional Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Income Tax Ward No</p>
                      <p className="text-base font-medium text-gray-900">{broker.income_tax_ward_no || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">District No</p>
                      <p className="text-base font-medium text-gray-900">{broker.dist_no || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">PAN No</p>
                      <p className="text-base font-medium text-gray-900">{broker.pan_no || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Net Commission Rate</p>
                      <p className="text-base font-medium text-gray-900">{broker.net_commission_rate || '0'}%</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-center space-x-4">
                  <button
                    onClick={() => navigate(`/masters/edit-broker/${broker.broker_id}`)}
                    className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    Edit Broker
                  </button>
                  
                  <button
                    onClick={() => navigate("/masters/broker-list")}
                    className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Back to List
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ViewBroker; 