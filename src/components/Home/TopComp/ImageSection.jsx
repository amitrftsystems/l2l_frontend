import { useState, useEffect, useRef } from "react";
import "../../Css/HomeStyle.css";
// import { Home } from "lucide-react";
import Catalog from "./Catalog";
import { Link } from "react-router-dom";

function ImageSection() {
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Trigger fade-in effect after component mounts
    setIsVisible(true);
  }, []);

  return (
    <div className="relative w-full h-full translate-y-[-3.5]">
      {/* Text Overlay */}
      <div className="absolute top-[6px] left-4 text-white text-lg animatedText font-semibold">
        <p>More than 100+ real</p>
        <p>estate properties</p>
      </div>
      {/* Centered Text Overlay */}
      <div className="!hidden md:!block absolute top-[6px] left-1/2 transform -translate-x-1/2 text-white text-lg animatedText font-semibold text-center">
  <p>Find your Dream</p>
  <p>home now</p>
</div>



      {/* Icon at the Top-Left Corner with Square Background */}{" "}
      <div className="absolute top-[6px] right-4 bg-white p-2 cursor-pointer rounded-md z-50 shadow-md">
        <Link to={"/signup"}>
          <button className="border-none bg-transparent text-black font-semibold">
            Signup
          </button>
        </Link>
      </div>
      {/* Video */}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover rounded-3xl transition-opacity duration-1000 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        } translate-y-[-2.5]  pointer-events-none`} // Moves video up by 10px
        autoPlay
        muted
        playsInline
        onEnded={() => {
          if (videoRef.current) {
            videoRef.current.pause();
          }
        }}
      >
        <source src="Untitled design (3).mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Catalog Component Positioned at Bottom-Right */}
      <div className="absolute bottom-4 right-4">
        <Catalog />
      </div>
    </div>
  );
}

export default ImageSection;
