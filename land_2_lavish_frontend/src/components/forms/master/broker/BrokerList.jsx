import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, Edit, Trash2, Plus, Search } from "lucide-react";

const BrokerList = () => {
  const [brokers, setBrokers] = useState([]);
  const [filteredBrokers, setFilteredBrokers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (brokers.length > 0) {
      const filtered = brokers.filter(broker => 
        broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (broker.email && broker.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (broker.mobile && broker.mobile.includes(searchTerm)) ||
        (broker.project_name && broker.project_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredBrokers(filtered);
    }
  }, [searchTerm, brokers]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch brokers
      const brokersResponse = await axios.get('http://localhost:5000/api/master/get-brokers');
      if (brokersResponse.data.success) {
        setBrokers(brokersResponse.data.data || []);
        setFilteredBrokers(brokersResponse.data.data || []);
      } else {
        setError(brokersResponse.data.message || 'Failed to fetch brokers');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (broker) => {
    setSelectedBroker(broker);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/master/broker/${selectedBroker.broker_id}`);
      if (response.data.success) {
        setBrokers(brokers.filter(b => b.broker_id !== selectedBroker.broker_id));
        setFilteredBrokers(filteredBrokers.filter(b => b.broker_id !== selectedBroker.broker_id));
        setShowDeleteConfirm(false);
        setSelectedBroker(null);
      } else {
        setError('Failed to delete broker');
      }
    } catch (err) {
      setError('Failed to delete broker. Please try again later.');
      console.error('Error deleting broker:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Broker List</h1>
          <button
            onClick={() => navigate("/masters/add-broker")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            <span>Add New Broker</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search brokers by name, email, mobile, or project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {filteredBrokers.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">
              {searchTerm 
                ? "No brokers match your search criteria." 
                : "No brokers available. Add your first broker!"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBrokers.map((broker) => (
                  <tr key={broker.broker_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{broker.broker_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{broker.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {broker.project_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {broker.mobile || broker.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => navigate(`/masters/view-broker/${broker.broker_id}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => navigate(`/masters/edit-broker/${broker.broker_id}`)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Edit Broker"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(broker)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Broker"
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

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete broker &quot;{selectedBroker.name}&quot;? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrokerList; 