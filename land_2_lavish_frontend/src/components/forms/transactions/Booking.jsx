import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Booking() {
  const [formData, setFormData] = useState({
    customer_id: '',
    booking_date: '',
    name: '',
    address: '',
    property_id: ''
  });

  const [propertyOptions, setPropertyOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPropertyOptions = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/master/get-property');
        if (response.data && Array.isArray(response.data.data)) {
          setPropertyOptions(response.data.data);
        } else {
          console.error('Invalid data format received:', response.data);
          setError('Invalid data format received from server');
        }
      } catch (error) {
        console.error('Error fetching property options:', error);
        setError('Failed to load property options');
      } finally {
        setLoading(false);
      }
    };
    fetchPropertyOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert property_id to integer, keep customer_id as string
      const submissionData = {
        ...formData,
        property_id: parseInt(formData.property_id),
        booking_date: new Date(formData.booking_date).toISOString()
      };

      const response = await axios.post('http://localhost:5000/api/transactions/booking', submissionData);
      if (response.data.success) {
        alert('Property booked successfully!');
        setFormData({
          customer_id: '',
          booking_date: '',
          name: '',
          address: '',
          property_id: ''
        });
      } else {
        alert(response.data.message || 'Failed to book property.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert(error.response?.data?.message || 'Failed to book property.');
    }
  };

  return (
    <div className="min-h-screen bg-[#272727] flex justify-center items-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-1">PROPERTY BOOKING</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Customer ID</label>
              <input
                type="text"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Booking Date</label>
              <input
                type="date"
                name="booking_date"
                value={formData.booking_date}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block font-medium">Property</label>
              <select
                name="property_id"
                value={formData.property_id}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                disabled={loading}
              >
                <option value="">Select a Property</option>
                {loading ? (
                  <option value="" disabled>Loading properties...</option>
                ) : (
                  propertyOptions.map((property) => (
                    <option key={property.property_id} value={property.property_id}>
                      {property.property_type} - Size: {property.size}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <button 
              type="submit" 
              className="px-6 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Save'}
            </button>
            <button 
              type="reset" 
              className="px-6 py-2 text-black bg-gray-300 rounded-lg hover:bg-gray-400"
              onClick={() => setFormData({
                customer_id: '',
                booking_date: '',
                name: '',
                address: '',
                property_id: ''
              })}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}