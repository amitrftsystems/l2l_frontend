import React from "react";

const BuildingImageHolder = () => {
  return (
    <div className="w-screen h-[93vh] relative">
      <img
        src="/HomeImageDetails.webp"
        alt="image"
        className="w-full h-full object-cover"
      />

      {/* Content overlay */}
      <div className="absolute bottom-20 left-0 p-25 bg-opacity-0 w-full">
        <h1 className="text-white text-6xl font-bold">HL City Homes</h1>
        <p className="text-white text-xl mt-2 font-bold">
          "Fully Furnished 1 BHK House for Rent – Prime Location with Modern
          Amenities"
        </p>
        <div className="mt-4">
          <button className="bg-white text-lg text-gray-800 px-4 py-2 rounded mr-4 border border-gray-800 hover:text-white hover:bg-gray-800">
            Download Brochure
          </button>
          <button className="bg-blue-900 text-lg text-white px-4 py-2 rounded hover:text-blue-900 hover:bg-white hover:border hover:border-blue-900">
            Get Free Consultation
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildingImageHolder;
