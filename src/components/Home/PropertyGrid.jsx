import React from "react";
import { Link } from "react-router-dom";

// Original array with custom size classes
const properties = [
  {
    id: 1,
    title: "Luxury Villas",
    img: "p1.jpg",
    size: "col-span-1 row-span-1 row-start-1 row-end-1 col-start-1 translate-y-30 translate-x-30",
  },
  {
    id: 2,
    title: "Penthouse Suites",
    img: "p2.jpg",
    size: "col-span-1 row-start-1 translate-x-30",
  },
  {
    id: 3,
    title: "Apartments",
    img: "p3.jpg",
    size: "col-span-1 row-start-1 -translate-y-20 translate-x-30",
  },
  {
    id: 4,
    title: "Beachfront Properties",
    img: "p4.jpg",
    size: "col-span-1 row-span-1 row-start-1 translate-x-30",
  },
  {
    id: 5,
    title: "Golf Course Residences",
    img: "p5.jpg",
    size: "col-span-1 row-start-1 translate-y-30 translate-x-30",
  },
  {
    id: 6,
    title: "Commercial Spaces",
    img: "p6.jpg",
    size: "col-span-1 row-span-1 row-start-2 translate-y-30 translate-x-30",
  },
  {
    id: 7,
    title: "Townhouses",
    img: "real1.jpg",
    size: "col-span-1 row-span-1 row-start-2 translate-x-30",
  },
  {
    id: 8,
    title: "Waterfront Homes",
    img: "real2.jpg",
    size: "col-span-1 row-span-1 row-start-2 translate-x-30 -translate-y-20",
  },
  {
    id: 9,
    title: "Holiday Homes",
    img: "real3.jpg",
    size: "col-span-1 row-start-2 translate-x-30",
  },
  {
    id: 10,
    title: "Investment",
    img: "p1.jpg",
    size: "col-span-1 row-span-1 row-start-2 translate-y-30 translate-x-30",
  },
  {
    id: 11,
    title: "Eco-friendly Properties",
    img: "p2.jpg",
    size: "col-span-1 row-span-1 row-start-3 translate-x-220",
  },
  {
    id: 12,
    title: "Desert Retreats",
    img: "p3.jpg",
    size: "col-span-1 row-span-1 row-start-3 translate-x-30",
  },
  {
    id: 13,
    title: " ",
    img: "hlcitylogo.jpg",
    size: "col-span-1 row-span-1 row-start-3 translate-x-30 -translate-y-15",
  },
];

const PropertyGrid = () => {
  return (
    <div className="w-screen mx-auto p-4 bg-gray-200">
      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-semibold text-center mb-2 tracking-wide">
        Discover Your Ideal <br /> Property Type
      </h1>

      {/*
        1) LARGE-SCREEN GRID
        - Hidden on screens below `lg`
        - Shows your original layout with row-start, col-span, etc.
      */}
      <div className="hidden lg:grid grid-cols-4 md:grid-cols-6 gap-4 auto-rows-[180px] md:auto-rows-[250px] my-40 -translate-x-4">
        {properties.map((property) => (
          <div
            key={property.id}
            className={`relative rounded-xl overflow-hidden shadow-md ${
              property.id !== 13 ? "group" : ""
            } ${property.size}`}
          >
            {/* Image */}
            <div className="w-full h-full overflow-hidden">
              <img
                src={`/${property.img}`}
                alt={property.title}
                className={`w-full h-full object-cover transition-transform duration-500 ease-in-out ${
                  property.id !== 13 ? "group-hover:scale-110" : ""
                }`}
              />
            </div>

            {/* Overlay & Title */}
            <div
              className={`absolute inset-0 bg-opacity-30 ${
                property.id !== 13
                  ? "group-hover:bg-opacity-50 transition-all duration-300"
                  : ""
              } flex items-end p-4`}
            >
              <h3 className="text-white text-lg font-semibold">
                {property.title}
              </h3>
            </div>

            {/* Hide arrow for ID 13 */}
            {property.id !== 13 && (
              <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md">
                <Link to={"/properties"}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-800"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/*
        2) SMALLER-SCREEN GRID
        - Visible below `lg` only (`lg:hidden`)
        - A simple, responsive grid without the complex row/col/translate classes
      */}
      <div className="grid lg:hidden grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 auto-rows-[180px] md:auto-rows-[250px] my-10">
        {properties.map((property) => {
          // Hide property with id 13 on mobile view
          if (property.id === 13) return null;
          return (
            <div
              key={property.id}
              className={`relative rounded-xl overflow-hidden shadow-md ${
                property.id !== 13 ? "group" : ""
              }`}
            >
              {/* Image */}
              <div className="w-full h-full overflow-hidden">
                <img
                  src={`/${property.img}`}
                  alt={property.title}
                  className={`w-full h-full object-cover transition-transform duration-500 ease-in-out ${
                    property.id !== 13 ? "group-hover:scale-110" : ""
                  }`}
                />
              </div>

              {/* Overlay & Title */}
              <div
                className={`absolute inset-0 bg-opacity-30 ${
                  property.id !== 13
                    ? "group-hover:bg-opacity-50 transition-all duration-300"
                    : ""
                } flex items-end p-4`}
              >
                <h3 className="text-white text-lg font-semibold">
                  {property.title}
                </h3>
              </div>

              {/* Hide arrow for ID 13 */}
              {property.id !== 13 && (
                <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-800"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyGrid;
