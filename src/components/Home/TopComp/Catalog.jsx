import React from "react";
import { Download } from "lucide-react";
import { motion } from "framer-motion"; // Import Framer Motion

function Catalog() {
  return (
    // Animated entire Catalog div
    <motion.div
      className="mr-10 bg-white w-40 h-18 rounded-[12px] text-black flex items-center justify-center text-ms p-3 shadow-lg"
      whileHover={{ scale: 1.1 }} // Scale up by 10% when hovered
      whileTap={{ scale: 0.95 }} // Slightly shrink when clicked
      transition={{ type: "spring", stiffness: 200 }} // Smooth bounce effect
    >
      {/* Container for text and icon */}
      <div className="flex items-center space-x-2">
        <span>Catalog Download</span>
        {/* Animated Download Button */}
        <motion.div
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-400 hover:bg-gray-400 shadow-md cursor-pointer transition-all"
          whileHover={{ scale: 1.3 }} // Scale up on hover
          whileTap={{ scale: 0.9 }} // Scale down when clicked
          style={{ aspectRatio: 1 }} // Ensures perfect circle
        >
          <Download className="w-6 h-6 text-black" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Catalog;
