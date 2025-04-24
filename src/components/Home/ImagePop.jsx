import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const ScalingImageComponent = () => {
  const imageRef = useRef(null);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const image = imageRef.current;
      const imageContainer = imageContainerRef.current;
      const { top, bottom } = imageContainer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (top < viewportHeight && bottom > 0) {
        // Expand image without affecting rounded corners
        image.style.transform = "scale(1.3)";
      } else {
        // Shrink image back to default size
        image.style.transform = "scale(0.8)";
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="relative w-screen h-[30vh] md:h-screen h-[50vh] flex items-center justify-center 
                 overflow-hidden bg-[#EDE8D0]"
    >
      {/* Background Image Container */}
      <div
        ref={imageContainerRef}
        className="relative flex items-center justify-center w-full"
      >
        {/* Scaling Image */}
        <img
          ref={imageRef}
          src="/pop3.jpg" // Replace with your image path
          alt="Real Estate Project"
          className="rounded-2xl transition-transform duration-1000 
                     ease-in-out object-cover w-[80%] h-auto 
                     max-w-[800px] max-h-[500px]"
          style={{
            transform: "scale(0.8)", // Default smaller size
            willChange: "transform", // Optimizes for smooth scaling
          }}
        />

        {/* Animated Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          {/* Main Heading */}
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
          >
            Build Your Future <br /> With Us
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mt-4 text-lg sm:text-xl lg:text-2xl font-light"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 1, ease: "easeOut" }}
          >
            Discover luxury living and real estate investment in HL City.
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default ScalingImageComponent;
