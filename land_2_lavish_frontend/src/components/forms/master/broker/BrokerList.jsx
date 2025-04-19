import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddBroker from './AddBroker';

const BrokerList = () => {
  const [brokers, setBrokers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingBroker, setViewingBroker] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch brokers
      const brokersResponse = await axios.get('http://localhost:5000/api/master/get-brokers');
      if (brokersResponse.data.success) {
        setBrokers(brokersResponse.data.data || []);
      } else {
        setError(brokersResponse.data.message || 'Failed to fetch brokers');
      }

      // Fetch projects
      const projectsResponse = await axios.get('http://localhost:5000/api/master/get-projects');
      if (projectsResponse.data.success) {
        setProjects(projectsResponse.data.data || []);
      } else {
        setError(projectsResponse.data.message || 'Failed to fetch projects');
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

  const handleView = (broker) => {
    setViewingBroker(broker);
    setShowViewModal(true);
  };

  const filteredBrokers = brokers.filter(broker => 
    broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (broker.email && broker.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (broker.mobile && broker.mobile.includes(searchTerm))  ||
    (broker.project_name && broker.project_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Broker List</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add New Broker
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search brokers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
              <tr key={broker.broker_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{broker.broker_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{broker.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {broker.project_name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {broker.mobile || broker.email || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleView(broker)}
                    className="text-blue-600 hover:text-blue-900"
                    title="View Details"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => navigate(`/masters/edit-broker/${broker.broker_id}`)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Edit Broker"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(broker)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete Broker"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Broker Modal */}
      {showAddModal && (
        <AddBroker
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchData}
          projects={projects}
        />
      )}

      {/* View Broker Modal */}
      {showViewModal && viewingBroker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Broker Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700">Name</h4>
                <p className="text-gray-900">{viewingBroker.name}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Project</h4>
                <p className="text-gray-900">{viewingBroker.project_name || '-'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Address</h4>
                <p className="text-gray-900">{viewingBroker.address || '-'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Mobile</h4>
                <p className="text-gray-900">{viewingBroker.mobile || '-'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Email</h4>
                <p className="text-gray-900">{viewingBroker.email || '-'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Phone</h4>
                <p className="text-gray-900">{viewingBroker.phone || '-'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Fax</h4>
                <p className="text-gray-900">{viewingBroker.fax || '-'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Income Tax Ward No</h4>
                <p className="text-gray-900">{viewingBroker.income_tax_ward_no || '-'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">District No</h4>
                <p className="text-gray-900">{viewingBroker.dist_no || '-'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">PAN No</h4>
                <p className="text-gray-900">{viewingBroker.pan_no || '-'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Net Commission Rate</h4>
                <p className="text-gray-900">{viewingBroker.net_commission_rate || '0'}%</p>
              </div>
            </div>
          </div>
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
  );
};

export default BrokerList; 