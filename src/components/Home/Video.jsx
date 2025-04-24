import React, { useEffect, useRef } from "react";

const MovingTextVideo = () => {
  const textRef = useRef(null);
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);

  useEffect(() => {
    const textElement = textRef.current;
    let animationFrameId;
    let startPos = window.innerWidth;

    const animate = () => {
      if (startPos < -textElement.offsetWidth) {
        startPos = window.innerWidth;
      } else {
        startPos -= 6; // Adjust speed of the text movement
      }
      textElement.style.transform = `translateX(${startPos}px)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const video = videoRef.current;
      const videoContainer = videoContainerRef.current;
      const { top, bottom } = videoContainer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (top < viewportHeight && bottom > 0) {
        // Expand video
        video.classList.remove("scale-50");
        video.classList.add("scale-100");

        // Keep rounded corners while expanding
        video.style.borderRadius = "1.5rem";

        // Remove rounded corners only when fully expanded
        setTimeout(() => {
          if (video.classList.contains("scale-100")) {
            video.style.borderRadius = "0"; // Remove corners after full expansion
          }
        }, 1000); // Match the transition duration
      } else {
        // Shrink video
        video.classList.remove("scale-100");
        video.classList.add("scale-50");

        // Re-add rounded corners when shrinking
        video.style.borderRadius = "1.5rem";
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#F9F8F6]">
      {/* Background Video */}
      <div
        ref={videoContainerRef}
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
      >
        <video
          ref={videoRef}
          className="absolute top-0 left-0 transform rounded-2xl scale-50 transition-all duration-3000 ease-in-out object-cover w-full h-full"
          autoPlay
          loop
          muted
        >
          <source
            src="/HL City Bahadurgarh, HL City, HL City Project, HL City Delhi NCR, hlcity.in - Brave 2025-01-31 10-52-29.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Moving Text */}
        <div
          ref={textRef}
          className="absolute whitespace-nowrap text-white text-4xl font-bold top-1/2 transform -translate-y-1/2"
          style={{ whiteSpace: "nowrap" }}
        >
          Projects with an initial payment from $25,000 • interest-free
        </div>
      </div>
      
    </div>
  );
};

export default MovingTextVideo;
