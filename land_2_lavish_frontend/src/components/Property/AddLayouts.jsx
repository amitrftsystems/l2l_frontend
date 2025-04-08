// src/components/AddLayouts.jsx
import React, { useState, useRef } from "react";

const AddLayouts = ({ formData, updateFormData }) => {
  // ---------------------------
  // Layout states and handlers
  // ---------------------------
  const [showLayoutModal, setShowLayoutModal] = useState(false);
  const [isLayoutDragging, setIsLayoutDragging] = useState(false);

  // Existing layouts stored in formData
  const layouts = formData.layouts || [];
  // Pending layouts to review before uploading
  const [pendingLayouts, setPendingLayouts] = useState([]);

  // File input ref
  const fileInputRef = useRef(null);

  // Minimum required layouts
  const hasMinimumLayouts = layouts.length >= 1;

  // ---------------------------
  // Modal open/close
  // ---------------------------
  const openModal = () => {
    // Clear pending when opening modal
    setPendingLayouts([]);
    setShowLayoutModal(true);
  };

  const closeModal = () => {
    setShowLayoutModal(false);
    setIsLayoutDragging(false);
    // Optionally clear pending on cancel
    setPendingLayouts([]);
  };

  // ---------------------------
  // File input & drag-and-drop
  // ---------------------------
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleLayoutFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsLayoutDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleLayoutFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsLayoutDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsLayoutDragging(false);
  };

  // ---------------------------
  // Adding/removing layouts
  // ---------------------------
  // const handleLayoutFiles = (files) => {
  // const newLayouts = files.map((file) => uploadFile(file));
  //  Add to pending so user can review before final upload
  // setPendingLayouts((prev) => [...prev, ...newLayouts]);
  // };

  const handleLayoutFiles = async (files) => {
    const uploadedUrls = await Promise.all(files.map(uploadFile));
    setPendingLayouts((prev) => [
      ...prev,
      ...uploadedUrls.filter((url) => url),
    ]);
  };

  // Remove a layout from main list
  const handleRemoveLayout = (index) => {
    const updated = layouts.filter((_, i) => i !== index);
    updateFormData("layouts", updated);
  };

  // Remove a layout from pending list
  const handleRemovePendingLayout = (index) => {
    setPendingLayouts((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------------------
  // Final upload
  // ---------------------------
  const handleLayoutUpload = () => {
    // Merge pending into main form data
    updateFormData("layouts", [...layouts, ...pendingLayouts]);
    setPendingLayouts([]);
    setShowLayoutModal(false);
  };
  const uploadFile = async (file) => {
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

  return (
    <div className="w-full max-w-3xl mx-auto py-10 space-y-12">
      {/* Layout Section */}
      <div>
        <h1 className="text-3xl font-bold mb-4">Upload your layouts</h1>
        <p className="text-gray-600 mb-6">
          Please upload your layout images. You can add more later.
        </p>

        {layouts.length === 0 ? (
          /* If no layouts exist, show a large "Add layouts" area */
          <div
            className="w-full h-96 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-center cursor-pointer"
            onClick={openModal}
          >
            <span className="text-4xl font-bold mb-2">+</span>
            <p className="text-base">Add layouts</p>
          </div>
        ) : (
          /* If layouts exist, display them in a 3-column grid + an "Add more" tile */
          <div className="grid grid-cols-3 gap-4 mb-4">
            {layouts.map((layout, index) => (
              <div
                key={index}
                className="relative w-full h-48 border rounded overflow-hidden"
              >
                <img
                  src={layout}
                  alt={`layout-${index}`}
                  className="object-cover w-full h-full"
                />
                <button
                  onClick={() => handleRemoveLayout(index)}
                  className="absolute top-2 right-2 bg-black text-white rounded-full px-2 py-1 text-xs"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* "Add more" tile as the last item in the grid */}
            <div
              onClick={openModal}
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer h-48"
            >
              <span className="text-4xl font-bold mb-1">+</span>
              <p className="text-base">Add more</p>
            </div>
          </div>
        )}

        {/* Show a warning if <1 layout */}
        {!hasMinimumLayouts && (
          <p className="text-red-500 mt-2">
            You must upload at least one layout to continue.
          </p>
        )}
      </div>

      {/* Modal for uploading layouts (with a review step) */}
      {showLayoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-lg mx-auto rounded shadow-lg p-6 z-10">
            <h2 className="text-xl font-semibold mb-4">Review Layouts</h2>

            {/* Drag & Drop Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`w-full h-40 border-2 border-dashed rounded flex flex-col items-center justify-center mb-4 ${
                isLayoutDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <p className="text-gray-500">
                Drag and drop or browse for layouts
              </p>
              <button
                type="button"
                onClick={handleBrowseClick}
                className="mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Browse
              </button>
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Preview of selected (pending) layouts */}
            <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto">
              {pendingLayouts.map((layout, index) => (
                <div key={index} className="relative">
                  <img
                    src={layout}
                    alt={`pending-${index}`}
                    className="object-cover w-full h-20 rounded"
                  />
                  <button
                    onClick={() => handleRemovePendingLayout(index)}
                    className="absolute top-1 right-1 bg-black text-white text-xs rounded-full px-1"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            {/* Modal Action Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleLayoutUpload}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
                disabled={pendingLayouts.length === 0}
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

export default AddLayouts;

// improved code:
// import React, { useState, useRef, useCallback } from "react";
// import PropTypes from "prop-types";

// const AddLayouts = ({ formData, updateFormData }) => {
//   // ---------------------------
//   // Layout states and handlers
//   // ---------------------------
//   const [showLayoutModal, setShowLayoutModal] = useState(false);
//   const [isLayoutDragging, setIsLayoutDragging] = useState(false);
//   const layouts = formData.layouts || [];
//   const [pendingLayouts, setPendingLayouts] = useState([]);
//   const fileInputRef = useRef(null);

//   // Minimum required layouts: at least one layout is required
//   const hasMinimumLayouts = layouts.length >= 1;

//   // ---------------------------
//   // Modal open/close handlers
//   // ---------------------------
//   const openModal = useCallback(() => {
//     setPendingLayouts([]);
//     setShowLayoutModal(true);
//   }, []);

//   const closeModal = useCallback(() => {
//     setShowLayoutModal(false);
//     setIsLayoutDragging(false);
//     setPendingLayouts([]);
//   }, []);

//   // ---------------------------
//   // File input & drag-and-drop handlers
//   // ---------------------------
//   const handleBrowseClick = useCallback(() => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   }, []);

//   const handleFileSelect = useCallback((e) => {
//     const files = Array.from(e.target.files);
//     handleLayoutFiles(files);
//   }, []);

//   const handleLayoutFiles = useCallback((files) => {
//     const newLayouts = files.map((file) => ({
//       file,
//       preview: URL.createObjectURL(file),
//     }));
//     setPendingLayouts((prev) => [...prev, ...newLayouts]);
//   }, []);

//   const handleDrop = useCallback((e) => {
//     e.preventDefault();
//     setIsLayoutDragging(false);
//     const files = Array.from(e.dataTransfer.files);
//     handleLayoutFiles(files);
//   }, [handleLayoutFiles]);

//   const handleDragOver = useCallback((e) => {
//     e.preventDefault();
//     setIsLayoutDragging(true);
//   }, []);

//   const handleDragLeave = useCallback((e) => {
//     e.preventDefault();
//     setIsLayoutDragging(false);
//   }, []);

//   // ---------------------------
//   // Remove handlers
//   // ---------------------------
//   const handleRemoveLayout = useCallback(
//     (index) => {
//       const updated = layouts.filter((_, i) => i !== index);
//       updateFormData("layouts", updated);
//     },
//     [layouts, updateFormData]
//   );

//   const handleRemovePendingLayout = useCallback((index) => {
//     setPendingLayouts((prev) => prev.filter((_, i) => i !== index));
//   }, []);

//   // ---------------------------
//   // Final upload handler
//   // ---------------------------
//   const handleLayoutUpload = useCallback(() => {
//     updateFormData("layouts", [...layouts, ...pendingLayouts]);
//     setPendingLayouts([]);
//     setShowLayoutModal(false);
//   }, [layouts, pendingLayouts, updateFormData]);

//   return (
//     <div className="w-full max-w-3xl mx-auto py-10 space-y-12">
//       {/* Layout Section */}
//       <div>
//         <h1 className="text-3xl font-bold mb-4">Upload your layouts</h1>
//         <p className="text-gray-600 mb-6">
//           Please upload your layout images. You can add more later.
//         </p>

//         {layouts.length === 0 ? (
//           // If no layouts exist, show a large "Add layouts" area
//           <div
//             className="w-full h-96 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-center cursor-pointer"
//             onClick={openModal}
//           >
//             <span className="text-4xl font-bold mb-2">+</span>
//             <p className="text-base">Add layouts</p>
//           </div>
//         ) : (
//           // If layouts exist, display them in a grid with an "Add more" tile
//           <div className="grid grid-cols-3 gap-4 mb-4">
//             {layouts.map((layout, index) => (
//               <div
//                 key={index}
//                 className="relative w-full h-48 border rounded overflow-hidden"
//               >
//                 <img
//                   src={layout.preview}
//                   alt={`layout-${index}`}
//                   className="object-cover w-full h-full"
//                 />
//                 <button
//                   onClick={() => handleRemoveLayout(index)}
//                   className="absolute top-2 right-2 bg-black text-white rounded-full px-2 py-1 text-xs"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}

//             {/* "Add more" tile */}
//             <div
//               onClick={openModal}
//               className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer h-48"
//             >
//               <span className="text-4xl font-bold mb-1">+</span>
//               <p className="text-base">Add more</p>
//             </div>
//           </div>
//         )}

//         {/* Warning if minimum layouts not met */}
//         {!hasMinimumLayouts && (
//           <p className="text-red-500 mt-2">
//             You must upload at least one layout to continue.
//           </p>
//         )}
//       </div>

//       {/* Modal for uploading layouts (Review Step) */}
//       {showLayoutModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           {/* Backdrop */}
//           <div
//             className="absolute inset-0 bg-black opacity-50"
//             onClick={closeModal}
//           ></div>

//           {/* Modal Content */}
//           <div className="relative bg-white w-full max-w-lg mx-auto rounded shadow-lg p-6 z-10">
//             <h2 className="text-xl font-semibold mb-4">Review Layouts</h2>

//             {/* Drag & Drop Area */}
//             <div
//               onDrop={handleDrop}
//               onDragOver={handleDragOver}
//               onDragLeave={handleDragLeave}
//               className={`w-full h-40 border-2 border-dashed rounded flex flex-col items-center justify-center mb-4 ${
//                 isLayoutDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
//               }`}
//             >
//               <p className="text-gray-500">
//                 Drag and drop or browse for layouts
//               </p>
//               <button
//                 type="button"
//                 onClick={handleBrowseClick}
//                 className="mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
//               >
//                 Browse
//               </button>
//               <input
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 ref={fileInputRef}
//                 onChange={handleFileSelect}
//                 className="hidden"
//               />
//             </div>

//             {/* Preview Pending Layouts */}
//             {pendingLayouts.length > 0 && (
//               <div className="mb-4">
//                 <h3 className="font-semibold mb-2">Selected Layouts:</h3>
//                 <div className="max-h-80 overflow-y-auto grid grid-cols-3 gap-2">
//                   {pendingLayouts.map((layout, index) => (
//                     <div key={index} className="relative">
//                       <img
//                         src={layout.preview}
//                         alt={`pending-${index}`}
//                         className="object-cover w-full h-20 rounded"
//                       />
//                       <button
//                         onClick={() => handleRemovePendingLayout(index)}
//                         className="absolute top-0 right-0 bg-black text-white text-xs rounded-full px-1"
//                       >
//                         &times;
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Modal Action Buttons */}
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={closeModal}
//                 className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleLayoutUpload}
//                 className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
//                 disabled={pendingLayouts.length === 0}
//               >
//                 Upload
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Extra space for footer */}
//       <div className="mb-48"></div>
//     </div>
//   );
// };

// AddLayouts.propTypes = {
//   formData: PropTypes.shape({
//     layouts: PropTypes.array,
//   }).isRequired,
//   updateFormData: PropTypes.func.isRequired,
// };

// export default React.memo(AddLayouts);
