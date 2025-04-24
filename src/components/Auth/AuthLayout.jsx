import React from "react";
import LoadingOverlay from "./LoadingOverlay";

const AuthLayout = ({ children, animate, loading }) => {
  return (
    <div className="min-h-screen w-full bg-black flex">
      {/* Optional loading overlay */}
      {loading && <LoadingOverlay />}

      {/* Left (Form) Panel: full width on mobile, 40% width on md and larger */}
      <div className="w-full md:w-[40%] flex justify-center items-center p-4">
        <div
          className="w-full h-[650px]  md:w-[500px] bg-[#1c1c1c] rounded-2xl px-30 py-5 text-white"
          style={{ backgroundColor: "#252525" }}
        >
          {children}
        </div>
      </div>

      {/* Right Panel (Video): hidden on mobile, 60% width on md and larger */}
      <div className="hidden md:flex md:w-3/5 relative overflow-hidden justify-center items-center">
        <video
          className={`w-12/12 h-11/12 object-cover rounded-3xl transition-transform duration-800 ${
            animate ? "translate-y-0" : "-translate-y-full"
          }`}
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="mainvid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default AuthLayout;
