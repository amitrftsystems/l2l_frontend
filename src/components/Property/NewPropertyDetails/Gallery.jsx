import { useState } from "react";
import PropTypes from "prop-types"; // Import prop-types for validation
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { images } from "./Details";

export default function ImageSection() {
  const mainImage = images[0];
  const sideImages = images.slice(1, 5);

  const ImageGallery = ({ mainImage, sideImages, images }) => {
    const [showSingleModal, setShowSingleModal] = useState(false);
    const [activeImage, setActiveImage] = useState(null);
    const [showAllModal, setShowAllModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleImageClick = (img) => {
      setActiveImage(img);
      setShowSingleModal(true);
    };

    return (
      <div className="bg-white">
        {/* MOBILE VIEW: Carousel with all images */}
        <div className="md:hidden">
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
          >
            {images.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-screen">
                  <img
                    src={img}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onClick={() => handleImageClick(img)}
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {currentIndex + 1} / {images.length}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="mt-2 text-center">
            <button
              onClick={() => setShowAllModal(true)}
              className="bg-black text-white text-xs md:text-sm px-3 py-1 rounded shadow-md hover:text-black hover:bg-gray-300 transition"
            >
              Show all photos
            </button>
          </div>
        </div>

        {/* Modal for single image view (mobile) */}
        {showSingleModal && activeImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
            <div className="relative w-full h-full">
              <button
                onClick={() => {
                  setShowSingleModal(false);
                  setActiveImage(null);
                }}
                className="absolute top-2 right-2 bg-gray-300 text-black w-8 h-8 flex items-center justify-center rounded-full"
              >
                &times;
              </button>
              <img
                src={activeImage}
                alt="Full view"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* DESKTOP VIEW: Grid Layout */}
        <div className="hidden md:flex flex-row gap-2 ml-10  w-full h-100">
          <div className="w-1/2">
            <img
              src={mainImage}
              alt="Main property view"
              className="w-full h-100 object-cover rounded-lg"
            />
          </div>
          <div className="w-1/2 grid grid-cols-1 gap-1 mr-25 md:grid-cols-2 md:grid-rows-2">
            {sideImages.map((img, index) => {
              const isLastImage = index === sideImages.length - 1;
              return (
                <div key={index} className="relative w-full h-full">
                  <img
                    src={img}
                    alt={`Side image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {isLastImage && (
                    <button
                      onClick={() => setShowAllModal(true)}
                      className="absolute bottom-2 right-2 bg-black text-white text-xs md:text-sm px-3 py-1 rounded shadow-md hover:text-black hover:bg-gray-100 transition"
                    >
                      Show all photos
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal for showing all images */}
        {showAllModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-white p-4 rounded-md w-[90%] md:w-[70%] lg:w-[50%] relative">
              <button
                onClick={() => setShowAllModal(false)}
                className="absolute top-2 right-2 bg-gray-300 text-black w-8 h-8 flex items-center justify-center rounded-full"
              >
                &times;
              </button>
              <h2 className="text-xl mb-4">All Photos</h2>
              <div className="grid grid-cols-2 gap-2">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Full gallery image ${index + 1}`}
                    className="w-full h-32 object-cover rounded cursor-pointer"
                    onClick={() => {
                      setShowAllModal(false);
                      handleImageClick(img);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ✅ Add propTypes validation
  ImageGallery.propTypes = {
    mainImage: PropTypes.string.isRequired, // Single image URL
    sideImages: PropTypes.arrayOf(PropTypes.string).isRequired, // Array of image URLs
    images: PropTypes.arrayOf(PropTypes.string).isRequired, // Array of all image URLs
  };

  return (
    <ImageGallery
      mainImage={mainImage}
      sideImages={sideImages}
      images={images}
    />
  );
}
