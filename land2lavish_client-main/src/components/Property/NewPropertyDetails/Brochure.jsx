import React from "react";

const Brochure = () => {
  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(/pro6.jpg)`,
      }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-xl max-w-2xl text-center shadow-lg">
        <h3 className="text-orange-600 font-semibold uppercase">Elite Merit</h3>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
          Get Inspired with Our Exclusive Brochure
        </h2>
        <p className="text-gray-700 mt-4">
          Discover the full potential of your future home by downloading our
          comprehensive brochure. Packed with detailed information and stunning
          visuals, it's the perfect guide to envisioning your life at Hillcrest.
          Find your dream apartment and explore all that our vibrant community
          has to offer.
        </p>
        <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
          Download Brochure
        </button>
      </div>
    </div>
  );
};

export default Brochure;
