import React from "react";
import { motion } from "framer-motion";
import ContactUs from "../TopComp/ContactUs";
import ExploreProperties from "../TopComp/ExploreBottom";

function TextSection() {
  return (
    <>
      <img
        className="h-[90px] w-[100] mix-blend-multiply"
        src="hlcitylogo.jpg"
      />
      <div className="relative flex flex-col min-h-screen mt-10 sm:mt-100 sm:ml-10 md:ml-20 lg:ml-18 lg:mt-28 text-left text-[#252525">
        {/* Animated Heading */}
        <motion.h1
          className="text-xl text-[#252525] sm:ml-10 md:ml-20 lg:ml-55 mb-2 font-primary font-secondary"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 50,
            damping: 20,
          }}
        >
          Get your dream home
        </motion.h1>

        {/* Main Headings with Responsive Margins */}
        <h1 className="mt-[50px] md:mt-0 text-5xl animatedText sm:ml-100 md:ml-20 mb-2 font-primary font-secondary">
  Real Estate in HL City:
</h1>

        <h1 className="text-5xl animatedText sm:ml-10 md:ml-20 lg:ml-30 mb-2 font-primary font-secondary">
          Ideal for living and
        </h1>
        <h1 className="text-5xl animatedText sm:ml-10 md:ml-30 lg:ml-53 font-primary font-secondary">
          investing 
        </h1>
        <h1 className=" text-5xl animatedText sm:ml-10 md:ml-30 lg:ml-53 lg:!hidden font-primary font-secondary">
          in 
        </h1>
        <h1 className=" text-5xl animatedText sm:ml-10 md:ml-30 lg:ml-53 lg:!hidden font-primary font-secondary">
      Bhadurgarh
        </h1>

        <ExploreProperties />

        <div
  className="
    absolute
    bottom-60
    left-[px]       /* Mobile: shift to 150px */
    md:left-[-70px]    /* Laptop: revert to -70px */
    pl-0
  "
>
  <ContactUs />
</div>

      </div>
    </>
  );
}

export default TextSection;
