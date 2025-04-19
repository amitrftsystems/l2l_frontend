import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const AddBroker = ({ onClose, onSuccess, projects }) => {
  const [formData, setFormData] = useState({
    project_id: '',
    name: '',
    address: '',
    mobile: '',
    email: '',
    phone: '',
    fax: '',
    income_tax_ward_no: '',
    dist_no: '',
    pan_no: '',
    net_commission_rate: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.project_id || !formData.name) {
        setError('Project and Name are required');
        return;
      }

      // Convert numeric fields
      const dataToSubmit = {
        ...formData,
        project_id: parseInt(formData.project_id),
        net_commission_rate: formData.net_commission_rate ? parseFloat(formData.net_commission_rate) : 0
      };

      const response = await axios.post('http://localhost:5000/api/master/add-broker', dataToSubmit);
      
      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || 'Failed to add broker');
      }
    } catch (err) {
      console.error('Error adding broker:', err);
      setError(err.response?.data?.message || 'Failed to add broker');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Add New Broker</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
            
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Selection */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project *
              </label>
              <select
                name="project_id"
                value={formData.project_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Project</option>
                {projects.map(project => (
                  <option key={project.project_id} value={project.project_id}>
                    {project.project_name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Broker Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {/* Address */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            
            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile
              </label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Fax */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fax
              </label>
              <input
                type="text"
                name="fax"
                value={formData.fax}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Income Tax Ward No */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Income Tax Ward No
              </label>
              <input
                type="text"
                name="income_tax_ward_no"
                value={formData.income_tax_ward_no}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* District No */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dist No
              </label>
              <input
                type="text"
                name="dist_no"
                value={formData.dist_no}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* PAN No */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PAN No
              </label>
              <input
                type="text"
                name="pan_no"
                value={formData.pan_no}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Net Commission Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Net Commission Rate
              </label>
              <input
                type="number"
                name="net_commission_rate"
                value={formData.net_commission_rate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Broker'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddBroker.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  projects: PropTypes.arrayOf(PropTypes.shape({
    project_id: PropTypes.number.isRequired,
    project_name: PropTypes.string.isRequired
  })).isRequired
};

export default AddBroker;
