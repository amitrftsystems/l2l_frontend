import React from "react";

const SignupOverlay = ({ progress }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
      <p className="text-white text-lg mb-2">
        Your account is being created...
      </p>
      <div className="w-64 bg-gray-600 rounded-full h-2 overflow-hidden">
        <div
          className="bg-green-400 h-2 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-white mt-2">{progress}%</p>
    </div>
  );
};

export default SignupOverlay;
