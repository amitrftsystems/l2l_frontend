// src/components/AddMedia.jsx
import React, { useState, useRef } from "react";
// import { uploadToCloudinary } from "../Hooks/cloudinaryUpload";

const AddMedia = ({ formData, updateFormData }) => {
  // ---------------------------
  // Photo states and handlers
  // ---------------------------
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isPhotoDragging, setIsPhotoDragging] = useState(false);
  // Existing photos stored in formData
  const photos = formData.images || [];
  // Pending photos to be reviewed before uploading
  const [pendingPhotos, setPendingPhotos] = useState([]);
  const photoInputRef = useRef(null);

  const openPhotoModal = () => {
    // Clear any previous pending photos when opening modal
    setPendingPhotos([]);
    setShowPhotoModal(true);
  };

  const closePhotoModal = () => {
    setShowPhotoModal(false);
    setIsPhotoDragging(false);
    // Optionally clear pending photos on cancel
    setPendingPhotos([]);
  };

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    handlePhotoFiles(files);
  };

  const handlePhotoFiles = async (files) => {
    const newPhotos = await Promise.all(files.map(uploadImageFile));
    // Add selected files to pendingPhotos for review
    setPendingPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handlePhotoDrop = (e) => {
    e.preventDefault();
    setIsPhotoDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handlePhotoFiles(files);
  };

  const handlePhotoDragOver = (e) => {
    e.preventDefault();
    setIsPhotoDragging(true);
  };

  const handlePhotoDragLeave = (e) => {
    e.preventDefault();
    setIsPhotoDragging(false);
  };

  const handlePhotoBrowseClick = () => {
    if (photoInputRef.current) {
      photoInputRef.current.click();
    }
  };

  // Remove a photo from main form data
  const handleRemovePhoto = (index) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    updateFormData("images", updatedPhotos);
  };

  // Remove a pending photo from review list
  const handleRemovePendingPhoto = (index) => {
    setPendingPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const hasMinimumPhotos = photos.length >= 0;

  // ---------------------------
  // Video states and handlers
  // ---------------------------
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isVideoDragging, setIsVideoDragging] = useState(false);
  const videos = formData.videos || [];
  const [pendingVideos, setPendingVideos] = useState([]);
  const videoInputRef = useRef(null);

  const openVideoModal = () => {
    setPendingVideos([]);
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setIsVideoDragging(false);
    setPendingVideos([]);
  };

  const handleVideoSelect = (e) => {
    const files = Array.from(e.target.files);
    handleVideoFiles(files);
  };

  const handleVideoFiles = async (files) => {
    const newVideos = await Promise.all(files.map(uploadVideoFile));
    setPendingVideos((prev) => [...prev, ...newVideos]);
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    setIsVideoDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleVideoFiles(files);
  };

  const handleVideoDragOver = (e) => {
    e.preventDefault();
    setIsVideoDragging(true);
  };

  const handleVideoDragLeave = (e) => {
    e.preventDefault();
    setIsVideoDragging(false);
  };

  const handleVideoBrowseClick = () => {
    if (videoInputRef.current) {
      videoInputRef.current.click();
    }
  };

  // Remove a video from main form data
  const handleRemoveVideo = (index) => {
    const updatedVideos = videos.filter((_, i) => i !== index);
    updateFormData("videos", updatedVideos);
  };

  // Remove a pending video from review list
  const handleRemovePendingVideo = (index) => {
    setPendingVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const hasMinimumVideos = videos.length >= 0;

  // ---------------------------
  // Upload handlers to add pending files to formData
  // ---------------------------
  const handlePhotoUpload = () => {
    updateFormData("images", [...photos, ...pendingPhotos]);
    setPendingPhotos([]);
    setShowPhotoModal(false);
  };
  const handleVideoUpload = () => {
    updateFormData("videos", [...videos, ...pendingVideos]);
    setPendingVideos([]);
    setShowVideoModal(false);
  };

  const uploadImageFile = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "images_preset");

    try {
      const cloudName = "de3did404";
      let resourceType = "image";
      let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const response = await fetch(api, {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      alert("File upload failed. Please try again.");
      console.error("File upload error:", error);
      return null;
    }
  };

  const uploadVideoFile = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "videos_preset");

    try {
      const cloudName = "de3did404";
      let resourceType = "video";
      let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const response = await fetch(api, {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      alert("File upload failed. Please try again.");
      console.error("File upload error:", error);
      return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-10 space-y-12">
      {/* ---------------------------
          Photos Section
         --------------------------- */}
      <div>
        <h1 className="text-3xl font-bold mb-4">
          Add some photos of your barn
        </h1>
        <p className="text-gray-600 mb-6">
          You'll need <strong>5 photos</strong> to get started. You can add more
          or make changes later.
        </p>

        {photos.length === 0 ? (
          /* If no photos exist, show large "Add photos" area */
          <div
            className="w-full h-96 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-center cursor-pointer"
            onClick={openPhotoModal}
          >
            <span className="text-4xl font-bold mb-2">+</span>
            <p className="text-base">Add photos</p>
          </div>
        ) : (
          /* If photos exist, display them in a 3-column grid plus an "Add more" tile */
          <div className="grid grid-cols-3 gap-4 mb-4">
            {photos.map((img, index) => (
              <div
                key={index}
                className="relative w-full h-48 border rounded overflow-hidden"
              >
                <img
                  src={img}
                  alt={`upload-${index}`}
                  className="object-cover w-full h-full"
                />
                <button
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-2 right-2 bg-black text-white rounded-full px-2 py-1 text-xs"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* "Add more" tile as the last item in the grid */}
            <div
              onClick={openPhotoModal}
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer h-48"
            >
              <span className="text-4xl font-bold mb-1">+</span>
              <p className="text-base">Add more</p>
            </div>
          </div>
        )}

        {!hasMinimumPhotos && (
          <p className="text-red-500 mt-2">
            You must upload at least 5 photos to continue.
          </p>
        )}
      </div>

      {/* ---------------------------
          Videos Section
         --------------------------- */}
      <div>
        <h1 className="text-3xl font-bold mb-4">
          Add some videos of your barn
        </h1>
        <p className="text-gray-600 mb-6">
          You'll need <strong>2 videos</strong> to get started. You can add more
          or make changes later.
        </p>

        {videos.length === 0 ? (
          /* If no videos exist, show large "Add videos" area */
          <div
            className="w-full h-96 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-center cursor-pointer"
            onClick={openVideoModal}
          >
            <span className="text-4xl font-bold mb-2">+</span>
            <p className="text-base">Add videos</p>
          </div>
        ) : (
          /* If videos exist, display them in a 3-column grid plus an "Add more" tile */
          <div className="grid grid-cols-3 gap-4 mb-4">
            {videos.map((vid, index) => (
              <div
                key={index}
                className="relative w-full h-48 border rounded overflow-hidden"
              >
                <video
                  src={vid}
                  controls
                  className="object-cover w-full h-full"
                />
                <button
                  onClick={() => handleRemoveVideo(index)}
                  className="absolute top-2 right-2 bg-black text-white rounded-full px-2 py-1 text-xs"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* "Add more" tile as the last item in the grid */}
            <div
              onClick={openVideoModal}
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer h-48"
            >
              <span className="text-4xl font-bold mb-1">+</span>
              <p className="text-base">Add more</p>
            </div>
          </div>
        )}

        {!hasMinimumVideos && (
          <p className="text-red-500 mt-2">
            You must upload at least 2 videos to continue.
          </p>
        )}
      </div>

      {/* ---------------------------
          Photo Upload Modal (Review Step)
         --------------------------- */}
      {showPhotoModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closePhotoModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-lg mx-auto rounded shadow-lg p-6 z-10">
            <h2 className="text-xl font-semibold mb-4">Review Photos</h2>
            {/* Drag & Drop Area */}
            <div
              onDrop={handlePhotoDrop}
              onDragOver={handlePhotoDragOver}
              onDragLeave={handlePhotoDragLeave}
              className={`w-full h-40 border-2 border-dashed rounded flex flex-col items-center justify-center mb-4 ${
                isPhotoDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <p className="text-gray-500">
                Drag and drop or browse for photos
              </p>
              <button
                type="button"
                onClick={handlePhotoBrowseClick}
                className="mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Browse
              </button>
              <input
                type="file"
                multiple
                accept="image/*"
                ref={photoInputRef}
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </div>

            {/* Preview selected photos */}
            {pendingPhotos.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Selected Photos:</h3>
                <div className="max-h-80 overflow-y-auto grid grid-cols-3 gap-2">
                  {pendingPhotos.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`pending-${index}`}
                        className="object-cover w-full h-20 rounded"
                      />
                      <button
                        onClick={() => handleRemovePendingPhoto(index)}
                        className="absolute top-0 right-0 bg-black text-white text-xs rounded-full px-1"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={closePhotoModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handlePhotoUpload}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
                disabled={pendingPhotos.length === 0}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------
          Video Upload Modal (Review Step)
         --------------------------- */}
      {showVideoModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeVideoModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-lg mx-auto rounded shadow-lg p-6 z-10">
            <h2 className="text-xl font-semibold mb-4">Review Videos</h2>
            {/* Drag & Drop Area */}
            <div
              onDrop={handleVideoDrop}
              onDragOver={handleVideoDragOver}
              onDragLeave={handleVideoDragLeave}
              className={`w-full h-40 border-2 border-dashed rounded flex flex-col items-center justify-center mb-4 ${
                isVideoDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <p className="text-gray-500">
                Drag and drop or browse for videos
              </p>
              <button
                type="button"
                onClick={handleVideoBrowseClick}
                className="mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Browse
              </button>
              <input
                type="file"
                multiple
                accept="video/*"
                ref={videoInputRef}
                onChange={handleVideoSelect}
                className="hidden"
              />
            </div>

            {/* Preview selected videos */}
            {pendingVideos.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Selected Videos:</h3>
                <div className="max-h-80 overflow-y-auto grid grid-cols-3 gap-2">
                  {pendingVideos.map((vid, index) => (
                    <div key={index} className="relative">
                      <video
                        src={vid}
                        className="object-cover w-full h-20 rounded"
                      />
                      <button
                        onClick={() => handleRemovePendingVideo(index)}
                        className="absolute top-0 right-0 bg-black text-white text-xs rounded-full px-1"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={closeVideoModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleVideoUpload}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
                disabled={pendingVideos.length === 0}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extra space so it's not hidden by a fixed footer */}
      <div className="mb-48"></div>
    </div>
  );
};

export default AddMedia;

// improved code:
// import React, { useState, useRef, useCallback } from "react";
// import PropTypes from "prop-types";
// // import { uploadToCloudinary } from "../Hooks/cloudinaryUpload";

// const AddMedia = ({ formData, updateFormData }) => {
//   // ---------------------------
//   // Photo states and handlers
//   // ---------------------------
//   const [showPhotoModal, setShowPhotoModal] = useState(false);
//   const [isPhotoDragging, setIsPhotoDragging] = useState(false);
//   const photos = formData.images || [];
//   const [pendingPhotos, setPendingPhotos] = useState([]);
//   const photoInputRef = useRef(null);

//   const openPhotoModal = useCallback(() => {
//     setPendingPhotos([]);
//     setShowPhotoModal(true);
//   }, []);

//   const closePhotoModal = useCallback(() => {
//     setShowPhotoModal(false);
//     setIsPhotoDragging(false);
//     setPendingPhotos([]);
//   }, []);

//   const handlePhotoSelect = useCallback((e) => {
//     const files = Array.from(e.target.files);
//     handlePhotoFiles(files);
//   }, []);

//   const handlePhotoFiles = useCallback((files) => {
//     const newPhotos = files.map((file) => ({
//       file,
//       preview: URL.createObjectURL(file),
//     }));
//     setPendingPhotos((prev) => [...prev, ...newPhotos]);
//   }, []);

//   const handlePhotoDrop = useCallback((e) => {
//     e.preventDefault();
//     setIsPhotoDragging(false);
//     const files = Array.from(e.dataTransfer.files);
//     handlePhotoFiles(files);
//   }, [handlePhotoFiles]);

//   const handlePhotoDragOver = useCallback((e) => {
//     e.preventDefault();
//     setIsPhotoDragging(true);
//   }, []);

//   const handlePhotoDragLeave = useCallback((e) => {
//     e.preventDefault();
//     setIsPhotoDragging(false);
//   }, []);

//   const handlePhotoBrowseClick = useCallback(() => {
//     if (photoInputRef.current) {
//       photoInputRef.current.click();
//     }
//   }, []);

//   const handleRemovePhoto = useCallback(
//     (index) => {
//       const updatedPhotos = photos.filter((_, i) => i !== index);
//       updateFormData("images", updatedPhotos);
//     },
//     [photos, updateFormData]
//   );

//   const handleRemovePendingPhoto = useCallback((index) => {
//     setPendingPhotos((prev) => prev.filter((_, i) => i !== index));
//   }, []);

//   // Require at least 5 photos to continue
//   const hasMinimumPhotos = photos.length >= 5;

//   // ---------------------------
//   // Video states and handlers
//   // ---------------------------
//   const [showVideoModal, setShowVideoModal] = useState(false);
//   const [isVideoDragging, setIsVideoDragging] = useState(false);
//   const videos = formData.videos || [];
//   const [pendingVideos, setPendingVideos] = useState([]);
//   const videoInputRef = useRef(null);

//   const openVideoModal = useCallback(() => {
//     setPendingVideos([]);
//     setShowVideoModal(true);
//   }, []);

//   const closeVideoModal = useCallback(() => {
//     setShowVideoModal(false);
//     setIsVideoDragging(false);
//     setPendingVideos([]);
//   }, []);

//   const handleVideoSelect = useCallback((e) => {
//     const files = Array.from(e.target.files);
//     handleVideoFiles(files);
//   }, []);

//   const handleVideoFiles = useCallback((files) => {
//     const newVideos = files.map((file) => ({
//       file,
//       preview: URL.createObjectURL(file),
//     }));
//     setPendingVideos((prev) => [...prev, ...newVideos]);
//   }, []);

//   const handleVideoDrop = useCallback((e) => {
//     e.preventDefault();
//     setIsVideoDragging(false);
//     const files = Array.from(e.dataTransfer.files);
//     handleVideoFiles(files);
//   }, [handleVideoFiles]);

//   const handleVideoDragOver = useCallback((e) => {
//     e.preventDefault();
//     setIsVideoDragging(true);
//   }, []);

//   const handleVideoDragLeave = useCallback((e) => {
//     e.preventDefault();
//     setIsVideoDragging(false);
//   }, []);

//   const handleVideoBrowseClick = useCallback(() => {
//     if (videoInputRef.current) {
//       videoInputRef.current.click();
//     }
//   }, []);

//   const handleRemoveVideo = useCallback(
//     (index) => {
//       const updatedVideos = videos.filter((_, i) => i !== index);
//       updateFormData("videos", updatedVideos);
//     },
//     [videos, updateFormData]
//   );

//   const handleRemovePendingVideo = useCallback((index) => {
//     setPendingVideos((prev) => prev.filter((_, i) => i !== index));
//   }, []);

//   // Require at least 2 videos to continue
//   const hasMinimumVideos = videos.length >= 2;

//   // ---------------------------
//   // Upload handlers to add pending files to formData
//   // ---------------------------
//   const handlePhotoUpload = useCallback(() => {
//     updateFormData("images", [...photos, ...pendingPhotos]);
//     setPendingPhotos([]);
//     setShowPhotoModal(false);
//   }, [photos, pendingPhotos, updateFormData]);

//   // Uncomment and adjust the following for asynchronous Cloudinary uploads if needed.
//   // const handlePhotoUpload = async () => {
//   //   try {
//   //     const uploadedPhotos = await Promise.all(
//   //       pendingPhotos.map(async (photo) => {
//   //         const preset = "preset";
//   //         const url = await uploadToCloudinary(photo.file, preset);
//   //         return { url };
//   //       })
//   //     );
//   //     updateFormData("images", [...photos, ...uploadedPhotos]);
//   //     setPendingPhotos([]);
//   //     setShowPhotoModal(false);
//   //   } catch (error) {
//   //     console.error("Photo upload failed:", error);
//   //   }
//   // };

//   const handleVideoUpload = useCallback(() => {
//     updateFormData("videos", [...videos, ...pendingVideos]);
//     setPendingVideos([]);
//     setShowVideoModal(false);
//   }, [videos, pendingVideos, updateFormData]);

//   // Uncomment and adjust for asynchronous Cloudinary uploads if needed.
//   // const handleVideoUpload = async () => {
//   //   try {
//   //     const uploadedVideos = await Promise.all(
//   //       pendingVideos.map(async (video) => {
//   //         const preset = "preset";
//   //         const url = await uploadToCloudinary(video.file, preset);
//   //         return { url };
//   //       })
//   //     );
//   //     updateFormData("videos", [...videos, ...uploadedVideos]);
//   //     setPendingVideos([]);
//   //     setShowVideoModal(false);
//   //   } catch (error) {
//   //     console.error("Video upload failed:", error);
//   //   }
//   // };

//   return (
//     <div className="w-full max-w-3xl mx-auto py-10 space-y-12">
//       {/* ---------------------------
//           Photos Section
//          --------------------------- */}
//       <div>
//         <h1 className="text-3xl font-bold mb-4">Add some photos of your barn</h1>
//         <p className="text-gray-600 mb-6">
//           You'll need <strong>5 photos</strong> to get started. You can add more or make changes later.
//         </p>

//         {photos.length === 0 ? (
//           <div
//             className="w-full h-96 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-center cursor-pointer"
//             onClick={openPhotoModal}
//           >
//             <span className="text-4xl font-bold mb-2">+</span>
//             <p className="text-base">Add photos</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-3 gap-4 mb-4">
//             {photos.map((img, index) => (
//               <div key={index} className="relative w-full h-48 border rounded overflow-hidden">
//                 <img src={img.preview} alt={`upload-${index}`} className="object-cover w-full h-full" />
//                 <button
//                   onClick={() => handleRemovePhoto(index)}
//                   className="absolute top-2 right-2 bg-black text-white rounded-full px-2 py-1 text-xs"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//             <div
//               onClick={openPhotoModal}
//               className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer h-48"
//             >
//               <span className="text-4xl font-bold mb-1">+</span>
//               <p className="text-base">Add more</p>
//             </div>
//           </div>
//         )}

//         {!hasMinimumPhotos && (
//           <p className="text-red-500 mt-2">
//             You must upload at least 5 photos to continue.
//           </p>
//         )}
//       </div>

//       {/* ---------------------------
//           Videos Section
//          --------------------------- */}
//       <div>
//         <h1 className="text-3xl font-bold mb-4">Add some videos of your barn</h1>
//         <p className="text-gray-600 mb-6">
//           You'll need <strong>2 videos</strong> to get started. You can add more or make changes later.
//         </p>

//         {videos.length === 0 ? (
//           <div
//             className="w-full h-96 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-center cursor-pointer"
//             onClick={openVideoModal}
//           >
//             <span className="text-4xl font-bold mb-2">+</span>
//             <p className="text-base">Add videos</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-3 gap-4 mb-4">
//             {videos.map((vid, index) => (
//               <div key={index} className="relative w-full h-48 border rounded overflow-hidden">
//                 <video src={vid.preview} controls className="object-cover w-full h-full" />
//                 <button
//                   onClick={() => handleRemoveVideo(index)}
//                   className="absolute top-2 right-2 bg-black text-white rounded-full px-2 py-1 text-xs"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//             <div
//               onClick={openVideoModal}
//               className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer h-48"
//             >
//               <span className="text-4xl font-bold mb-1">+</span>
//               <p className="text-base">Add more</p>
//             </div>
//           </div>
//         )}

//         {!hasMinimumVideos && (
//           <p className="text-red-500 mt-2">
//             You must upload at least 2 videos to continue.
//           </p>
//         )}
//       </div>

//       {/* ---------------------------
//           Photo Upload Modal (Review Step)
//          --------------------------- */}
//       {showPhotoModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div className="absolute inset-0 bg-black opacity-50" onClick={closePhotoModal}></div>
//           <div className="relative bg-white w-full max-w-lg mx-auto rounded shadow-lg p-6 z-10">
//             <h2 className="text-xl font-semibold mb-4">Review Photos</h2>
//             <div
//               onDrop={handlePhotoDrop}
//               onDragOver={handlePhotoDragOver}
//               onDragLeave={handlePhotoDragLeave}
//               className={`w-full h-40 border-2 border-dashed rounded flex flex-col items-center justify-center mb-4 ${
//                 isPhotoDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
//               }`}
//             >
//               <p className="text-gray-500">Drag and drop or browse for photos</p>
//               <button
//                 type="button"
//                 onClick={handlePhotoBrowseClick}
//                 className="mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
//               >
//                 Browse
//               </button>
//               <input
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 ref={photoInputRef}
//                 onChange={handlePhotoSelect}
//                 className="hidden"
//               />
//             </div>
//             {pendingPhotos.length > 0 && (
//               <div className="mb-4">
//                 <h3 className="font-semibold mb-2">Selected Photos:</h3>
//                 <div className="max-h-80 overflow-y-auto grid grid-cols-3 gap-2">
//                   {pendingPhotos.map((img, index) => (
//                     <div key={index} className="relative">
//                       <img src={img.preview} alt={`pending-${index}`} className="object-cover w-full h-20 rounded" />
//                       <button
//                         onClick={() => handleRemovePendingPhoto(index)}
//                         className="absolute top-0 right-0 bg-black text-white text-xs rounded-full px-1"
//                       >
//                         &times;
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//             <div className="flex justify-end gap-2">
//               <button onClick={closePhotoModal} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
//                 Cancel
//               </button>
//               <button
//                 onClick={handlePhotoUpload}
//                 className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
//                 disabled={pendingPhotos.length === 0}
//               >
//                 Upload
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ---------------------------
//           Video Upload Modal (Review Step)
//          --------------------------- */}
//       {showVideoModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div className="absolute inset-0 bg-black opacity-50" onClick={closeVideoModal}></div>
//           <div className="relative bg-white w-full max-w-lg mx-auto rounded shadow-lg p-6 z-10">
//             <h2 className="text-xl font-semibold mb-4">Review Videos</h2>
//             <div
//               onDrop={handleVideoDrop}
//               onDragOver={handleVideoDragOver}
//               onDragLeave={handleVideoDragLeave}
//               className={`w-full h-40 border-2 border-dashed rounded flex flex-col items-center justify-center mb-4 ${
//                 isVideoDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
//               }`}
//             >
//               <p className="text-gray-500">Drag and drop or browse for videos</p>
//               <button
//                 type="button"
//                 onClick={handleVideoBrowseClick}
//                 className="mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
//               >
//                 Browse
//               </button>
//               <input
//                 type="file"
//                 multiple
//                 accept="video/*"
//                 ref={videoInputRef}
//                 onChange={handleVideoSelect}
//                 className="hidden"
//               />
//             </div>
//             {pendingVideos.length > 0 && (
//               <div className="mb-4">
//                 <h3 className="font-semibold mb-2">Selected Videos:</h3>
//                 <div className="max-h-80 overflow-y-auto grid grid-cols-3 gap-2">
//                   {pendingVideos.map((vid, index) => (
//                     <div key={index} className="relative">
//                       <video src={vid.preview} className="object-cover w-full h-20 rounded" />
//                       <button
//                         onClick={() => handleRemovePendingVideo(index)}
//                         className="absolute top-0 right-0 bg-black text-white text-xs rounded-full px-1"
//                       >
//                         &times;
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//             <div className="flex justify-end gap-2">
//               <button onClick={closeVideoModal} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
//                 Cancel
//               </button>
//               <button
//                 onClick={handleVideoUpload}
//                 className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
//                 disabled={pendingVideos.length === 0}
//               >
//                 Upload
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Extra space so it's not hidden by a fixed footer */}
//       <div className="mb-48"></div>
//     </div>
//   );
// };

// AddMedia.propTypes = {
//   formData: PropTypes.shape({
//     images: PropTypes.array,
//     videos: PropTypes.array,
//   }).isRequired,
//   updateFormData: PropTypes.func.isRequired,
// };

// export default React.memo(AddMedia);
