import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UnitNoAllotment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerId: '',
    allotmentDate: '',
    name: '',
    address: '',
    propertyId: '',
    type: '',
    description: '',
    size: '',
    remarks: ''
  });

  const [customers, setCustomers] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [propertySearchTerm, setPropertySearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // Changed to boolean for popup control
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    customerId: false,
    allotmentDate: false,
    propertyId: false
  });
  const [propertyStatusError, setPropertyStatusError] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('https://land-2-lavish-sales-backend.vercel.app/api/master/get-customer-with-details');
        const data = await response.json();
        if (data.success) {
          setCustomers(data.data);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Failed to load customers');
      }
    };
    
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.customer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomerSelect = async (customer) => {
    setIsLoading(true);
    setError('');
    setFieldErrors(prev => ({...prev, customerId: false}));
    setPropertyStatusError('');
    
    try {
      setFormData({
        ...formData,
        customerId: customer.customer_id,
        name: customer.name,
        address: customer.address || customer.permanent_address || '',
        propertyId: '',
        type: '',
        description: '',
        size: ''
      });
      
      setSearchTerm(customer.customer_id);
      setIsDropdownOpen(false);
      setPropertySearchTerm('');
      
      const response = await fetch(`https://land-2-lavish-sales-backend.vercel.app/api/master/by-customer/${customer.customer_id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch properties');
      }

      if (data.success) {
        setFilteredProperties(data.data || []);
      } else {
        setFilteredProperties([]);
        setError(data.message || 'No properties found for this customer');
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.message || 'Failed to load properties');
      setFilteredProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePropertySelect = (property) => {
    if (property.status && property.status.toLowerCase() === 'alloted') {
      setPropertyStatusError('This property is already allotted');
    } else {
      setPropertyStatusError('');
      setFormData({
        ...formData,
        propertyId: property.property_id,
        type: property.p_type || 'Not specified',
        description: property.p_desc || 'No description',
        size: property.p_size || 'Not specified'
      });
      setPropertySearchTerm(property.property_id);
      setFieldErrors(prev => ({...prev, propertyId: false}));
    }
    setIsPropertyDropdownOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (name in fieldErrors) {
      setFieldErrors(prev => ({...prev, [name]: false}));
    }
    if (name === 'propertyId') {
      setPropertyStatusError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);
    
    const newFieldErrors = {
      customerId: !formData.customerId,
      allotmentDate: !formData.allotmentDate,
      propertyId: !formData.propertyId
    };
    
    setFieldErrors(newFieldErrors);
    
    if (Object.values(newFieldErrors).some(error => error)) {
      setIsLoading(false);
      setError('Please fill in all required fields');
      return;
    }
    
    const selectedProperty = filteredProperties.find(
      prop => prop.property_id === formData.propertyId
    );
    
    if (selectedProperty && selectedProperty.status && selectedProperty.status.toLowerCase() === 'alloted') {
      setPropertyStatusError('This property is already allotted');
      setIsLoading(false);
      setError('Cannot allot an already allotted property');
      return;
    }
  
    try {
      const payload = {
        customer_id: formData.customerId,
        allot_date: formData.allotmentDate,
        property_id: formData.propertyId,
        remark: formData.remarks || null
      };
  
      const response = await fetch('https://land-2-lavish-sales-backend.vercel.app/api/transaction/allotment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || `Failed to create allotment (Status: ${response.status})`);
      }
  
      setSuccess(true); // Set success to true to show popup
    } catch (err) {
      console.error('Error submitting allotment:', err);
      setError(err.message || 'Failed to create allotment. Please check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      customerId: '',
      allotmentDate: '',
      name: '',
      address: '',
      propertyId: '',
      type: '',
      description: '',
      size: '',
      remarks: ''
    });
    setSearchTerm('');
    setPropertySearchTerm('');
    setFilteredProperties([]);
    setError('');
    setSuccess(false);
    setFieldErrors({
      customerId: false,
      allotmentDate: false,
      propertyId: false
    });
    setPropertyStatusError('');
  };

  const handlePopupClose = () => {
    setSuccess(false);
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-[#272727] flex justify-center items-center p-6">
      {/* Success Popup Modal */}
      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mt-3 text-lg leading-6 font-medium text-gray-900">
                Allotment Created Successfully!
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  The property has been successfully allotted to the customer.
                </p>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={handlePopupClose}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl relative">
        <h1 className="text-2xl font-bold text-center mb-1">ALLOTMENT</h1>
        
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Customer ID and Allotment Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block font-medium">Customer ID</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  fieldErrors.customerId ? 'border-red-500' : ''
                }`}
                placeholder="Search customer ID or name..."
                disabled={isLoading}
              />
              {fieldErrors.customerId && (
                <p className="text-red-500 text-sm mt-1">Customer ID is required</p>
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

            <div>
              <label className="block font-medium">Allotment Date</label>
              <input
                type="date"
                name="allotmentDate"
                value={formData.allotmentDate}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  fieldErrors.allotmentDate ? 'border-red-500' : ''
                }`}
                disabled={isLoading}
              />
              {fieldErrors.allotmentDate && (
                <p className="text-red-500 text-sm mt-1">Allotment Date is required</p>
              )}
            </div>
          </div>

          {/* Name and Address */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100"
                readOnly
              />
            </div>

            <div>
              <label className="block font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100"
                readOnly
              />
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-4 gap-4">
            <div className="relative">
              <label className="block font-medium">Property ID</label>
              <input
                type="text"
                name="propertyId"
                value={propertySearchTerm}
                onChange={(e) => {
                  setPropertySearchTerm(e.target.value);
                  setIsPropertyDropdownOpen(true);
                }}
                onFocus={() => setIsPropertyDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsPropertyDropdownOpen(false), 200)}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  fieldErrors.propertyId || propertyStatusError ? 'border-red-500' : ''
                }`}
                placeholder="Search property ID..."
                disabled={!formData.customerId || isLoading}
              />
              {fieldErrors.propertyId && (
                <p className="text-red-500 text-sm mt-1">Property ID is required</p>
              )}
              {propertyStatusError && (
                <p className="text-red-500 text-sm mt-1">{propertyStatusError}</p>
              )}
              {isPropertyDropdownOpen && filteredProperties.length > 0 && (
                <ul className="absolute z-10 bg-white border rounded-md mt-1 w-full max-h-60 overflow-auto shadow-lg">
                  {filteredProperties.map((property) => (
                    <li
                      key={property.property_id}
                      onMouseDown={() => handlePropertySelect(property)}
                      className={`p-2 hover:bg-gray-100 cursor-pointer text-sm ${
                        property.status && property.status.toLowerCase() === 'alloted' ? 'text-red-500' : ''
                      }`}
                    >
                      {property.property_id} - {property.status} - {property.p_type}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label className="block font-medium">Type</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100"
                readOnly
              />
            </div>

            <div>
              <label className="block font-medium">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100"
                readOnly
              />
            </div>

            <div>
              <label className="block font-medium">Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100"
                readOnly
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block font-medium">Remarks</label>
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-4">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Allot'}
            </button>
            <button
              type="button"
              className="px-6 py-2 text-black bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              onClick={handleClear}
              disabled={isLoading}
            >
              Clear
            </button>
          </div>

          {/* Additional Buttons */}
          <div className="flex justify-center space-x-4 pt-2">
            <button
              type="button"
              className="px-6 py-2 text-black bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              disabled={isLoading}
            >
              Add Stock
            </button>
            <button
              type="button"
              className="px-6 py-2 text-black bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              disabled={isLoading}
            >
              Update Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnitNoAllotment;