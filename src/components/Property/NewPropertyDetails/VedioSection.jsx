import React, { useState } from "react";
import { vedios } from "./Details";
import { useSwipeable } from "react-swipeable";

const VedioSection = () => {
  const videoArray = Object.values(vedios);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videoArray.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? videoArray.length - 1 : prevIndex - 1
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: false,
  });

  return (
    <div
      className="flex items-center justify-center w-full max-w-2xl mx-auto relative"
      {...handlers}
    >
      {/* Left Triangle (Laptop Only) */}
      <button
        onClick={handlePrev}
        className="hidden md:block absolute left-[-30px] top-1/2 transform -translate-y-1/2
                   border-transparent border-t-[10px] border-b-[10px]
                   border-r-[15px] border-r-gray-800 hover:border-r-gray-600"
      ></button>

      <div className="relative w-full">
        <video
          src={videoArray[currentIndex]}
          controls
          className="w-full h-auto rounded-lg"
        />
        {/* Top-right counter */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          {currentIndex + 1} / {videoArray.length}
        </div>
      </div>

      {/* Right Triangle (Laptop Only) */}
      <button
        onClick={handleNext}
        className="hidden md:block absolute right-[-30px] top-1/2 transform -translate-y-1/2
                   border-transparent border-t-[10px] border-b-[10px]
                   border-l-[15px] border-l-gray-800 hover:border-l-gray-600"
      ></button>
    </div>
  );
};

export default VedioSection;
