import React, { useEffect, useState } from "react";
import { AdjustmentsIcon } from "@heroicons/react/outline";
import { Link } from "react-router-dom";
import FilterModal from "./filter.jsx";
import Spinner from "../../utils/Spinner.jsx";
import PropertyNavbar from "../NewPropertyDetails/PropertyNavbar.jsx";

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 9; // Adjust this value for items per page

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          "https://property-management-0jzs.onrender.com/api/getAllProperty"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }
        const data = await response.json();
        setProperties(data.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError("Unable to load properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Function to update view count
  const handleUpdateView = async (propertyId, currentViews) => {
    try {
      const updatedViews = currentViews + 1;

      const response = await fetch(
        `https://property-management-0jzs.onrender.com/api/updatePropertyById/${propertyId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ views: updatedViews }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update property views");
      }

      console.log("Property views updated successfully");

      // Update the local state to reflect the change in views
      setProperties((prevProperties) =>
        prevProperties.map((property) =>
          property._id === propertyId
            ? { ...property, views: updatedViews }
            : property
        )
      );
    } catch (error) {
      console.error("Error updating property views:", error);
    }
  };

  const openFilterModal = () => setIsFilterOpen(true);
  const closeFilterModal = () => setIsFilterOpen(false);

  // Pagination logic
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = properties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );
  const totalPages = Math.ceil(properties.length / propertiesPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen relative">
      {/* <PropertyNavbar /> */}
      <button
        onClick={openFilterModal}
        className="absolute top-8 right-8 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors flex items-center"
      >
        <AdjustmentsIcon className="h-5 w-5 mr-2" />
        <span>Filters</span>
      </button>

      <div className="max-w-screen-xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center">
          Explore Our Properties
        </h1>

        {loading && <Spinner />}

        {error ? (
          <p className="text-center text-red-500 mt-4">{error}</p>
        ) : properties.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">
            No properties available.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {currentProperties.map((property) => (
                <div
                  key={property._id}
                  className="relative bg-gray-100 shadow-lg rounded-3xl overflow-hidden hover:scale-105 transition-transform"
                >
                  <div className="relative h-64">
                    <img
                      src={
                        property.images?.[0] || "/images/default-property.jpg"
                      }
                      alt={property.propertyName || "Property Image"}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-4 left-4 px-3 py-1 text-white text-sm font-semibold rounded-lg ${
                        property.listingType === "Rent"
                          ? "bg-green-600"
                          : "bg-blue-600"
                      }`}
                    >
                      {property.listingType === "Rent" ? "Rent" : "Sales"}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col">
                    <h2 className="text-xl font-bold text-gray-900">
                      {property.propertyName ||
                        "Spacious 3-Bedroom Family Home with Modern Amenities"}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {property.address?.city
                        ? `${property.address.city}, ${property.address.state}`
                        : "Location not available"}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-4 text-gray-700">
                      <span className="font-semibold text-lg text-[#252525]">
                        {property.currency} {property.price}
                      </span>
                      <span>🛏 {property.bhkType}</span>
                      <span>🛁 {property.features?.bathrooms} Baths</span>
                      <span>
                        📏 {property.areaDetails} {property.areaUnit}
                      </span>
                    </div>
                    <Link
                      to={`/properties/${property._id}`}
                      className="mt-4 w-full"
                    >
                      <button
                        className="w-full bg-[#252525] text-white py-2 rounded-lg hover:bg-gray-600 transition"
                        onClick={() =>
                          handleUpdateView(property._id, property.views)
                        }
                      >
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {isFilterOpen && <FilterModal onClose={closeFilterModal} />}
    </div>
  );
}
