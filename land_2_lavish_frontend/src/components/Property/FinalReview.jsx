import React, { useState } from "react";
import {
  FaHome,
  FaHotel,
  FaLayerGroup,
  FaStore,
  FaQuestionCircle,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { MdPool, MdElevator } from "react-icons/md";

const FinalReview = ({ formData }) => {
  // Choose an icon based on propertyType
  const renderPropertyIcon = () => {
    switch (formData.propertyType) {
      case "House":
        return <FaHome className="text-3xl text-gray-600" />;
      case "Villa":
        return <FaHotel className="text-3xl text-gray-600" />;
      case "Builder Floors":
        return <FaLayerGroup className="text-3xl text-gray-600" />;
      case "Shops":
        return <FaStore className="text-3xl text-gray-600" />;
      default:
        return <FaQuestionCircle className="text-3xl text-gray-600" />;
    }
  };

  // State for modal navigation
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedMediaList, setSelectedMediaList] = useState([]);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  // We'll track the type so we know whether to render an <img> or <video>
  const [selectedMediaType, setSelectedMediaType] = useState(null);

  /**
   * handleMediaClick:
   *  - mediaArray: the entire array of images/videos/layouts
   *  - startIndex: which item was clicked
   *  - type: "image" or "video"
   */
  const handleMediaClick = (mediaArray, startIndex, type) => {
    setSelectedMediaList(mediaArray);
    setSelectedMediaIndex(startIndex);
    setSelectedMediaType(type);
    setShowMediaModal(true);
  };

  const closeModal = () => {
    setShowMediaModal(false);
    setSelectedMediaList([]);
    setSelectedMediaIndex(0);
    setSelectedMediaType(null);
  };

  // Navigate to next item in the list
  const nextMedia = (e) => {
    e.stopPropagation();
    setSelectedMediaIndex((prev) => (prev + 1) % selectedMediaList.length);
  };

  // Navigate to previous item in the list
  const prevMedia = (e) => {
    e.stopPropagation();
    setSelectedMediaIndex(
      (prev) => (prev - 1 + selectedMediaList.length) % selectedMediaList.length
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 text-gray-700 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Final Review</h1>

      {/* Property Overview */}
      <section className="p-4 border rounded">
        <h2 className="text-2xl font-semibold mb-2">Property Overview</h2>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gray-100 rounded-full">
            {renderPropertyIcon()}
          </div>
          <div>
            <p>
              <span className="font-semibold">Property Type:</span>{" "}
              {formData.propertyType || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Location:</span>{" "}
              {formData.location || "N/A"}
            </p>
            {/*   For fields which will be used when we will build land2lavish.com website
            <p>
              <span className="font-semibold">Area:</span>{" "}
              {formData.area || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Dimensions:</span>{" "}
              {formData.dimensions || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Features:</span>{" "}
              {formData.features || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Contact:</span>{" "}
              {formData.contact || "N/A"}
            </p>
            */}
          </div>
        </div>
      </section>

      {/* Tell Us About Your Property */}
      <section className="p-4 border rounded">
        <h2 className="text-2xl font-semibold mb-2">
          Tell Us About Your Property
        </h2>
        <p>
          <span className="font-semibold">Area Details:</span>{" "}
          {formData.areaDetails || "N/A"} {formData.areaUnit || ""}
        </p>
        <p>
          <span className="font-semibold">Length of Plot:</span>{" "}
          {formData.lengthOfPlot || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Breadth of Plot:</span>{" "}
          {formData.breadthOfPlot || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Width of Facing Road:</span>{" "}
          {formData.widthOfFacingRoad || "N/A"}
        </p>
        <p>
          <span className="font-semibold">No. of Open Sides:</span>{" "}
          {formData.noOfOpenSides || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Construction Done:</span>{" "}
          {formData.constructionDone || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Property Facing:</span>{" "}
          {formData.propertyFacing || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Possession By:</span>{" "}
          {formData.possessionBy || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Preferred Tenants:</span>{" "}
          {formData.preferredTenants && formData.preferredTenants.length > 0
            ? formData.preferredTenants.join(", ")
            : "N/A"}
        </p>
      </section>

      {/* Pricing & Details */}
      <section className="p-4 border rounded">
        <h2 className="text-2xl font-semibold mb-2">Pricing & Details</h2>
        <p>
          <span className="font-semibold">Ownership:</span>{" "}
          {formData.ownership || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Property Authority:</span>{" "}
          {formData.propertyAuthority || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Industry Type:</span>{" "}
          {formData.industryType || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Expected Price:</span>{" "}
          {formData.expectedPrice || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Price per Sq.ft:</span>{" "}
          {formData.pricePerSqFt || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Tax Excluded:</span>{" "}
          {formData.taxExcluded ? "Yes" : "No"}
        </p>
        <p>
          <span className="font-semibold">Price Negotiable:</span>{" "}
          {formData.priceNegotiable ? "Yes" : "No"}
        </p>
        <p>
          <span className="font-semibold">Pre-Leased:</span>{" "}
          {formData.preLeased || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Unique Selling Points:</span>{" "}
          {formData.propertyUnique || "N/A"}
        </p>
      </section>

      {/* Features & Amenities */}
      <section className="p-4 border rounded">
        <h2 className="text-2xl font-semibold mb-2">Features & Amenities</h2>
        <p>
          <span className="font-semibold">Bathrooms:</span>{" "}
          {formData.bathrooms || 0}
        </p>
        <p>
          <span className="font-semibold">Balconies:</span>{" "}
          {formData.balconies || 0}
        </p>
        <p>
          <span className="font-semibold">Kitchens:</span>{" "}
          {formData.kitchens || 0}
        </p>
        <p>
          <span className="font-semibold">Bedrooms:</span>{" "}
          {formData.bedrooms || 0}
        </p>
        <p>
          <span className="font-semibold">Furnishing:</span>{" "}
          {formData.furnishing || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Water Supply:</span>{" "}
          {formData.waterSupply || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Gated Security:</span>{" "}
          {formData.gatedSecurity || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Non-Veg Allowed:</span>{" "}
          {formData.nonVegAllowed || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Property Condition:</span>{" "}
          {formData.propertyCondition || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Floor:</span>{" "}
          {formData.floor || "N/A"} / {formData.totalFloors || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Move-in Date:</span>{" "}
          {formData.moveInDate || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Amenities:</span>{" "}
          {formData.amenities && formData.amenities.length > 0
            ? formData.amenities.join(", ")
            : "N/A"}
        </p>
      </section>

      {/* Media */}
      <section className="p-4 border rounded">
        <h2 className="text-2xl font-semibold mb-2">Media</h2>
        {/* Images */}
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Images</h3>
          {formData.images && formData.images.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {formData.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Image ${index}`}
                  className="w-24 h-24 object-cover rounded cursor-pointer"
                  // For multiple images, pass the entire array, index, and type
                  onClick={() =>
                    handleMediaClick(formData.images, index, "image")
                  }
                />
              ))}
            </div>
          ) : (
            <p>No images uploaded.</p>
          )}
        </div>
        {/* Videos */}
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Videos</h3>
          {formData.videos && formData.videos.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {formData.videos.map((vid, index) => (
                <video
                  key={index}
                  src={vid}
                  controls
                  className="w-48 h-48 rounded cursor-pointer"
                  // For multiple videos, pass the entire array, index, and type
                  onClick={() =>
                    handleMediaClick(formData.videos, index, "video")
                  }
                />
              ))}
            </div>
          ) : (
            <p>No videos uploaded.</p>
          )}
        </div>
        {/* Layouts */}
        <div>
          <h3 className="font-semibold mb-1">Layouts</h3>
          {formData.layouts && formData.layouts.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {formData.layouts.map((layout, index) => (
                <img
                  key={index}
                  src={layout}
                  alt={`Layout ${index}`}
                  className="w-24 h-24 object-cover rounded cursor-pointer"
                  // For multiple layouts, pass the entire array, index, and type
                  onClick={() =>
                    handleMediaClick(formData.layouts, index, "image")
                  }
                />
              ))}
            </div>
          ) : (
            <p>No layouts uploaded.</p>
          )}
        </div>
      </section>

      {/* Contact Information */}
      <section className="p-4 border rounded">
        <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
        <p>
          <span className="font-semibold">Agent Name:</span>{" "}
          {formData.agentName || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Team Name:</span>{" "}
          {formData.teamName || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Phone Number 1:</span>{" "}
          {formData.phoneNumber1 || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Phone Number 2:</span>{" "}
          {formData.phoneNumber2 || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Email Address:</span>{" "}
          {formData.emailAddress || "N/A"}
        </p>
        <div className="my-2 flex items-center gap-2">
          <span className="font-semibold">Agent Profile Photo:</span>
          {formData.agentProfilePhoto ? (
            <img
              src={formData.agentProfilePhoto}
              alt="Agent Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <span>No profile photo uploaded.</span>
          )}
        </div>
        <p>
          <span className="font-semibold">Availability:</span>{" "}
          {formData.availability || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Available All Day:</span>{" "}
          {formData.availableAllDay ? "Yes" : "No"}
        </p>
        {!formData.availableAllDay && (
          <div>
            <p>
              <span className="font-semibold">Start Time:</span>{" "}
              {formData.startTime || "N/A"}
            </p>
            <p>
              <span className="font-semibold">End Time:</span>{" "}
              {formData.endTime || "N/A"}
            </p>
          </div>
        )}
      </section>

      {/* Modal for zoomed-in media with navigation */}
      {showMediaModal && selectedMediaList.length > 0 && (
        <div
          className="fixed inset-0  bg-opacity-70 flex items-center justify-center z-50"
          style={{ backdropFilter: "blur(8px)" }}
          onClick={closeModal}
        >
          <div
            className="relative w-4/5 h-4/5 bg-white flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-70 rounded px-2 py-1"
            >
              Close
            </button>

            {/* Show left/right arrows only if multiple items */}
            {selectedMediaList.length > 1 && (
              <>
                {/* Previous Arrow */}
                <button
                  onClick={prevMedia}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center border border-black text-black bg-transparent"
                >
                  <FaArrowLeft />
                </button>
                {/* Next Arrow */}
                <button
                  onClick={nextMedia}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center border border-black text-black bg-transparent"
                >
                  <FaArrowRight />
                </button>
              </>
            )}

            {/* Display the selected media (image or video) */}
            {selectedMediaType === "image" ? (
              <img
                src={selectedMediaList[selectedMediaIndex].preview}
                alt="Zoomed Media"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <video
                src={selectedMediaList[selectedMediaIndex].preview}
                controls
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* 
  HELPER FUNCTIONS for navigation
  We define them inside the component so they can access state 
*/
function nextMedia(e) {
  e.stopPropagation();
  this.setSelectedMediaIndex(
    (prev) => (prev + 1) % this.selectedMediaList.length
  );
}

function prevMedia(e) {
  e.stopPropagation();
  this.setSelectedMediaIndex(
    (prev) =>
      (prev - 1 + this.selectedMediaList.length) % this.selectedMediaList.length
  );
}

export default FinalReview;

// improved code:
// import React, { useState, useCallback } from "react";
// import PropTypes from "prop-types";
// import {
//   FaHome,
//   FaHotel,
//   FaLayerGroup,
//   FaStore,
//   FaQuestionCircle,
//   FaArrowLeft,
//   FaArrowRight,
// } from "react-icons/fa";
// import { MdPool, MdElevator } from "react-icons/md";

// const FinalReview = ({ formData }) => {
//   // Choose an icon based on propertyType
//   const renderPropertyIcon = useCallback(() => {
//     switch (formData.propertyType) {
//       case "House":
//         return <FaHome className="text-3xl text-gray-600" />;
//       case "Villa":
//         return <FaHotel className="text-3xl text-gray-600" />;
//       case "Builder Floors":
//         return <FaLayerGroup className="text-3xl text-gray-600" />;
//       case "Shops":
//         return <FaStore className="text-3xl text-gray-600" />;
//       default:
//         return <FaQuestionCircle className="text-3xl text-gray-600" />;
//     }
//   }, [formData.propertyType]);

//   // State for modal navigation
//   const [showMediaModal, setShowMediaModal] = useState(false);
//   const [selectedMediaList, setSelectedMediaList] = useState([]);
//   const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
//   const [selectedMediaType, setSelectedMediaType] = useState(null);

//   // Open the modal when a media item is clicked
//   const handleMediaClick = useCallback((mediaArray, startIndex, type) => {
//     setSelectedMediaList(mediaArray);
//     setSelectedMediaIndex(startIndex);
//     setSelectedMediaType(type);
//     setShowMediaModal(true);
//   }, []);

//   const closeModal = useCallback(() => {
//     setShowMediaModal(false);
//     setSelectedMediaList([]);
//     setSelectedMediaIndex(0);
//     setSelectedMediaType(null);
//   }, []);

//   // Navigate to next item in the list
//   const nextMedia = useCallback((e) => {
//     e.stopPropagation();
//     setSelectedMediaIndex((prev) => (prev + 1) % selectedMediaList.length);
//   }, [selectedMediaList]);

//   // Navigate to previous item in the list
//   const prevMedia = useCallback((e) => {
//     e.stopPropagation();
//     setSelectedMediaIndex((prev) => (prev - 1 + selectedMediaList.length) % selectedMediaList.length);
//   }, [selectedMediaList]);

//   return (
//     <div className="max-w-6xl mx-auto p-6 text-gray-700 space-y-8">
//       <h1 className="text-3xl font-bold mb-4">Final Review</h1>

//       {/* Property Overview */}
//       <section className="p-4 border rounded">
//         <h2 className="text-2xl font-semibold mb-2">Property Overview</h2>
//         <div className="flex items-center gap-3 mb-4">
//           <div className="p-3 bg-gray-100 rounded-full">{renderPropertyIcon()}</div>
//           <div>
//             <p>
//               <span className="font-semibold">Property Type:</span>{" "}
//               {formData.propertyType || "N/A"}
//             </p>
//             <p>
//               <span className="font-semibold">Location:</span>{" "}
//               {formData.location || "N/A"}
//             </p>
//             <p>
//               <span className="font-semibold">Area:</span>{" "}
//               {formData.area || "N/A"}
//             </p>
//             <p>
//               <span className="font-semibold">Dimensions:</span>{" "}
//               {formData.dimensions || "N/A"}
//             </p>
//             <p>
//               <span className="font-semibold">Features:</span>{" "}
//               {formData.features || "N/A"}
//             </p>
//             <p>
//               <span className="font-semibold">Contact:</span>{" "}
//               {formData.contact || "N/A"}
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Tell Us About Your Property */}
//       <section className="p-4 border rounded">
//         <h2 className="text-2xl font-semibold mb-2">
//           Tell Us About Your Property
//         </h2>
//         <p>
//           <span className="font-semibold">Area Details:</span>{" "}
//           {formData.areaDetails || "N/A"} {formData.areaUnit || ""}
//         </p>
//         <p>
//           <span className="font-semibold">Length of Plot:</span>{" "}
//           {formData.lengthOfPlot || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Breadth of Plot:</span>{" "}
//           {formData.breadthOfPlot || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Width of Facing Road:</span>{" "}
//           {formData.widthOfFacingRoad || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">No. of Open Sides:</span>{" "}
//           {formData.noOfOpenSides || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Construction Done:</span>{" "}
//           {formData.constructionDone || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Property Facing:</span>{" "}
//           {formData.propertyFacing || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Possession By:</span>{" "}
//           {formData.possessionBy || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Preferred Tenants:</span>{" "}
//           {formData.preferredTenants && formData.preferredTenants.length > 0
//             ? formData.preferredTenants.join(", ")
//             : "N/A"}
//         </p>
//       </section>

//       {/* Pricing & Details */}
//       <section className="p-4 border rounded">
//         <h2 className="text-2xl font-semibold mb-2">Pricing & Details</h2>
//         <p>
//           <span className="font-semibold">Ownership:</span>{" "}
//           {formData.ownership || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Property Authority:</span>{" "}
//           {formData.propertyAuthority || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Industry Type:</span>{" "}
//           {formData.industryType || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Expected Price:</span>{" "}
//           {formData.expectedPrice || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Price per Sq.ft:</span>{" "}
//           {formData.pricePerSqFt || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Tax Excluded:</span>{" "}
//           {formData.taxExcluded ? "Yes" : "No"}
//         </p>
//         <p>
//           <span className="font-semibold">Price Negotiable:</span>{" "}
//           {formData.priceNegotiable ? "Yes" : "No"}
//         </p>
//         <p>
//           <span className="font-semibold">Pre-Leased:</span>{" "}
//           {formData.preLeased || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Unique Selling Points:</span>{" "}
//           {formData.propertyUnique || "N/A"}
//         </p>
//       </section>

//       {/* Features & Amenities */}
//       <section className="p-4 border rounded">
//         <h2 className="text-2xl font-semibold mb-2">Features & Amenities</h2>
//         <p>
//           <span className="font-semibold">Bathrooms:</span>{" "}
//           {formData.bathrooms || 0}
//         </p>
//         <p>
//           <span className="font-semibold">Balconies:</span>{" "}
//           {formData.balconies || 0}
//         </p>
//         <p>
//           <span className="font-semibold">Kitchens:</span>{" "}
//           {formData.kitchens || 0}
//         </p>
//         <p>
//           <span className="font-semibold">Bedrooms:</span>{" "}
//           {formData.bedrooms || 0}
//         </p>
//         <p>
//           <span className="font-semibold">Furnishing:</span>{" "}
//           {formData.furnishing || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Water Supply:</span>{" "}
//           {formData.waterSupply || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Gated Security:</span>{" "}
//           {formData.gatedSecurity || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Non-Veg Allowed:</span>{" "}
//           {formData.nonVegAllowed || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Property Condition:</span>{" "}
//           {formData.propertyCondition || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Floor:</span>{" "}
//           {formData.floor || "N/A"} / {formData.totalFloors || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Move-in Date:</span>{" "}
//           {formData.moveInDate || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Amenities:</span>{" "}
//           {formData.amenities && formData.amenities.length > 0
//             ? formData.amenities.join(", ")
//             : "N/A"}
//         </p>
//       </section>

//       {/* Media */}
//       <section className="p-4 border rounded">
//         <h2 className="text-2xl font-semibold mb-2">Media</h2>
//         {/* Images */}
//         <div className="mb-4">
//           <h3 className="font-semibold mb-1">Images</h3>
//           {formData.images && formData.images.length > 0 ? (
//             <div className="flex flex-wrap gap-2">
//               {formData.images.map((img, index) => (
//                 <img
//                   key={index}
//                   src={img.preview}
//                   alt={`Image ${index}`}
//                   className="w-24 h-24 object-cover rounded cursor-pointer"
//                   onClick={() => handleMediaClick(formData.images, index, "image")}
//                 />
//               ))}
//             </div>
//           ) : (
//             <p>No images uploaded.</p>
//           )}
//         </div>
//         {/* Videos */}
//         <div className="mb-4">
//           <h3 className="font-semibold mb-1">Videos</h3>
//           {formData.videos && formData.videos.length > 0 ? (
//             <div className="flex flex-wrap gap-2">
//               {formData.videos.map((vid, index) => (
//                 <video
//                   key={index}
//                   src={vid.preview}
//                   controls
//                   className="w-48 h-48 rounded cursor-pointer"
//                   onClick={() => handleMediaClick(formData.videos, index, "video")}
//                 />
//               ))}
//             </div>
//           ) : (
//             <p>No videos uploaded.</p>
//           )}
//         </div>
//         {/* Layouts */}
//         <div>
//           <h3 className="font-semibold mb-1">Layouts</h3>
//           {formData.layouts && formData.layouts.length > 0 ? (
//             <div className="flex flex-wrap gap-2">
//               {formData.layouts.map((layout, index) => (
//                 <img
//                   key={index}
//                   src={layout.preview}
//                   alt={`Layout ${index}`}
//                   className="w-24 h-24 object-cover rounded cursor-pointer"
//                   onClick={() => handleMediaClick(formData.layouts, index, "image")}
//                 />
//               ))}
//             </div>
//           ) : (
//             <p>No layouts uploaded.</p>
//           )}
//         </div>
//       </section>

//       {/* Contact Information */}
//       <section className="p-4 border rounded">
//         <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
//         <p>
//           <span className="font-semibold">Agent Name:</span>{" "}
//           {formData.agentName || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Team Name:</span>{" "}
//           {formData.teamName || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Phone Number 1:</span>{" "}
//           {formData.phoneNumber1 || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Phone Number 2:</span>{" "}
//           {formData.phoneNumber2 || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Email Address:</span>{" "}
//           {formData.emailAddress || "N/A"}
//         </p>
//         <div className="my-2 flex items-center gap-2">
//           <span className="font-semibold">Agent Profile Photo:</span>
//           {formData.agentProfilePhoto ? (
//             <img
//               src={formData.agentProfilePhoto.preview}
//               alt="Agent Profile"
//               className="w-20 h-20 rounded-full object-cover"
//             />
//           ) : (
//             <span>No profile photo uploaded.</span>
//           )}
//         </div>
//         <p>
//           <span className="font-semibold">Availability:</span>{" "}
//           {formData.availability || "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">Available All Day:</span>{" "}
//           {formData.availableAllDay ? "Yes" : "No"}
//         </p>
//         {!formData.availableAllDay && (
//           <div>
//             <p>
//               <span className="font-semibold">Start Time:</span>{" "}
//               {formData.startTime || "N/A"}
//             </p>
//             <p>
//               <span className="font-semibold">End Time:</span>{" "}
//               {formData.endTime || "N/A"}
//             </p>
//           </div>
//         )}
//       </section>

//       {/* Modal for zoomed-in media with navigation */}
//       {showMediaModal && selectedMediaList.length > 0 && (
//         <div
//           className="fixed inset-0 bg-opacity-70 flex items-center justify-center z-50"
//           style={{ backdropFilter: "blur(8px)" }}
//           onClick={closeModal}
//         >
//           <div
//             className="relative w-4/5 h-4/5 bg-white flex items-center justify-center p-2"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Close button */}
//             <button
//               onClick={closeModal}
//               className="absolute top-2 right-2 text-white bg-black bg-opacity-70 rounded px-2 py-1"
//             >
//               Close
//             </button>

//             {/* Navigation Arrows */}
//             {selectedMediaList.length > 1 && (
//               <>
//                 <button
//                   onClick={prevMedia}
//                   className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center border border-black text-black bg-transparent"
//                 >
//                   <FaArrowLeft />
//                 </button>
//                 <button
//                   onClick={nextMedia}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center border border-black text-black bg-transparent"
//                 >
//                   <FaArrowRight />
//                 </button>
//               </>
//             )}

//             {/* Display selected media */}
//             {selectedMediaType === "image" ? (
//               <img
//                 src={selectedMediaList[selectedMediaIndex].preview}
//                 alt="Zoomed Media"
//                 className="max-w-full max-h-full object-contain"
//               />
//             ) : (
//               <video
//                 src={selectedMediaList[selectedMediaIndex].preview}
//                 controls
//                 className="max-w-full max-h-full object-contain"
//               />
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// FinalReview.propTypes = {
//   formData: PropTypes.object.isRequired,
// };

// export default React.memo(FinalReview);
