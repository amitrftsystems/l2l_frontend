import React from "react";
import { motion } from "framer-motion";

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
      <div className="w-10 h-10 border-4 border-gray-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      {/* <p className="text-white">Loading...</p> */}
      <div className="text-center mt-6">
        <div className="flex items-center justify-center mb-4">
          <img
            src="/actual.jpg"
            alt="Neon House Logo"
            className="w-24 h-24 animate-spin"
          />{" "}
        </div>

        <motion.div
          className="mb-4 text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
        >
          <p>Creating your account, please wait...</p>
        </motion.div>
        <p className="mb-2 text-xs font-light text-gray-400">
          Empowering your property journey with innovation{" "}
        </p>

        <div className="relative w-64 mx-auto h-2 bg-gray-700 rounded-full">
          <motion.div
            className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "70%" }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
          ></motion.div>{" "}
        </div>
      </div>

      <div className="text-center pb-4">
        <p className="text-xs text-gray-500">
          Finding the best properties <span className="animate-pulse">...</span>{" "}
        </p>
        <p className="text-xs text-gray-500">
          {" "}
          Analyzing market trends <span className="animate-pulse">
            ...
          </span>{" "}
        </p>
        <p className="text-xs text-gray-500">
          Customizing your experience <span className="animate-pulse">...</span>
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;

// improved code:
// import React from "react";
// import { motion } from "framer-motion";

// const LoadingScreen = () => {
//   return (
//     <div className="flex flex-col justify-between inset-0 min-h-screen bg-black text-white z-50">
//       <div className="text-center mt-6">
//         <div className="flex items-center justify-center mb-4">
//           <img
//             src="/actual.jpg"
//             alt="Neon House Logo"
//             className="w-24 h-24 animate-spin"
//           />
//         </div>

//         <motion.div
//           className="mb-4 text-lg font-medium"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
//         >
//           <p>Creating your account, please wait...</p>
//         </motion.div>
//         <p className="mb-2 text-xs font-light text-gray-400">
//           Empowering your property journey with innovation
//         </p>

//         <div className="relative w-64 mx-auto h-2 bg-gray-700 rounded-full">
//           <motion.div
//             className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
//             initial={{ width: "0%" }}
//             animate={{ width: "70%" }}
//             transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
//           ></motion.div>
//         </div>
//       </div>

//       <div className="text-center pb-4">
//         <p className="text-xs text-gray-500">
//           Finding the best properties <span className="animate-pulse">...</span>
//         </p>
//         <p className="text-xs text-gray-500">
//           Analyzing market trends <span className="animate-pulse">...</span>
//         </p>
//         <p className="text-xs text-gray-500">
//           Customizing your experience <span className="animate-pulse">...</span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoadingScreen;
