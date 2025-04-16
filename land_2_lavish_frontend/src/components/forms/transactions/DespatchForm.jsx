import React, { useState } from 'react';

const DespatchForm = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    letterType: '',
    otherLetterType: '',
    customerId: '',
    despatchDate: '2025-04-09',
    location: '',
    unitNo: '',
    mode: '',
    consignmentNo: '',
    courierCompany: '',
    remarks: '',
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'radio' ? value : value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.letterType || !formData.customerId || !formData.despatchDate || !formData.unitNo || !formData.mode) {
      alert('Please fill all required fields.');
      return;
    }
    if (formData.mode === 'courier' && (!formData.consignmentNo || !formData.courierCompany)) {
      alert('Please provide a consignment number and courier company for courier mode.');
      return;
    }
    // Log form data or send to an API
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({
      letterType: '',
      otherLetterType: '',
      customerId: '',
      despatchDate: '2025-04-09',
      location: '',
      unitNo: '',
      mode: '',
      consignmentNo: '',
      courierCompany: '',
      remarks: '',
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#272727] p-4">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-4xl bg-white p-6 md:p-10 rounded-2xl shadow-lg flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-center mb-0">DESPATCH DETAILS</h2>

        {/* Letter Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Letter Type *</label>
          <div className="flex space-x-2">
            <select
              name="letterType"
              value={formData.letterType}
              onChange={handleChange}
              className="p-2 border rounded w-1/2"
              required
            >
              <option value="">Select</option>
              <option value="OR">OR</option>
              <option value="Other">Other</option>
            </select>
            {formData.letterType === 'Other' && (
              <input
                type="text"
                name="otherLetterType"
                value={formData.otherLetterType}
                onChange={handleChange}
                placeholder="Other (Specify)"
                className="p-2 border rounded w-1/2"
              />
            )}
          </div>
        </div>

        {/* Customer ID and Despatch Date (Same Row) */}
        <div className="mb-4 flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Customer ID or Unit No. *</label>
            <input
              type="text"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Despatch Date *</label>
            <input
              type="date"
              name="despatchDate"
              value={formData.despatchDate}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              required
            />
          </div>
        </div>

        {/* Location and Unit No. (Same Row) */}
        <div className="mb-4 flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            >
              <option value="">Select</option>
              <option value="Location1">Location 1</option>
              <option value="Location2">Location 2</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Unit No. *</label>
            <input
              type="text"
              name="unitNo"
              value={formData.unitNo}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              required
            />
          </div>
        </div>

        {/* Mode of Letter Sending */}
        <div className="mb-4">
          <label className="block text-xl mb-4 font-medium text-red-700">Mode of letter sending</label>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="mode"
                value="courier"
                id="courier"
                checked={formData.mode === 'courier'}
                onChange={handleChange}
                className="mr-1"
                required
              />
              <label htmlFor="courier">By Courier</label>
            </div>
            {formData.mode === 'courier' && (
              <div className="flex flex-col md:flex-row md:space-x-4 ml-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Consignment No. *</label>
                  <input
                    type="text"
                    name="consignmentNo"
                    value={formData.consignmentNo}
                    onChange={handleChange}
                    placeholder="Consignment No."
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Courier Company *</label>
                  <select
                    name="courierCompany"
                    value={formData.courierCompany}
                    onChange={handleChange}
                    className="p-2 border rounded w-full"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Company1">Company 1</option>
                    <option value="Company2">Company 2</option>
                  </select>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="mode"
                value="hand"
                id="hand"
                checked={formData.mode === 'hand'}
                onChange={handleChange}
                className="mr-1"
              />
              <label htmlFor="hand">By Hand</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="mode"
                value="postal"
                id="postal"
                checked={formData.mode === 'postal'}
                onChange={handleChange}
                className="mr-1"
              />
              <label htmlFor="postal">By Postal</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="mode"
                value="other"
                id="other"
                checked={formData.mode === 'other'}
                onChange={handleChange}
                className="mr-1"
              />
              <label htmlFor="other">Other</label>
            </div>
          </div>
        </div>

        {/* Remarks */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Remarks</label>
          <input
            type="text"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Save
        </button>
      </form>
    </div>
  );
};

export default DespatchForm;