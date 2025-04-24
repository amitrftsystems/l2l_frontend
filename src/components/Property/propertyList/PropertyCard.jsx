import React from "react";

const PropertyCard = ({ property }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-sm flex flex-col transition-transform duration-300 hover:scale-105">
      <div className="relative w-full h-2">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover rounded-t-2xl"
        />
        <span className="absolute top-3 left-3 bg-gray-600 text-white text-xs uppercase font-semibold px-4 py-1 rounded-full shadow-md">
          For Rent
        </span>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900">{property.price}</h3>
        <p className="text-gray-600 text-sm mt-1">{property.location}</p>
        <h4 className="text-sm font-semibold text-gray-800 mt-2 flex-grow">
          {property.title}
        </h4>
        <div className="flex items-center text-gray-500 text-sm mt-3 gap-6">
          <span className="flex items-center gap-1">🛏 {property.bedrooms} Beds</span>
          <span className="flex items-center gap-1">🛁 {property.bathrooms} Baths</span>
          <span className="flex items-center gap-1">📏 {property.size} sqft</span>
        </div>
        <button className="mt-5 bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-md">
          View Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;