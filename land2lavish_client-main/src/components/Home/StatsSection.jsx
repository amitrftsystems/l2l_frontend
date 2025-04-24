import React, { useEffect, useState, useRef } from "react";
import { RiPhoneLine } from "react-icons/ri";

/**
 * Hook to animate numbers from 0 up to a target value when triggered.
 */
function useCountUp(endValue, duration = 2000, trigger) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (!trigger) return; // Only run if triggered

    let start = 0;
    const end = endValue;
    const increment = end / (duration / 16); // Approximate 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCurrentValue(end);
        clearInterval(timer);
      } else {
        setCurrentValue(Math.floor(start));
      }
    }, 16); // ~60 fps

    return () => clearInterval(timer);
  }, [endValue, duration, trigger]);

  return currentValue;
}

const StatsSection = () => {
  const [scrollTriggered, setScrollTriggered] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTriggered) return; // Prevent re-triggering once activated

      const section = sectionRef.current;
      if (!section) return;

      const { top } = section.getBoundingClientRect();

      if (top < window.innerHeight && window.scrollY > lastScrollY) {
        // User has scrolled down into the component for the first time
        setScrollTriggered(true);
      }

      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, scrollTriggered]);

  // Animated stats
  const transactionsCount = useCountUp(95, 2000, scrollTriggered);
  const satisfactionCount = useCountUp(93, 2000, scrollTriggered);
  const propertiesCount = useCountUp(477, 2000, scrollTriggered);

  return (
    <div ref={sectionRef} className="w-full px-6 pt-10 sm:px-10 lg:px-14">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* LEFT COLUMN (TEXT & STATS) */}
        <div className="md:w-1/2 space-y-8">
          {/* Description */}
          <p className="text-gray-700 leading-relaxed text-lg">
            At HL City, we offer more than just real estate services;
            we provide an unparalleled experience tailored to meet your needs and exceed your expectations.
          </p>

          {/* Team Section */}
          <div className="flex flex-col md:flex-row items-center md:space-x-4">
            {/* Team Images */}
            <div className="flex -space-x-3">
              <img
                src="/team1.jpg"
                alt="team"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <img
                src="/team2.webp"
                alt="team"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <img
                src="/team3.webp"
                alt="team"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <img
                src="/team4.webp"
                alt="team"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
            </div>
            {/* "Meet Our Professional Team" text */}
            <p className="text-gray-700 text-md font-medium mt-3 md:mt-0">
              Meet Our Professional Team
            </p>
          </div>

          {/* Stats Section */}
          <div className="space-y-8">
            {/* 1. Successful Transactions */}
            <div className="flex flex-col md:flex-row items-center md:justify-between">
              <span className="text-6xl font-bold text-black">
                {transactionsCount}+
              </span>
              <p className="text-lg text-gray-600 text-center md:text-right mt-2 md:mt-0">
                Successful Transactions Monthly
              </p>
            </div>
            <hr className="border-t border-gray-300" />

            {/* 2. Satisfaction Rate */}
            <div className="flex flex-col md:flex-row items-center md:justify-between">
              <span className="text-6xl font-bold text-black">
                {satisfactionCount}%
              </span>
              <p className="text-lg text-gray-600 text-center md:text-right mt-2 md:mt-0">
                Customer Satisfaction Rate
              </p>
            </div>
            <hr className="border-t border-gray-300" />

            {/* 3. Exquisite Properties */}
            <div className="flex flex-col md:flex-row items-center md:justify-between">
              <span className="text-6xl font-bold text-black">
                {propertiesCount}
              </span>
              <p className="text-lg text-gray-600 text-center md:text-right mt-2 md:mt-0">
                Exquisite Properties Ready for Your Selection
              </p>
            </div>
            <hr className="border-t border-gray-300" />
          </div>
        </div>

        {/* RIGHT COLUMN (IMAGE & OVERLAYS) */}
        <div className="w-[100vw] aspect-square md:w-1/2 md:aspect-auto relative">
          {/* Image */}
          <img
            src="/avenue37.jpg"
            alt="City skyline"
            className="
  w-95 h-95
  object-cover 
  md:h-screen md:scale-90 
  lg:w-full 
  rounded-2xl 
  -mt-6
"
          />

          {/* Contact Button: hidden on mobile, shown on md+ */}
          <button
            className="
              hidden md:flex
              absolute top-6 right-5 md:right-15 
              items-center 
              bg-white/50 hover:bg-gray-100 text-gray-800 
              px-4 py-2 rounded-full shadow transition
            "
          >
            <RiPhoneLine size={24} className="mr-2" />
            Contact Us Now
          </button>

          {/* "Building Your Dreams" (Bottom Left) */}
          <p
            className="
              absolute bottom-13 left-5 md:left-13 
              text-white font-bold text-lg
            "
          >
            Building Your Dreams
          </p>

          {/* Special Offer Card: hidden on mobile, shown on md+ */}
          <div
            className="
              hidden md:flex
              absolute bottom-20 right-5 md:right-15 
              items-center space-x-3 
              bg-white rounded-2xl shadow-lg 
              px-5 py-3
            "
          >
            {/* Profile Image */}
            <img
              src="/team5.webp"
              alt="Expert"
              className="w-14 h-14 rounded-full object-cover border-2 border-white"
            />
            {/* Text Content */}
            <div>
              <p className="text-xs text-gray-600 font-semibold">Special Offer</p>
              <h3 className="text-base font-bold text-gray-800 leading-tight">
                Get The Consultation <br /> With Our Expert
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-10" />
    </div>
  );
};

export default StatsSection;
