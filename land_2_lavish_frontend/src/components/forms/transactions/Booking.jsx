import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Booking() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerId: '',
    date: '',
    name: '',
    address: '',
    propertyDescription: ''
  });

  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const propertyOptions = ['Property 1', 'Property 2', 'Property 3', 'Property 4', 'Property 5'];

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const custResponse = await fetch(
          'https://land-2-lavish-sales-backend.vercel.app/api/master/get-customer-with-details'
        );
        const custData = await custResponse.json();
        if (custData.success) {
          setCustomers(custData.data);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    customer =>
      customer.customer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomerSelect = (customer) => {
    setFormData({
      ...formData,
      customerId: customer.customer_id,
      name: customer.name,
      address: customer.permanent_address
    });
    setSearchTerm(customer.customer_id);
    setIsDropdownOpen(false);
    setFormErrors((prev) => ({ ...prev, customerId: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const checkBookingExists = async (customerId) => {
    try {
      const response = await fetch(
        `https://land-2-lavish-sales-backend.vercel.app/api/transaction/booking/check-customer-bookings/${formData.customerId}`
      );
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(text || 'Invalid response from server');
      }

      const data = await response.json();
      
      // Handle both possible response formats
      if (typeof data.hasBookings !== 'undefined') {
        return data.hasBookings;
      }
      if (typeof data.exists !== 'undefined') {
        return data.exists;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking booking:', error);
      return false;
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.customerId) errors.customerId = 'Customer ID is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.propertyDescription) errors.propertyDescription = 'Property selection is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const bookingExists = await checkBookingExists(formData.customerId);
      if (bookingExists) {
        setError('This customer already has a booking');
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        'https://land-2-lavish-sales-backend.vercel.app/api/transaction/booking',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_id: formData.customerId,
            booking_date: formData.date,
            property_desc: formData.propertyDescription
          }),
        }
      );

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(text || 'Invalid response from server');
      }

      const data = await response.json();

      if (response.ok) {
        setSuccess('Booking created successfully!');
        setFormData({
          customerId: '',
          date: '',
          name: '',
          address: '',
          propertyDescription: ''
        });
        setSearchTerm('');
        setTimeout(() => navigate(-1), 1000);
      } else {
        setError(data.message || 'Failed to create booking');
      }
    } catch (error) {
      setError(error.message || 'Failed to connect to server');
      console.error('Booking error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!formData.customerId) {
      setFormErrors((prev) => ({ ...prev, customerId: 'Customer ID is required' }));
      setIsLoading(false);
      return;
    }

    try {
      // First check if customer has bookings
      const checkResponse = await fetch(
        `https://land-2-lavish-sales-backend.vercel.app/api/transaction/booking/check-customer-bookings/${formData.customerId}`
      );
      
      // Check if response is JSON
      const checkContentType = checkResponse.headers.get('content-type');
      if (!checkContentType || !checkContentType.includes('application/json')) {
        const text = await checkResponse.text();
        throw new Error(text || 'Invalid response from server');
      }

      const checkData = await checkResponse.json();
      
      if (!checkData.hasBookings && !checkData.exists) {
        setError('No booking exists for this customer');
        setIsLoading(false);
        return;
      }

      // Get the booking ID to delete
      const bookingResponse = await fetch(
        `https://land-2-lavish-sales-backend.vercel.app/api/transaction/booking?customer_id=${formData.customerId}`
      );
      
      // Check if response is JSON
      const bookingContentType = bookingResponse.headers.get('content-type');
      if (!bookingContentType || !bookingContentType.includes('application/json')) {
        const text = await bookingResponse.text();
        throw new Error(text || 'Invalid response from server');
      }

      const bookingData = await bookingResponse.json();
      
      if (!bookingData.data || bookingData.data.length === 0) {
        setError('No booking found for this customer');
        setIsLoading(false);
        return;
      }

      const bookingId = bookingData.data[0].booking_id;

      // Now delete the booking
      const deleteResponse = await fetch(
        `https://land-2-lavish-sales-backend.vercel.app/api/transaction/booking/${bookingId}`,
        {
          method: 'DELETE',
        }
      );

      // Check if response is JSON
      const deleteContentType = deleteResponse.headers.get('content-type');
      if (!deleteContentType || !deleteContentType.includes('application/json')) {
        const text = await deleteResponse.text();
        throw new Error(text || 'Invalid response from server');
      }

      const deleteData = await deleteResponse.json();

      if (deleteResponse.ok) {
        setSuccess('Booking cleared successfully!');
        setFormData({
          customerId: '',
          date: '',
          name: '',
          address: '',
          propertyDescription: ''
        });
        setSearchTerm('');
      } else {
        setError(deleteData.message || 'Failed to clear booking');
      }
    } catch (error) {
      setError(error.message || 'Failed to connect to server');
      console.error('Clear booking error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#272727] flex justify-center items-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-1">PROPERTY BOOKING</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {success}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {/* Customer ID Search */}
            <div className="relative col-span-2">
              <label className="block font-medium">Customer ID</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                  setFormErrors((prev) => ({ ...prev, customerId: '' }));
                }}
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${formErrors.customerId ? 'border-red-500' : 'focus:ring-green-500'}`}
                placeholder="Search customer ID..."
              />
              {formErrors.customerId && (
                <p className="text-red-500 text-sm mt-1">{formErrors.customerId}</p>
              )}
              {isDropdownOpen && filteredCustomers.length > 0 && (
                <ul className="absolute z-10 bg-white border rounded-md mt-1 w-full max-h-60 overflow-auto shadow-lg">
                  {filteredCustomers.map((customer) => (
                    <li
                      key={customer.customer_id}
                      onMouseDown={() => handleCustomerSelect(customer)}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {customer.customer_id} - {customer.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Date Picker */}
            <div className="col-span-2">
              <label className="block font-medium">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${formErrors.date ? 'border-red-500' : 'focus:ring-green-500'}`}
              />
              {formErrors.date && (
                <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>
              )}
            </div>

            {/* Name */}
            <div className="col-span-2">
              <label className="block font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                readOnly
              />
            </div>

            {/* Address */}
            <div className="col-span-2">
              <label className="block font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                readOnly
              />
            </div>

            {/* Property Description */}
            <div className="col-span-2">
              <label className="block font-medium">Property Description</label>
              <select
                name="propertyDescription"
                value={formData.propertyDescription}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${formErrors.propertyDescription ? 'border-red-500' : 'focus:ring-green-500'}`}
              >
                <option value="">Select a Property</option>
                {propertyOptions.map((property, index) => (
                  <option key={index} value={property}>
                    {property}
                  </option>
                ))}
              </select>
              {formErrors.propertyDescription && (
                <p className="text-red-500 text-sm mt-1">{formErrors.propertyDescription}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Save'}
            </button>
            <button
              type="button"
              className="px-6 py-2 text-black bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              onClick={handleClear}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Clear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}