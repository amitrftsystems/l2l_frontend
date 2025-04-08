// src/components/tellUsAboutProperty.jsx
import React from "react";

const TellUsAboutProperty = ({ formData, updateFormData }) => {
  // Toggle single selections (used for "noOfOpenSides", "constructionDone", "propertyFacing")
  // Allows unselecting the currently selected option by clicking again
  const handleSingleSelect = (field, value) => {
    const currentValue = formData[field];
    if (currentValue === value) {
      // Unselect if it's the same value
      updateFormData(field, "");
    } else {
      // Select if different
      updateFormData(field, value);
    }; }
 

  // Handle multiple checkboxes for "preferredTenants"
  const handlePreferredTenantChange = (tenantValue) => {
    // fallback to empty array if undefined
    let updatedTenants = formData.preferredTenants
      ? [...formData.preferredTenants]
      : [];

    if (updatedTenants.includes(tenantValue)) {
      // If already selected, remove it
      updatedTenants = updatedTenants.filter((t) => t !== tenantValue);
    } else {
      // Otherwise, add it
      updatedTenants.push(tenantValue);
    }
    updateFormData("preferredTenants", updatedTenants);
  };

  // Helper function to generate numeric options (1...100)
  const generateNumberOptions = (count) => {
    const arr = [];
    for (let i = 1; i <= count; i++) {
      arr.push(i);
    }
    return arr;
  };

  return (
    <form className="w-4/5 mx-auto" onSubmit={(e) => e.preventDefault()}>
      <h2 className="text-3xl font-bold mb-2">Tell us about your property</h2>
      {/* <hr className="mb-6" /> */}
      <div className="mb-6"></div>

      {/* Area Details (Required) */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Add Area Details
          <span className="text-red-500 ml-1">*</span>
          <span className="text-gray-400 text-sm ml-1">?</span>
        </label>
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Plot Area"
            value={formData.areaDetails || ""}
            onChange={(e) => updateFormData("areaDetails", e.target.value)}
            className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
            required
          />
          <select
            value={formData.areaUnit || ""}
            onChange={(e) => updateFormData("areaUnit", e.target.value)}
            className="w-1/3 p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select Unit</option>
            <option value="sq.ft">sq.ft.</option>
            <option value="sq.yd">sq.yd.</option>
            <option value="sq.m">sq.m.</option>
            <option value="acre">acre</option>
          </select>
        </div>
      </div>

      {/* 2×2 grid for BHK Type, Floor, Total Floors, and Property Age */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* BHK Type */}
        <div>
          <label className="block font-semibold mb-2">
            BHK Type<span className="text-red-500 ml-1">*</span>
          </label>
          <select
            className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
            value={formData.bhkType || ""}
            onChange={(e) => updateFormData("bhkType", e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="1 RK">1 RK</option>
            <option value="1 BHK">1 BHK</option>
            <option value="2 BHK">2 BHK</option>
            <option value="3 BHK">3 BHK</option>
            <option value="4 BHK">4 BHK</option>
            <option value="4+ BHK">4+ BHK</option>
          </select>
        </div>

        {/* Floor (1..100 + Ground) */}
        <div>
          <label className="block font-semibold mb-2">
            Floor<span className="text-red-500 ml-1">*</span>
          </label>
          <select
            className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
            value={formData.floor || ""}
            onChange={(e) => updateFormData("floor", e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Ground">Ground</option>
            {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Total Floors (1..100 + Ground Only) */}
        <div>
          <label className="block font-semibold mb-2">
            Total Floors<span className="text-red-500 ml-1">*</span>
          </label>
          <select
            className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
            value={formData.totalFloors || ""}
            onChange={(e) => updateFormData("totalFloors", e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Ground Only">Ground Only</option>
            {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Property Age */}
        <div>
          <label className="block font-semibold mb-2">
            Property Age<span className="text-red-500 ml-1">*</span>
          </label>
          <select
            className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
            value={formData.propertyAge || ""}
            onChange={(e) => updateFormData("propertyAge", e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Less than a Year">Less than a Year</option>
            <option value="1 to 3 year">1 to 3 year</option>
            <option value="3 to 5 year">3 to 5 year</option>
            <option value="5 to 10 year">5 to 10 year</option>
            <option value="More than 10 year">More than 10 year</option>
          </select>
        </div>
      </div>

      {/* Furnishing (Required) */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Furnishing
          <span className="text-red-500 ml-1">*</span>
        </label>
        <select
          value={formData.furnishing || ""}
          onChange={(e) => updateFormData("furnishing", e.target.value)}
          className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
          required
        >
          <option value="">Select</option>
          <option value="Fully furnished">Fully furnished</option>
          <option value="Semi-furnished">Semi-furnished</option>
          <option value="Unfurnished">Unfurnished</option>
        </select>
      </div>

      {/* Preferred Tenants (Required, multiple selection) */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Preferred Tenants
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex flex-wrap gap-4">
          {[
            "Anyone",
            "Family",
            "Bachelor Female",
            "Bachelor Male",
            "Company",
          ].map((tenant) => {
            const isChecked = formData.preferredTenants?.includes(tenant);
            return (
              <label key={tenant} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={!!isChecked}
                  onChange={() => handlePreferredTenantChange(tenant)}
                />
                <span className="ml-2 text-gray-700">{tenant}</span>
              </label>
            );
          })}
        </div>
        {/* Hidden input for "required" validation if you want to ensure at least one is selected */}
        <input
          type="hidden"
          value={
            formData.preferredTenants && formData.preferredTenants.length > 0
              ? formData.preferredTenants.join(",")
              : ""
          }
          required
        />
      </div>

      {/* Property Dimensions (Optional) */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Property Dimensions
          <span className="text-gray-400 text-sm ml-1">(Optional)</span>
        </label>
        <div className="mb-4">
          <span className="block mb-1">Length of plot (in Ft.)</span>
          <input
            type="number"
            placeholder="Enter length"
            value={formData.lengthOfPlot || ""}
            onChange={(e) => updateFormData("lengthOfPlot", e.target.value)}
            className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <span className="block mb-1">Breadth of plot (in Ft.)</span>
          <input
            type="number"
            placeholder="Enter breadth"
            value={formData.breadthOfPlot || ""}
            onChange={(e) => updateFormData("breadthOfPlot", e.target.value)}
            className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <span className="block mb-1">Width of facing road</span>
          <input
            type="number"
            placeholder="Enter width"
            value={formData.widthOfFacingRoad || ""}
            onChange={(e) =>
              updateFormData("widthOfFacingRoad", e.target.value)
            }
            className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* No. of Open Sides (Required) */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          No. of open sides
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex gap-2 flex-wrap">
          {["1", "2", "3", "3+"].map((val) => {
            const isSelected = formData.noOfOpenSides === val;
            return (
              <button
                key={val}
                type="button"
                onClick={() => handleSingleSelect("noOfOpenSides", val)}
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
        {/* Hidden input for validation */}
        <input type="hidden" value={formData.noOfOpenSides} required />
      </div>

      {/* Any Construction Done (Required) */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Any construction done on this property?
          <span className="text-red-500 ml-1">*</span>
          <span className="text-gray-400 text-sm ml-1">?</span>
        </label>
        <div className="flex gap-2 flex-wrap">
          {["Yes", "No"].map((val) => {
            const isSelected = formData.constructionDone === val;
            return (
              <button
                key={val}
                type="button"
                onClick={() => handleSingleSelect("constructionDone", val)}
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
        {/* Hidden input for validation */}
        <input type="hidden" value={formData.constructionDone} required />
      </div>

      {/* Property Facing (Required, Single-Select) */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Property facing
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            "North",
            "South",
            "East",
            "West",
            "North-East",
            "North-West",
            "South-East",
            "South-West",
          ].map((direction) => {
            const isSelected = formData.propertyFacing === direction;
            return (
              <button
                key={direction}
                type="button"
                onClick={() => handleSingleSelect("propertyFacing", direction)}
                className={`px-4 py-2 rounded-full border transition ${
                  isSelected
                    ? "bg-black text-white border-black"
                    : "bg-white border-gray-300 text-gray-700"
                } hover:bg-black hover:text-white focus:outline-none`}
              >
                {direction}
              </button>
            );
          })}
        </div>
        {/* Hidden input for validation */}
        <input type="hidden" value={formData.propertyFacing} required />
      </div>

      {/* Possession By (Required) */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Possession By
          <span className="text-red-500 ml-1">*</span>
        </label>
        <select
          value={formData.possessionBy || ""}
          onChange={(e) => updateFormData("possessionBy", e.target.value)}
          className="w-full p-2 border-b border-gray-300 rounded focus:outline-none focus:border-blue-500"
          required
        >
          <option value="">Expected by</option>
          <option value="Immediate">Immediate</option>
          <option value="1 Month">Within 1 Month</option>
          <option value="3 Months">Within 3 Months</option>
          <option value="6 Months">Within 6 Months</option>
          <option value="1 Year">Within 1 Year</option>
          <option value="2 Years">Within 2 Years</option>
        </select>
      </div>

      {/* Additional space at the bottom */}
      <div className="mb-48"></div>
    </form>
  );
};

export default TellUsAboutProperty;
