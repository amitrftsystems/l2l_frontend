import React from "react";
import { motion } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";
import { Link } from "react-router-dom";

function ExploreBottom() {
  return (
    <div className="absolute bottom-[220px] right-[15px] flex items-center space-x-2 font-primary font-secondary">
      <motion.span
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 0.3,
          type: "spring",
          stiffness: 50,
          damping: 20,
        }} // Controls the fade-in effect
        className="text-sm mb-5 text-black font-bold drop-shadow-[0_0_10px_rgba(0,0,0,0.4)] animate-pulse"
      >
        Explore our<br></br> properties
      </motion.span>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="w-15 h-10 flex items-center justify-center text-white rounded-full hover:scale-110"
      >
        <img
          className="w-10 h-10 mb-5 mr-[-25px] rounded-full"
          src="TopCompExplore.jpg"
          alt="Explore"
        />
        <div className="p-0 mb-13 ml-2 bg-gray-400 rounded-full inline-block">
          <Link to={"/properties"}>
            <FiArrowUp
              className="h-7 w-7 text-black transition-transform duration-200 "
              style={{ transform: "rotate(50deg)" }}
            />{" "}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default ExploreBottom;
