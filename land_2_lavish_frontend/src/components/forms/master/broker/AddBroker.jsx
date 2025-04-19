import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddBroker = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjectsLoading(true);
        const response = await axios.get('http://localhost:5000/api/master/get-projects');
        if (response.data.success) {
          setProjects(response.data.data || []);
        } else {
          setErrors({...errors, project: 'Failed to load projects'});
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setErrors({...errors, project: 'Failed to load projects'});
      } finally {
        setProjectsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({...errors, [name]: ''});
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.project_id) {
      newErrors.project_id = 'Project is required';
    }
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.mobile && (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile))) {
      newErrors.mobile = 'Mobile must be exactly 10 digits';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (formData.pan_no && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_no)) {
      newErrors.pan_no = 'Invalid PAN format';
    }
    
    if (formData.net_commission_rate && parseFloat(formData.net_commission_rate) < 0) {
      newErrors.net_commission_rate = 'Commission rate cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Convert numeric fields
      const dataToSubmit = {
        ...formData,
        project_id: parseInt(formData.project_id),
        net_commission_rate: formData.net_commission_rate ? parseFloat(formData.net_commission_rate) : 0
      };

      const response = await axios.post('http://localhost:5000/api/master/add-broker', dataToSubmit);
      
      if (response.data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/masters/broker-list');
        }, 2000);
      } else {
        setErrors({submit: response.data.message || 'Failed to add broker'});
      }
    } catch (err) {
      console.error('Error adding broker:', err);
      setErrors({submit: err.response?.data?.message || 'Failed to add broker'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Add New Broker</h1>
          <button
            onClick={() => navigate("/masters/broker-list")}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back to Brokers
          </button>
        </div>
      
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600">
              Fields marked by <span className="text-red-500 font-medium">*</span>{" "}
              are mandatory
            </p>
          </div>
          
          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errors.submit}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Selection */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project <span className="text-red-500">*</span>
              </label>
              <select
                name="project_id"
                value={formData.project_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.project_id
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-md focus:outline-none focus:ring-2`}
                disabled={loading || projectsLoading}
              >
                <option value="">Select Project</option>
                {projects.map(project => (
                  <option key={project.project_id} value={project.project_id}>
                    {project.project_name}
                  </option>
                ))}
              </select>
              {errors.project_id && (
                <p className="text-red-500 text-xs mt-1">{errors.project_id}</p>
              )}
            </div>
            
            {/* Broker Name */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-md focus:outline-none focus:ring-2`}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
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
                disabled={loading}
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
                className={`w-full px-3 py-2 border ${
                  errors.mobile
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-md focus:outline-none focus:ring-2`}
                disabled={loading}
              />
              {errors.mobile && (
                <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
              )}
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
                className={`w-full px-3 py-2 border ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-md focus:outline-none focus:ring-2`}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                className={`w-full px-3 py-2 border ${
                  errors.pan_no
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-md focus:outline-none focus:ring-2`}
                disabled={loading}
              />
              {errors.pan_no && (
                <p className="text-red-500 text-xs mt-1">{errors.pan_no}</p>
              )}
            </div>
            
            {/* Net Commission Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Net Commission Rate (%)
              </label>
              <input
                type="number"
                name="net_commission_rate"
                value={formData.net_commission_rate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.net_commission_rate
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-md focus:outline-none focus:ring-2`}
                step="0.01"
                disabled={loading}
              />
              {errors.net_commission_rate && (
                <p className="text-red-500 text-xs mt-1">{errors.net_commission_rate}</p>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full p-3 text-white rounded-md transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
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
                    Processing...
                  </span>
                ) : (
                  "Add Broker"
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-md w-full text-center">
              <div className="flex justify-center mb-4">
                <svg 
                  className="h-12 w-12 text-green-500" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
              <p className="text-gray-600 mb-6">
                Broker created successfully.
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full animate-[progress_2s_ease-in-out]" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBroker;
