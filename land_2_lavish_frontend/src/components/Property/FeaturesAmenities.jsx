// src/components/FeaturesAmenities.jsx
import React from "react";
// Example icons used for the amenities list
import {
  FaPhoneVolume,
  FaChild,
  FaUserFriends,
  FaFireAlt,
  FaTint,
  FaBroom,
  FaParking,
  FaWifi,
  FaUsers,
  FaFireExtinguisher,
  FaStore,
  FaTree,
  FaBolt,
  FaSnowflake,
} from "react-icons/fa";
import { MdPool, MdElevator } from "react-icons/md";
import { GiWaterRecycling } from "react-icons/gi";

const FeaturesAmenities = ({ formData, updateFormData }) => {
  // Fallbacks so we don't get undefined errors
  const selectedAmenities = formData.amenities || [];

  // Helper functions for incrementing/decrementing bathrooms, balconies, bedrooms
  const handleIncrement = (field) => {
    const currentValue = formData[field] ?? 0;
    updateFormData(field, currentValue + 1);
  };

  const handleDecrement = (field) => {
    const currentValue = formData[field] ?? 0;
    if (currentValue > 0) {
      updateFormData(field, currentValue - 1);
    }
  };

  // Single-select toggle for Non-Veg Allowed and Gated Security
  const handleYesNoToggle = (field, value) => {
    // If already selected, unselect; otherwise, set
    if (formData[field] === value) {
      updateFormData(field, "");
    } else {
      updateFormData(field, value);
    }
  };

  // Amenities array
  const amenities = [
    { label: "Lift", icon: <MdElevator /> },
    { label: "Air Conditioner", icon: <FaSnowflake /> },
    { label: "Intercom", icon: <FaPhoneVolume /> },
    { label: "Children Play Area", icon: <FaChild /> },
    { label: "Servant Room", icon: <FaUserFriends /> },
    { label: "Gas Pipeline", icon: <FaFireAlt /> },
    { label: "Rain Water Harvesting", icon: <FaTint /> },
    { label: "House Keeping", icon: <FaBroom /> },
    { label: "Visitor Parking", icon: <FaParking /> },
    { label: "Internet Services", icon: <FaWifi /> },
    { label: "Club House", icon: <FaUsers /> },
    { label: "Swimming Pool", icon: <MdPool /> },
    { label: "Fire Safety", icon: <FaFireExtinguisher /> },
    { label: "Shopping Center", icon: <FaStore /> },
    { label: "Park", icon: <FaTree /> },
    { label: "Sewage Treatment Plant", icon: <GiWaterRecycling /> },
    { label: "Power Backup", icon: <FaBolt /> },
  ];

  // Handle toggle of each amenity
  const handleAmenityClick = (label) => {
    if (selectedAmenities.includes(label)) {
      // Remove if already selected
      const newAmenities = selectedAmenities.filter((a) => a !== label);
      updateFormData("amenities", newAmenities);
    } else {
      // Add if not selected
      updateFormData("amenities", [...selectedAmenities, label]);
    }
  };

  return (
    <div className="p-6 rounded">
      {/* Heading */}
      <h2 className="text-2xl font-bold mb-4">
        Provide additional details about your property to get maximum visibility
      </h2>

      {/* Bathrooms, Balconies, Bedrooms (with + / -) */}
      <div className="flex flex-wrap gap-6 items-center mb-6">
        {/* Bathrooms */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">
            Bathroom(s)
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1 border border-gray-300 rounded"
              onClick={() => handleDecrement("bathrooms")}
            >
              -
            </button>
            <span className="w-8 text-center">{formData.bathrooms ?? 0}</span>
            <button
              type="button"
              className="px-3 py-1 border border-gray-300 rounded"
              onClick={() => handleIncrement("bathrooms")}
            >
              +
            </button>
          </div>
          {/* Hidden input for required validation */}
          <input type="hidden" required value={formData.bathrooms ?? ""} />
        </div>

        {/* Balconies */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">
            Balcony
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1 border border-gray-300 rounded"
              onClick={() => handleDecrement("balconies")}
            >
              -
            </button>
            <span className="w-8 text-center">{formData.balconies ?? 0}</span>
            <button
              type="button"
              className="px-3 py-1 border border-gray-300 rounded"
              onClick={() => handleIncrement("balconies")}
            >
              +
            </button>
          </div>
          <input type="hidden" required value={formData.balconies ?? ""} />
        </div>

        {/* Kitchens */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">
            Kitchen(s)
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1 border border-gray-300 rounded"
              onClick={() => handleDecrement("kitchens")}
            >
              -
            </button>
            <span className="w-8 text-center">{formData.kitchens ?? 0}</span>
            <button
              type="button"
              className="px-3 py-1 border border-gray-300 rounded"
              onClick={() => handleIncrement("kitchens")}
            >
              +
            </button>
          </div>
          <input type="hidden" required value={formData.kitchens ?? ""} />
        </div>

        {/* Bedrooms */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">
            Bedroom(s)
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1 border border-gray-300 rounded"
              onClick={() => handleDecrement("bedrooms")}
            >
              -
            </button>
            <span className="w-8 text-center">{formData.bedrooms ?? 0}</span>
            <button
              type="button"
              className="px-3 py-1 border border-gray-300 rounded"
              onClick={() => handleIncrement("bedrooms")}
            >
              +
            </button>
          </div>
          <input type="hidden" required value={formData.bedrooms ?? ""} />
        </div>
      </div>

      {/* Current Property Condition dropdown */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Current Property Condition?
          <span className="text-red-500 ml-1">*</span>
        </label>
        <select
          className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
          value={formData.propertyCondition || ""}
          onChange={(e) => updateFormData("propertyCondition", e.target.value)}
        >
          <option value="">Select</option>
          <option value="Vacant">Vacant</option>
          <option value="Tenant on Notice Period">
            Tenant on Notice Period
          </option>
          <option value="New Property">New Property</option>
          <option value="Need Help to Manage">Need Help to Manage</option>
        </select>
      </div>

      {/* Non-Veg Allowed and Gated Security in one row */}
      <div className="flex flex-wrap gap-6 items-center mb-6">
        {/* Non-Veg Allowed */}
        <div>
          <label className="font-semibold mb-1 block">
            Non-Veg Allowed
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex gap-2">
            {["No", "Yes"].map((val) => {
              const isSelected = formData.nonVegAllowed === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleYesNoToggle("nonVegAllowed", val)}
                  className={`px-4 py-1 rounded-full border transition ${
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
          {/* Hidden input for required validation */}
          <input type="hidden" required value={formData.nonVegAllowed ?? ""} />
        </div>

        {/* Water Supply  */}
        <div>
          <label className="font-semibold mb-1 block">
            Water Supply
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex gap-2">
            {["No", "Yes"].map((val) => {
              const isSelected = formData.watersupply === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleYesNoToggle("watersupply", val)}
                  className={`px-4 py-1 rounded-full border transition ${
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
          {/* Hidden input for required validation */}
          <input type="hidden" required value={formData.watersupply ?? ""} />
        </div>

        {/* Gated Security */}
        <div>
          <label className="font-semibold mb-1 block">
            Gated Security
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex gap-2">
            {["No", "Yes"].map((val) => {
              const isSelected = formData.gatedSecurity === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleYesNoToggle("gatedSecurity", val)}
                  className={`px-4 py-1 rounded-full border transition ${
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
          {/* Hidden input for required validation */}
          <input type="hidden" required value={formData.gatedSecurity ?? ""} />
        </div>
      </div>

      {/* Now continue with the existing Amenities Section */}
      <h2 className="text-3xl font-bold mb-6">
        Select the amenities available in your property
        <span className="text-red-500 ml-1">*</span>
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mx-auto">
        {amenities.map((item) => {
          const isSelected = selectedAmenities.includes(item.label);
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => handleAmenityClick(item.label)}
              className={`group flex flex-col items-center justify-center rounded transition-transform duration-300 transform h-28 w-full
                ${
                  isSelected
                    ? "border-2 border-black bg-black"
                    : "border border-black bg-white hover:bg-gray-500"
                }
                hover:scale-105 focus:outline-none shadow-md hover:shadow-xl`}
            >
              <span
                className={`mb-2 text-4xl ${
                  isSelected ? "text-white" : "text-black"
                } group-hover:text-white`}
              >
                {item.icon}
              </span>
              <span
                className={`text-sm sm:text-base font-medium ${
                  isSelected ? "text-white" : "text-gray-700"
                } group-hover:text-white`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Extra space at the bottom */}
      <div className="mb-48" />
    </div>
  );
};

export default FeaturesAmenities;

// improved code:

// import React, { useCallback } from "react";
// import PropTypes from "prop-types";
// import {
//   FaPhoneVolume,
//   FaChild,
//   FaUserFriends,
//   FaFireAlt,
//   FaTint,
//   FaBroom,
//   FaParking,
//   FaWifi,
//   FaUsers,
//   FaFireExtinguisher,
//   FaStore,
//   FaTree,
//   FaBolt,
//   FaSnowflake,
// } from "react-icons/fa";
// import { MdPool, MdElevator } from "react-icons/md";
// import { GiWaterRecycling } from "react-icons/gi";

// // Static amenities array defined outside the component for performance
// const AMENITIES = [
//   { label: "Lift", icon: <MdElevator /> },
//   { label: "Air Conditioner", icon: <FaSnowflake /> },
//   { label: "Intercom", icon: <FaPhoneVolume /> },
//   { label: "Children Play Area", icon: <FaChild /> },
//   { label: "Servant Room", icon: <FaUserFriends /> },
//   { label: "Gas Pipeline", icon: <FaFireAlt /> },
//   { label: "Rain Water Harvesting", icon: <FaTint /> },
//   { label: "House Keeping", icon: <FaBroom /> },
//   { label: "Visitor Parking", icon: <FaParking /> },
//   { label: "Internet Services", icon: <FaWifi /> },
//   { label: "Club House", icon: <FaUsers /> },
//   { label: "Swimming Pool", icon: <MdPool /> },
//   { label: "Fire Safety", icon: <FaFireExtinguisher /> },
//   { label: "Shopping Center", icon: <FaStore /> },
//   { label: "Park", icon: <FaTree /> },
//   { label: "Sewage Treatment Plant", icon: <GiWaterRecycling /> },
//   { label: "Power Backup", icon: <FaBolt /> },
// ];

// const FeaturesAmenities = ({ formData, updateFormData }) => {
//   const selectedAmenities = formData.amenities || [];

//   // Memoized increment function for numeric fields
//   const handleIncrement = useCallback(
//     (field) => {
//       const currentValue = formData[field] ?? 0;
//       updateFormData(field, currentValue + 1);
//     },
//     [formData, updateFormData]
//   );

//   // Memoized decrement function for numeric fields
//   const handleDecrement = useCallback(
//     (field) => {
//       const currentValue = formData[field] ?? 0;
//       if (currentValue > 0) {
//         updateFormData(field, currentValue - 1);
//       }
//     },
//     [formData, updateFormData]
//   );

//   // Memoized toggle function for Yes/No fields
//   const handleYesNoToggle = useCallback(
//     (field, value) => {
//       if (formData[field] === value) {
//         updateFormData(field, "");
//       } else {
//         updateFormData(field, value);
//       }
//     },
//     [formData, updateFormData]
//   );

//   // Memoized handler for toggling amenities
//   const handleAmenityClick = useCallback(
//     (label) => {
//       if (selectedAmenities.includes(label)) {
//         const newAmenities = selectedAmenities.filter((a) => a !== label);
//         updateFormData("amenities", newAmenities);
//       } else {
//         updateFormData("amenities", [...selectedAmenities, label]);
//       }
//     },
//     [selectedAmenities, updateFormData]
//   );

//   return (
//     <div className="p-6 rounded">
//       <h2 className="text-2xl font-bold mb-4">
//         Provide additional details about your property to get maximum visibility
//       </h2>

//       {/* Bathrooms, Balconies, Kitchens, Bedrooms */}
//       <div className="flex flex-wrap gap-6 items-center mb-6">
//         {/* Bathrooms */}
//         <div className="flex flex-col">
//           <label className="font-semibold mb-1">
//             Bathroom(s)
//             <span className="text-red-500 ml-1">*</span>
//           </label>
//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               className="px-3 py-1 border border-gray-300 rounded"
//               onClick={() => handleDecrement("bathrooms")}
//             >
//               -
//             </button>
//             <span className="w-8 text-center">
//               {formData.bathrooms ?? 0}
//             </span>
//             <button
//               type="button"
//               className="px-3 py-1 border border-gray-300 rounded"
//               onClick={() => handleIncrement("bathrooms")}
//             >
//               +
//             </button>
//           </div>
//           <input type="hidden" required value={formData.bathrooms ?? ""} />
//         </div>

//         {/* Balconies */}
//         <div className="flex flex-col">
//           <label className="font-semibold mb-1">
//             Balcony<span className="text-red-500 ml-1">*</span>
//           </label>
//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               className="px-3 py-1 border border-gray-300 rounded"
//               onClick={() => handleDecrement("balconies")}
//             >
//               -
//             </button>
//             <span className="w-8 text-center">
//               {formData.balconies ?? 0}
//             </span>
//             <button
//               type="button"
//               className="px-3 py-1 border border-gray-300 rounded"
//               onClick={() => handleIncrement("balconies")}
//             >
//               +
//             </button>
//           </div>
//           <input type="hidden" required value={formData.balconies ?? ""} />
//         </div>

//         {/* Kitchens */}
//         <div className="flex flex-col">
//           <label className="font-semibold mb-1">
//             Kitchen(s)
//             <span className="text-red-500 ml-1">*</span>
//           </label>
//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               className="px-3 py-1 border border-gray-300 rounded"
//               onClick={() => handleDecrement("kitchens")}
//             >
//               -
//             </button>
//             <span className="w-8 text-center">
//               {formData.kitchens ?? 0}
//             </span>
//             <button
//               type="button"
//               className="px-3 py-1 border border-gray-300 rounded"
//               onClick={() => handleIncrement("kitchens")}
//             >
//               +
//             </button>
//           </div>
//           <input type="hidden" required value={formData.kitchens ?? ""} />
//         </div>

//         {/* Bedrooms */}
//         <div className="flex flex-col">
//           <label className="font-semibold mb-1">
//             Bedroom(s)
//             <span className="text-red-500 ml-1">*</span>
//           </label>
//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               className="px-3 py-1 border border-gray-300 rounded"
//               onClick={() => handleDecrement("bedrooms")}
//             >
//               -
//             </button>
//             <span className="w-8 text-center">
//               {formData.bedrooms ?? 0}
//             </span>
//             <button
//               type="button"
//               className="px-3 py-1 border border-gray-300 rounded"
//               onClick={() => handleIncrement("bedrooms")}
//             >
//               +
//             </button>
//           </div>
//           <input type="hidden" required value={formData.bedrooms ?? ""} />
//         </div>
//       </div>

//       {/* Current Property Condition dropdown */}
//       <div className="mb-6">
//         <label className="block font-semibold mb-2">
//           Current Property Condition?
//           <span className="text-red-500 ml-1">*</span>
//         </label>
//         <select
//           className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
//           value={formData.propertyCondition || ""}
//           onChange={(e) =>
//             updateFormData("propertyCondition", e.target.value)
//           }
//         >
//           <option value="">Select</option>
//           <option value="Vacant">Vacant</option>
//           <option value="Tenant on Notice Period">
//             Tenant on Notice Period
//           </option>
//           <option value="New Property">New Property</option>
//           <option value="Need Help to Manage">Need Help to Manage</option>
//         </select>
//       </div>

//       {/* Non-Veg Allowed, Water Supply, Gated Security */}
//       <div className="flex flex-wrap gap-6 items-center mb-6">
//         {/* Non-Veg Allowed */}
//         <div>
//           <label className="font-semibold mb-1 block">
//             Non-Veg Allowed
//             <span className="text-red-500 ml-1">*</span>
//           </label>
//           <div className="flex gap-2">
//             {["No", "Yes"].map((val) => {
//               const isSelected = formData.nonVegAllowed === val;
//               return (
//                 <button
//                   key={val}
//                   type="button"
//                   onClick={() => handleYesNoToggle("nonVegAllowed", val)}
//                   className={`px-4 py-1 rounded-full border transition ${
//                     isSelected
//                       ? "bg-black text-white border-black"
//                       : "bg-white border-gray-300 text-gray-700"
//                   } hover:bg-black hover:text-white focus:outline-none`}
//                 >
//                   {val}
//                 </button>
//               );
//             })}
//           </div>
//           <input
//             type="hidden"
//             required
//             value={formData.nonVegAllowed ?? ""}
//           />
//         </div>

//         {/* Water Supply */}
//         <div>
//           <label className="font-semibold mb-1 block">
//             Water Supply
//             <span className="text-red-500 ml-1">*</span>
//           </label>
//           <div className="flex gap-2">
//             {["No", "Yes"].map((val) => {
//               const isSelected = formData.watersupply === val;
//               return (
//                 <button
//                   key={val}
//                   type="button"
//                   onClick={() => handleYesNoToggle("watersupply", val)}
//                   className={`px-4 py-1 rounded-full border transition ${
//                     isSelected
//                       ? "bg-black text-white border-black"
//                       : "bg-white border-gray-300 text-gray-700"
//                   } hover:bg-black hover:text-white focus:outline-none`}
//                 >
//                   {val}
//                 </button>
//               );
//             })}
//           </div>
//           <input
//             type="hidden"
//             required
//             value={formData.watersupply ?? ""}
//           />
//         </div>

//         {/* Gated Security */}
//         <div>
//           <label className="font-semibold mb-1 block">
//             Gated Security
//             <span className="text-red-500 ml-1">*</span>
//           </label>
//           <div className="flex gap-2">
//             {["No", "Yes"].map((val) => {
//               const isSelected = formData.gatedSecurity === val;
//               return (
//                 <button
//                   key={val}
//                   type="button"
//                   onClick={() => handleYesNoToggle("gatedSecurity", val)}
//                   className={`px-4 py-1 rounded-full border transition ${
//                     isSelected
//                       ? "bg-black text-white border-black"
//                       : "bg-white border-gray-300 text-gray-700"
//                   } hover:bg-black hover:text-white focus:outline-none`}
//                 >
//                   {val}
//                 </button>
//               );
//             })}
//           </div>
//           <input
//             type="hidden"
//             required
//             value={formData.gatedSecurity ?? ""}
//           />
//         </div>
//       </div>

//       {/* Amenities Section */}
//       <h2 className="text-3xl font-bold mb-6">
//         Select the amenities available in your property
//         <span className="text-red-500 ml-1">*</span>
//       </h2>
//       <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mx-auto">
//         {AMENITIES.map((item) => {
//           const isSelected = selectedAmenities.includes(item.label);
//           return (
//             <button
//               key={item.label}
//               type="button"
//               onClick={() => handleAmenityClick(item.label)}
//               className={`group flex flex-col items-center justify-center rounded transition-transform duration-300 transform h-28 w-full ${
//                 isSelected
//                   ? "border-2 border-black bg-black"
//                   : "border border-black bg-white hover:bg-gray-500"
//               } hover:scale-105 focus:outline-none shadow-md hover:shadow-xl`}
//             >
//               <span
//                 className={`mb-2 text-4xl ${
//                   isSelected ? "text-white" : "text-black"
//                 } group-hover:text-white`}
//               >
//                 {item.icon}
//               </span>
//               <span
//                 className={`text-sm sm:text-base font-medium ${
//                   isSelected ? "text-white" : "text-gray-700"
//                 } group-hover:text-white`}
//               >
//                 {item.label}
//               </span>
//             </button>
//           );
//         })}
//       </div>

//       <div className="mb-48" />
//     </div>
//   );
// };

// FeaturesAmenities.propTypes = {
//   formData: PropTypes.object.isRequired,
//   updateFormData: PropTypes.func.isRequired,
// };

// export default React.memo(FeaturesAmenities);
