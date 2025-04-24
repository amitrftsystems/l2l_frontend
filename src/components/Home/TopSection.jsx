import React from "react";
import TextSection from "./TopComp/TextSection";
import ImageSection from "./TopComp/ImageSection";

function TopSection() {
  return (
    <div className="flex flex-col bg-white w-full md:flex-row md:h-screen">
      {/* Text Section with left/right padding */}
      <div className="w-full md:w-1/2 px-6 py-4">
        <TextSection />
      </div>

      {/* 
        Image Section:
        - On mobile: w-[60vw] & aspect-square => appears larger and square
        - Centered with mx-auto
        - On md+: revert to half width (md:w-1/2) and no forced aspect ratio
      */}
     <div className="hidden md:block w-[100vw] aspect-square mx-auto md:w-1/2 md:aspect-auto p-2">
  <ImageSection />
</div>

      
    </div>
  );
}

export default TopSection;
