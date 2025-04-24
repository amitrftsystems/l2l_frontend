import React, { useState, useEffect, useRef } from "react";

const TownhouseLayout = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  // Function to trigger animations
  const triggerAnimation = () => {
    setIsVisible(true);
  };

  // Reset animation with delay to avoid immediate re-trigger
  const resetAnimation = () => {
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 200); // Adjust timing as needed
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          triggerAnimation();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative w-full max-w-6xl mx-auto p-6 pt-20"
      ref={containerRef}
    >
      Navigation arrows
      <div className="absolute right-6 top-0 flex space-x-2 z-10">
        <button
          className="bg-orange-500 p-2 rounded text-white"
          onClick={triggerAnimation}
          aria-label="Previous"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M12 5l7 7M12 5l-7 7" />
          </svg>
        </button>
        <button
          className="bg-stone-100 p-2 rounded text-orange-500"
          onClick={resetAnimation}
          aria-label="Next"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M12 19l7-7M12 19l-7-7" />
          </svg>
        </button>
      </div>
      {/* Main container */}
      <div className="flex flex-col md:flex-row md:items-stretch md:space-x-6 relative z-0">
        {/* Floor plan component */}
        <div
          className={`bg-white p-6 rounded-lg shadow-md md:w-1/2 transform transition-all duration-700 ease-out flex flex-col ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
          }`}
        >
          <div className="flex-grow">
            <img
              src="/fl-1.jpg"
              alt="Townhouse Floor Plan"
              className="w-full h-auto border border-gray-200 rounded"
            />
            <p className="text-center text-gray-500 mt-2">FLOOR PLAN</p>
          </div>
        </div>

        {/* Description component */}
        <div
          className={`bg-white rounded-lg shadow-md md:w-1/2 transform transition-all duration-700 ease-out flex flex-col ${
            isVisible ? "translate-x-0 opacity-100" : "translate-x-24 opacity-0"
          }`}
        >
          <div className="p-6 flex-grow flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-blue-900">
                4-BDR Townhouse - Type B
              </h2>
              <p className="text-gray-600 mb-4">
                Elegance meets everyday comfort.
              </p>
              <p className="text-gray-700 mb-6">
                This townhouse comes with four bedrooms and three bathrooms
                across 2625 sqft. A blend of elegance and comfort.
              </p>
              <p className="text-gray-600 mb-2">starting from</p>
              <p className="text-orange-500 text-xl font-semibold mb-6">
                AED 32,90,000
              </p>
              <button className="bg-orange-500 text-white py-3 px-6 rounded-md font-medium w-full mt-auto">
                GET FREE CONSULTATION
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TownhouseLayout;
