import React, { useEffect, useRef, useState } from "react";
import Catalog from "./TopComp/Catalog";

function PartnershipComp() {
  const videoRef = useRef(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);

  useEffect(() => {
    // Reset showCatalog when the component mounts
    setShowCatalog(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasPlayed) {
            if (videoRef.current) {
              videoRef.current.play();
              videoRef.current.playbackRate = 2.0;
            }
          } else {
            if (videoRef.current) {
              videoRef.current.currentTime = videoRef.current.duration - 0.002;
              videoRef.current.pause();
            }
          }
        }
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []); // Empty dependency array ensures reset only on mount

  const handleVideoEnd = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = videoRef.current.duration - 0.002;
      videoRef.current.pause();
    }
    setHasPlayed(true);
    setShowCatalog(true);
  };

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        width="100%"
        height="auto"
        muted
        playsInline
        onEnded={handleVideoEnd}
      >
        <source src="CircleVedio.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {showCatalog && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <Catalog />
        </div>
      )}
    </div>
  );
}

export default PartnershipComp;
