import React, { useState, useEffect, useRef } from "react";

const tenis = "/amenity1.jpg"; // No need for `/public`
const skate = "/amenity3.jpg";
const swing = "/amenity4.jpg";
const gym = "/amenity5.jpg";
const diein = "/amenity6.jpg";
const park = "/amenity7.jpg";
const lobby = "/amenity2.jpg";

// Amenity Text Component
const AmenityText = ({ title, description }) => {
  return (
    <div className="text-center text-white mb-8">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-lg max-w-4xl mx-auto">{description}</p>
    </div>
  );
};

// Single Amenity Card Component
const AmenityCard = ({ image, title, index, isLoaded }) => {
  return (
    <div
      className={`flex-shrink-0 w-80 h-96 rounded-lg overflow-hidden mx-2 relative group transition-all duration-500 hover:shadow-lg ${
        isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
      }`}
      style={{
        transitionDelay: `${index * 150}ms`,
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background Image */}
      <div
        className="w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Hover Overlay Effect */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-black opacity-60 p-4 flex items-center justify-center transition-all duration-500 
            h-20 group-hover:h-full group-hover:bg-opacity-80"
      >
        <h3 className="text-white text-xl text-center font-bold transition-opacity duration-500">
          {title}
        </h3>
      </div>
    </div>
  );
};

// Amenities Slider Component
const AmenitiesSlider = ({ amenities }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const sliderRef = useRef(null);
  const autoSlideInterval = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Trigger entrance animation on load
  useEffect(() => {
    // Short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    // Only start auto-sliding after initial animation completes
    const initialDelay = setTimeout(() => {
      const startAutoSlide = () => {
        autoSlideInterval.current = setInterval(() => {
          if (!isPaused) {
            setCurrentIndex((prevIndex) =>
              prevIndex === amenities.length - 1 ? 0 : prevIndex + 1
            );
          }
        }, 2000); // Change slide every 4 seconds
      };

      startAutoSlide();
    }, amenities.length * 150 + 1000); // Wait for all cards to animate in

    // Clean up interval and timeout on component unmount
    return () => {
      clearTimeout(initialDelay);
      if (autoSlideInterval.current) {
        clearInterval(autoSlideInterval.current);
      }
    };
  }, [amenities.length, isPaused]);

  // Handle scroll to current slide
  useEffect(() => {
    if (sliderRef.current) {
      // 344px width + 16px margin = 360px per slide
      sliderRef.current.scrollTo({
        left: currentIndex * 360,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  const handleDotClick = (index) => {
    setIsPaused(true); // Pause auto-sliding temporarily
    setCurrentIndex(index);

    // Resume auto-sliding after a short delay
    setTimeout(() => setIsPaused(false), 6000);
  };

  // Pause auto-sliding when hovering over the slider
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  // Resume auto-sliding when mouse leaves the slider
  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div
      className="relative w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="flex overflow-x-auto py-4 hide-scrollbar"
        ref={sliderRef}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {amenities.map((amenity, index) => (
          <AmenityCard
            key={index}
            index={index}
            image={amenity.image}
            title={amenity.title}
            isLoaded={isLoaded}
          />
        ))}
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center mt-4">
        {amenities.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 mx-1 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-500"
            } transition-opacity duration-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: `${(amenities.length + 1) * 150}ms` }}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Main Amenities Container Component
const AmenitiesContainer = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulating API call
    const fetchAmenities = async () => {
      try {
        // Replace with actual API endpoint
        // const response = await fetch('https://api.example.com/amenities');
        // const data = await response.json();

        // Simulated API response
        const data = [
          { id: 1, title: "Gym", image: gym },
          { id: 2, title: "Lobby", image: diein },
          { id: 3, title: "Skate Park", image: skate },
          { id: 4, title: "Swimming Pool", image: swing },
          { id: 5, title: "Tennis Court", image: tenis },
          { id: 6, title: "Green Space", image: park },
          { id: 7, title: "Fine Studio", image: lobby },
        ];

        setAmenities(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load amenities. Please try again later.");
        setLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  if (loading)
    return <div className="text-white text-center">Loading amenities...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div
      className="w-full py-12 bg-black bg-opacity-80"
      style={{
        backgroundImage:
          "url('https://cdn-web.elitemerit.com/ae/assets/images/offplan_amenities.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container mx-auto px-4">
        <AmenityText
          title="Amenities"
          description="Immerse yourself in a community with a wealth of amenities designed to enrich your lifestyle and provide endless enjoyment. From pools and gyms to serene open green spaces, Hillcrest ensures every day feels like a vacation."
        />
        <AmenitiesSlider amenities={amenities} />
      </div>
    </div>
  );
};

export default AmenitiesContainer;
