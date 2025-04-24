import React from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt } from "react-icons/fa";

function AnimatedPhoneIcon() {
  return (
    <motion.div
      initial={{ opacity: 0 }} // Start fully transparent
      animate={{ opacity: 1 }} // Fade in
      transition={{ duration: 1 }} // 1 second fade-in
      className="flex items-center justify-center bottom-10 left-10"
    >
      <motion.div
        initial={{ width: 50, height: 50, borderRadius: "50%" }} // Start as a circle
        animate={{ width: 160, height: 50, borderRadius: "50px" }} // Expand to oval
        transition={{ delay: 1, duration: 1.2, ease: "easeOut" }} // Delayed expand
        className="flex items-center bg-black text-white shadow-md overflow-hidden px-1"
      >
        {/* Phone Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="w-10 h-10 flex items-center justify-center bg-gray-500 text-white rounded-full shadow-md"
        >
          <FaPhoneAlt className="text-xl" />
        </motion.div>

        {/* Contact Us Text */}
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2, duration: 0.6 }} // Fade in after expansion
          className="ml-2 mt-1 text-lg font-primary font-secondary"
        >
          Contact Us
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

export default AnimatedPhoneIcon;
