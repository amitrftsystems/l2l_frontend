import React, { useState } from 'react';

const UnitNoAllotment = () => {
  const [formData, setFormData] = useState({
    customerId: '',
    allotmentDate: {
      day: '18',
      month: 'Mar',
      year: '2025'
    },
    name: '',
    address: '',
    size: '',
    propertyId: '',
    size2: '',
    remarks: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      allotmentDate: {
        ...formData.allotmentDate,
        [name]: value
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  const handleClear = () => {
    setFormData({
      customerId: '',
      allotmentDate: {
        day: '18',
        month: 'Mar',
        year: '2025'
      },
      name: '',
      address: '',
      size: '',
      propertyId: '',
      size2: '',
      remarks: ''
    });
  };

  return (
    <div className="min-h-screen bg-[#272727] flex justify-center items-center p-6">
    <div className="max-w-4xl mx-auto p-4 rounded-lg bg-white">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800 tracking-wider text-center flex-grow">ALLOTMENT</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <label className="w-32 text-blue-900 font-bold">Customer ID</label>
            <input
              type="text"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              className="border p-1 rounded flex-grow"
            />
          </div>

          <div className="flex items-center">
            <label className="w-32 text-blue-900 font-bold">Allotment Date</label>
            <div className="flex">
              <select
                name="day"
                value={formData.allotmentDate.day}
                onChange={handleDateChange}
                className="border p-1 rounded mr-1"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <select
                name="month"
                value={formData.allotmentDate.month}
                onChange={handleDateChange}
                className="border p-1 rounded mr-1"
              >
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <select
                name="year"
                value={formData.allotmentDate.year}
                onChange={handleDateChange}
                className="border p-1 rounded"
              >
                {[2023, 2024, 2025, 2026, 2027].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <label className="w-32 text-blue-900 font-bold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border p-1 rounded flex-grow"
            />
          </div>

          <div className="flex items-center">
            <label className="w-32 text-blue-900 font-bold">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="border p-1 rounded flex-grow"
            />
          </div>

          <div className="flex items-center">
            <label className="w-32 text-blue-900 font-bold">Size</label>
            <div className="flex">
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="border p-1 rounded mr-1"
              >
                <option value="">Select</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
              <select
                className="border p-1 rounded"
              >
                <option value="">Select</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <label className="w-32 text-blue-900 font-bold">Property ID</label>
            <input
              type="text"
              name="propertyId"
              value={formData.propertyId}
              onChange={handleChange}
              className="border p-1 rounded flex-grow"
            />
            <span className="ml-2 text-blue-900 font-bold">Size</span>
          </div>

          <div className="flex items-center">
            <label className="w-32 text-blue-900 font-bold">Remarks</label>
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="border p-1 rounded flex-grow"
            />
          </div>
        </div>
      </form>

      <div className="flex justify-center gap-4 mb-4">
        <button
          type="submit"
          className="bg-gray-200 border border-gray-400 px-6 py-1 rounded"
          onClick={handleSubmit}
        >
          Allot
        </button>
        <button
          type="button"
          className="bg-gray-200 border border-gray-400 px-6 py-1 rounded"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>

      <div className="flex justify-center gap-4">
        <button
          type="button"
          className="bg-gray-200 border border-gray-400 px-6 py-1 rounded"
        >
          Add Stock
        </button>
        <button
          type="button"
          className="bg-gray-200 border border-gray-400 px-6 py-1 rounded"
        >
          Update Stock
        </button>
      </div>
    </div>
    </div>
  );
};

export default UnitNoAllotment;