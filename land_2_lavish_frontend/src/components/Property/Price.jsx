// src/components/AddPricingDetails.jsx
import React from "react";

const AddPricingDetails = ({ formData, updateFormData }) => {
  // Single-select for Ownership, Pre-Leased, etc.
  const handleSingleSelect = (field, value) => {
    const currentValue = formData[field];
    if (currentValue === value) {
      // Unselect if already selected
      updateFormData(field, "");
    } else {
      // Select new value
      updateFormData(field, value);
    }
  };

  // Toggle for checkboxes (Tax Excluded, Price Negotiable)
  const handleCheckbox = (field) => {
    updateFormData(field, !formData[field]);
  };

  // Track length of "What makes your property unique" field
  const uniqueDescription = formData.propertyUnique || "";
  const maxChars = 5000;

  return (
    <form className="w-4/5 mx-auto" onSubmit={(e) => e.preventDefault()}>
      {/* Heading */}
      <h2 className="text-3xl font-bold mb-2">Add pricing and details...</h2>
      {/* <hr className="mb-6" /> */}
      <div className="mb-6"></div>

      {/* Ownership (Freehold, Leasehold, Power of Attorney) */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Ownership</label>
        <div className="flex gap-2 flex-wrap">
          {["Freehold", "Leasehold", "Power of Attorney"].map((val) => {
            const isSelected = formData.ownership === val;
            return (
              <button
                key={val}
                type="button"
                onClick={() => handleSingleSelect("ownership", val)}
                className={`px-4 py-2 rounded-full border transition ${
                  isSelected
                    ? "bg-black text-white border-black"
                    : "bg-white border-gray-300 text-gray-700"
                } hover:bg-black hover:text-white focus:outline-none`}
              >
                {val}
              </button>
            );
          })}
        </div>
      </div>

      {/* Which authority the property is approved by? (Optional) */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Which authority the property is approved by?
          <span className="text-gray-400 text-sm ml-1">(Optional)</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Local Authority"
          value={formData.propertyAuthority || ""}
          onChange={(e) => updateFormData("propertyAuthority", e.target.value)}
          className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Approved for Industry Type (Optional) */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Approved for Industry Type
          <span className="text-gray-400 text-sm ml-1">(Optional)</span>
        </label>
        <select
          value={formData.industryType || ""}
          onChange={(e) => updateFormData("industryType", e.target.value)}
          className="w-full p-2 border-b border-gray-300 rounded focus:outline-none focus:border-blue-500"
        >
          <option value="">Select Industry Type</option>
          <option value="">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Industrial">Industrial</option>
          <option value="IT Park">IT Park</option>
          <option value="Hospitality">Hospitality</option>
        </select>
      </div>

      {/* Price Details */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Price Details</label>
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <span className="block mb-1">₹ Expected Price</span>
            <input
              type="number"
              placeholder="Enter total price"
              value={formData.expectedPrice || ""}
              onChange={(e) => updateFormData("expectedPrice", e.target.value)}
              className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="w-1/2">
            <span className="block mb-1">₹ Price per sq.ft.</span>
            <input
              type="number"
              placeholder="Enter price per sq.ft."
              value={formData.pricePerSqFt || ""}
              onChange={(e) => updateFormData("pricePerSqFt", e.target.value)}
              className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* NEW: Expected Deposit */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">
            Expected Deposit <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="₹ Enter Amount"
            value={formData.expectedDeposit || ""}
            onChange={(e) => updateFormData("expectedDeposit", e.target.value)}
            className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* NEW: Monthly Maintenance */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">
            Monthly Maintenance
          </label>
          <select
            value={formData.monthlyMaintenance || ""}
            onChange={(e) =>
              updateFormData("monthlyMaintenance", e.target.value)
            }
            className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">Select</option>
            <option value="Maintenance Included">Maintenance Included</option>
            <option value="Maintenance Extra">Maintenance Extra</option>
          </select>
        </div>

        {/* Checkboxes for Tax Excluded & Price Negotiable */}
        <div className="flex items-center gap-4 mb-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={formData.taxExcluded || false}
              onChange={() => handleCheckbox("taxExcluded")}
            />
            <span className="ml-2 text-gray-700">
              Tax and Govt. charges excluded
            </span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={formData.priceNegotiable || false}
              onChange={() => handleCheckbox("priceNegotiable")}
            />
            <span className="ml-2 text-gray-700">Price Negotiable</span>
          </label>
        </div>
      </div>

      {/* Is it Pre-leased / Pre-Rented? */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Is it Pre-leased / Pre-Rented?
          <span className="text-gray-400 text-sm ml-1">?</span>
        </label>
        <div className="flex gap-2 flex-wrap">
          {["Yes", "No"].map((val) => {
            const isSelected = formData.preLeased === val;
            return (
              <button
                key={val}
                type="button"
                onClick={() => handleSingleSelect("preLeased", val)}
                className={`px-4 py-2 rounded-full border transition ${
                  isSelected
                    ? "bg-black text-white border-black"
                    : "bg-white border-gray-300 text-gray-700"
                } hover:bg-black hover:text-white focus:outline-none`}
              >
                {val}
              </button>
            );
          })}
        </div>
      </div>

      {/* What makes your property unique */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          What makes your property unique
        </label>
        <p className="text-gray-500 mb-1 text-sm">
          Adding description will increase your listing visibility
        </p>
        <textarea
          rows="4"
          maxLength={maxChars}
          placeholder="Share some details about your property like spacious rooms, well maintained facilities..."
          value={uniqueDescription}
          onChange={(e) => updateFormData("propertyUnique", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        <div className="flex justify-between text-gray-500 text-sm mt-1">
          <span>Minimum 30 characters required</span>
          <span>
            {uniqueDescription.length}/{maxChars}
          </span>
        </div>
      </div>

      {/* Extra space to avoid footer overlap */}
      <div className="mb-48"></div>
    </form>
  );
};

export default AddPricingDetails;
