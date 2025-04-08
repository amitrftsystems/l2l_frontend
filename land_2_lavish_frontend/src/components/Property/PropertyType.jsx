import React from "react";
import { FaHome, FaHotel, FaLayerGroup, FaStore } from "react-icons/fa";

const PropertyType = ({ formData, updateFormData }) => {
  const propertyTypes = [
    { label: "House", icon: <FaHome /> },
    { label: "Villa", icon: <FaHotel /> },
    { label: "Builder Floors", icon: <FaLayerGroup /> },
    { label: "Shops", icon: <FaStore /> },
  ];

  const handleClick = (label) => {
    // Toggle selection: if already selected, unselect it.
    if (formData.propertyType === label) {
      updateFormData("propertyType", "");
    } else {
      updateFormData("propertyType", label);
    }
  };

  return (
    <div className="p-6 rounded text-center">
      <h2 className="text-3xl font-bold mb-6">
        Which of these best describes your place?
      </h2>
      <div className="grid grid-cols-2 gap-4 mx-auto">
        {propertyTypes.map((type) => {
          const isSelected = formData.propertyType === type.label;
          return (
            <button
              key={type.label}
              type="button"
              onClick={() => handleClick(type.label)}
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
                {type.icon}
              </span>
              <span
                className={`text-lg font-medium ${
                  isSelected ? "text-white" : "text-gray-700"
                } group-hover:text-white`}
              >
                {type.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyType;

// improved code:
// import React, { useCallback } from "react";
// import PropTypes from "prop-types";
// import { FaHome, FaHotel, FaLayerGroup, FaStore } from "react-icons/fa";

// // Move static property types outside the component
// const PROPERTY_TYPES = [
//   { label: "House", icon: <FaHome /> },
//   { label: "Villa", icon: <FaHotel /> },
//   { label: "Builder Floors", icon: <FaLayerGroup /> },
//   { label: "Shops", icon: <FaStore /> },
// ];

// const PropertyType = ({ formData, updateFormData }) => {
//   // useCallback to memoize the handler
//   const handleClick = useCallback(
//     (label) => {
//       // Toggle selection: if already selected, unselect it.
//       if (formData.propertyType === label) {
//         updateFormData("propertyType", "");
//       } else {
//         updateFormData("propertyType", label);
//       }
//     },
//     [formData.propertyType, updateFormData]
//   );

//   return (
//     <div className="p-6 rounded text-center">
//       <h2 className="text-3xl font-bold mb-6">
//         Which of these best describes your place?
//       </h2>
//       <div className="grid grid-cols-2 gap-4 mx-auto">
//         {PROPERTY_TYPES.map((type) => {
//           const isSelected = formData.propertyType === type.label;
//           return (
//             <button
//               key={type.label}
//               type="button"
//               onClick={() => handleClick(type.label)}
//               className={`group flex flex-col items-center justify-center rounded transition-transform duration-300 transform h-28 w-full
//                 ${isSelected ? "border-2 border-black bg-black" : "border border-black bg-white hover:bg-gray-500"}
//                 hover:scale-105 focus:outline-none shadow-md hover:shadow-xl`}
//             >
//               <span
//                 className={`mb-2 text-4xl ${isSelected ? "text-white" : "text-black"} group-hover:text-white`}
//               >
//                 {type.icon}
//               </span>
//               <span
//                 className={`text-lg font-medium ${isSelected ? "text-white" : "text-gray-700"} group-hover:text-white`}
//               >
//                 {type.label}
//               </span>
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// // PropTypes for type checking
// PropertyType.propTypes = {
//   formData: PropTypes.shape({
//     propertyType: PropTypes.string,
//   }).isRequired,
//   updateFormData: PropTypes.func.isRequired,
// };

// // Memoize the component to avoid unnecessary re-renders
// export default React.memo(PropertyType);
