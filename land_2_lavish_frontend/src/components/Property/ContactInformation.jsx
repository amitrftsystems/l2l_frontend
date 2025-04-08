// src/components/ContactInformation.jsx
import React, { useRef } from "react";

const ContactInformation = ({ formData, updateFormData }) => {
  // Ref for file input (for Agent Profile Photo)
  const fileInputRef = useRef(null);

  const uploadFile = async (file, type) => {
    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      type === "image" ? "images_preset" : "videos_preset"
    );

    try {
      const cloudName = "de3did404";
      let resourceType = type === "image" ? "image" : "video";
      let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const response = await fetch(api, {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Uploaded file URL:", result.secure_url);
      return result.secure_url;
    } catch (error) {
      console.error("File upload error:", error);
      return null;
    }
  };

  // Handle profile photo selection
  const handlePhotoSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await uploadFile(file, "image");
      updateFormData("agentProfilePhoto", url);
    }
  };

  // Launch the hidden file input
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const profilePhoto = formData.agentProfilePhoto || null;

  // Toggle availability: if the same button is clicked again, unselect it
  const handleAvailabilitySelect = (value) => {
    if (formData.availability === value) {
      // unselect if already selected
      updateFormData("availability", "");
    } else {
      // select new value
      updateFormData("availability", value);
    }
  };

  // When "Available All Day" is checked, set times to "00:00"
  // If unchecked, clear them
  const toggleAllDay = () => {
    const newValue = !formData.availableAllDay;
    updateFormData("availableAllDay", newValue);

    if (newValue) {
      // If turning on, set both times to "00:00"
      updateFormData("startTime", "00:00");
      updateFormData("endTime", "00:00");
    } else {
      // If turning off, clear times (or keep them if you prefer)
      updateFormData("startTime", "");
      updateFormData("endTime", "");
    }
  };

  return (
    <form className="w-4/5 mx-auto" onSubmit={(e) => e.preventDefault()}>
      <h2 className="text-3xl font-bold mb-4">Contact Information</h2>

      {/* Agent Name */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Agent Name<span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter agent name"
          value={formData.agentName || ""}
          onChange={(e) => updateFormData("agentName", e.target.value)}
          className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      {/* Team Name */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Team Name<span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter team name"
          value={formData.teamName || ""}
          onChange={(e) => updateFormData("teamName", e.target.value)}
          className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      {/* Phone Numbers */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-2">
            Phone Number 1<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="tel"
            placeholder="Enter primary phone number"
            value={formData.phoneNumber1 || ""}
            onChange={(e) => updateFormData("phoneNumber1", e.target.value)}
            className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Phone Number 2</label>
          <input
            type="tel"
            placeholder="Enter secondary phone number"
            value={formData.phoneNumber2 || ""}
            onChange={(e) => updateFormData("phoneNumber2", e.target.value)}
            className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Email Address */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Email Address<span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="email"
          placeholder="Enter email address"
          value={formData.emailAddress || ""}
          onChange={(e) => updateFormData("emailAddress", e.target.value)}
          className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      {/* Agent Profile Photo */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Agent Profile Photo<span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex items-center gap-4">
          {profilePhoto ? (
            <img
              src={formData.agentProfilePhoto}
              alt="Agent Profile"
              className="w-20 h-20 rounded-full object-cover border"
            />
          ) : (
            <div className="w-20 h-20 rounded-full border flex items-center justify-center text-gray-400">
              No photo
            </div>
          )}
          <button
            type="button"
            onClick={handleBrowseClick}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            {profilePhoto ? "Change Photo" : "Upload Photo"}
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePhotoSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Availability */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Availability</label>
        <div className="flex gap-2">
          {[
            { label: "Everyday", sub: "Mon-Sun" },
            { label: "Weekday", sub: "Mon-Fri" },
            { label: "Weekend", sub: "Sat,Sun" },
          ].map((option) => {
            const isSelected = formData.availability === option.label;
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => handleAvailabilitySelect(option.label)}
                className={`px-4 py-2 rounded transition flex flex-col items-center
                  ${
                    isSelected
                      ? "bg-black text-white border border-black"
                      : "bg-white text-gray-700 border border-gray-300"
                  }
                  hover:bg-black hover:text-white focus:outline-none
                `}
              >
                <span className="font-medium">{option.label}</span>
                <span className="text-xs">{option.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Select Time Schedule */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Select Time Schedule</label>
        <div className="flex items-center gap-4 mb-2">
          {/* Start Time */}
          <div>
            <input
              type="time"
              value={formData.startTime || ""}
              onChange={(e) => updateFormData("startTime", e.target.value)}
              disabled={formData.availableAllDay}
              className="p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-36"
            />
          </div>

          {/* End Time */}
          <div>
            <input
              type="time"
              value={formData.endTime || ""}
              onChange={(e) => updateFormData("endTime", e.target.value)}
              disabled={formData.availableAllDay}
              className="p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-36"
            />
          </div>
        </div>

        {/* Available All Day Checkbox */}
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={formData.availableAllDay || false}
            onChange={toggleAllDay}
          />
          <span className="ml-2 text-gray-700">Available All Day</span>
        </label>
      </div>

      {/* Extra space at the bottom */}
      <div className="mb-48"></div>
    </form>
  );
};

export default ContactInformation;

// improved code:
// import React, { useRef, useCallback } from "react";
// import PropTypes from "prop-types";

// const ContactInformation = ({ formData, updateFormData }) => {
//   // Ref for file input (for Agent Profile Photo)
//   const fileInputRef = useRef(null);

//   // Memoized handler for profile photo selection
//   const handlePhotoSelect = useCallback((e) => {
//     const file = e.target.files[0];
//     if (file) {
//       updateFormData("agentProfilePhoto", {
//         file,
//         preview: URL.createObjectURL(file),
//       });
//     }
//   }, [updateFormData]);

//   // Memoized handler to launch the hidden file input
//   const handleBrowseClick = useCallback(() => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   }, []);

//   const profilePhoto = formData.agentProfilePhoto || null;

//   // Memoized handler to toggle availability selection
//   const handleAvailabilitySelect = useCallback(
//     (value) => {
//       if (formData.availability === value) {
//         updateFormData("availability", "");
//       } else {
//         updateFormData("availability", value);
//       }
//     },
//     [formData.availability, updateFormData]
//   );

//   // Memoized toggle for "Available All Day"
//   const toggleAllDay = useCallback(() => {
//     const newValue = !formData.availableAllDay;
//     updateFormData("availableAllDay", newValue);

//     if (newValue) {
//       // When enabling "Available All Day", set times to "00:00"
//       updateFormData("startTime", "00:00");
//       updateFormData("endTime", "00:00");
//     } else {
//       // Otherwise, clear the times
//       updateFormData("startTime", "");
//       updateFormData("endTime", "");
//     }
//   }, [formData.availableAllDay, updateFormData]);

//   return (
//     <form className="w-4/5 mx-auto" onSubmit={(e) => e.preventDefault()}>
//       <h2 className="text-3xl font-bold mb-4">Contact Information</h2>

//       {/* Agent Name */}
//       <div className="mb-6">
//         <label className="block font-semibold mb-2">
//           Agent Name<span className="text-red-500 ml-1">*</span>
//         </label>
//         <input
//           type="text"
//           placeholder="Enter agent name"
//           value={formData.agentName || ""}
//           onChange={(e) => updateFormData("agentName", e.target.value)}
//           className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
//           required
//         />
//       </div>

//       {/* Team Name */}
//       <div className="mb-6">
//         <label className="block font-semibold mb-2">
//           Team Name<span className="text-red-500 ml-1">*</span>
//         </label>
//         <input
//           type="text"
//           placeholder="Enter team name"
//           value={formData.teamName || ""}
//           onChange={(e) => updateFormData("teamName", e.target.value)}
//           className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
//           required
//         />
//       </div>

//       {/* Phone Numbers */}
//       <div className="mb-6 grid grid-cols-2 gap-4">
//         <div>
//           <label className="block font-semibold mb-2">
//             Phone Number 1<span className="text-red-500 ml-1">*</span>
//           </label>
//           <input
//             type="tel"
//             placeholder="Enter primary phone number"
//             value={formData.phoneNumber1 || ""}
//             onChange={(e) => updateFormData("phoneNumber1", e.target.value)}
//             className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <label className="block font-semibold mb-2">Phone Number 2</label>
//           <input
//             type="tel"
//             placeholder="Enter secondary phone number"
//             value={formData.phoneNumber2 || ""}
//             onChange={(e) => updateFormData("phoneNumber2", e.target.value)}
//             className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
//           />
//         </div>
//       </div>

//       {/* Email Address */}
//       <div className="mb-6">
//         <label className="block font-semibold mb-2">
//           Email Address<span className="text-red-500 ml-1">*</span>
//         </label>
//         <input
//           type="email"
//           placeholder="Enter email address"
//           value={formData.emailAddress || ""}
//           onChange={(e) => updateFormData("emailAddress", e.target.value)}
//           className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
//           required
//         />
//       </div>

//       {/* Agent Profile Photo */}
//       <div className="mb-6">
//         <label className="block font-semibold mb-2">
//           Agent Profile Photo<span className="text-red-500 ml-1">*</span>
//         </label>
//         <div className="flex items-center gap-4">
//           {profilePhoto ? (
//             <img
//               src={profilePhoto.preview}
//               alt="Agent Profile"
//               className="w-20 h-20 rounded-full object-cover border"
//             />
//           ) : (
//             <div className="w-20 h-20 rounded-full border flex items-center justify-center text-gray-400">
//               No photo
//             </div>
//           )}
//           <button
//             type="button"
//             onClick={handleBrowseClick}
//             className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
//           >
//             {profilePhoto ? "Change Photo" : "Upload Photo"}
//           </button>
//           <input
//             type="file"
//             accept="image/*"
//             ref={fileInputRef}
//             onChange={handlePhotoSelect}
//             className="hidden"
//           />
//         </div>
//       </div>

//       {/* Availability */}
//       <div className="mb-6">
//         <label className="block font-semibold mb-2">Availability</label>
//         <div className="flex gap-2">
//           {[
//             { label: "Everyday", sub: "Mon-Sun" },
//             { label: "Weekday", sub: "Mon-Fri" },
//             { label: "Weekend", sub: "Sat,Sun" },
//           ].map((option) => {
//             const isSelected = formData.availability === option.label;
//             return (
//               <button
//                 key={option.label}
//                 type="button"
//                 onClick={() => handleAvailabilitySelect(option.label)}
//                 className={`px-4 py-2 rounded transition flex flex-col items-center ${
//                   isSelected
//                     ? "bg-black text-white border border-black"
//                     : "bg-white text-gray-700 border border-gray-300"
//                 } hover:bg-black hover:text-white focus:outline-none`}
//               >
//                 <span className="font-medium">{option.label}</span>
//                 <span className="text-xs">{option.sub}</span>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Select Time Schedule */}
//       <div className="mb-6">
//         <label className="block font-semibold mb-2">Select Time Schedule</label>
//         <div className="flex items-center gap-4 mb-2">
//           {/* Start Time */}
//           <div>
//             <input
//               type="time"
//               value={formData.startTime || ""}
//               onChange={(e) => updateFormData("startTime", e.target.value)}
//               disabled={formData.availableAllDay}
//               className="p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-36"
//             />
//           </div>
//           {/* End Time */}
//           <div>
//             <input
//               type="time"
//               value={formData.endTime || ""}
//               onChange={(e) => updateFormData("endTime", e.target.value)}
//               disabled={formData.availableAllDay}
//               className="p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-36"
//             />
//           </div>
//         </div>
//         {/* Available All Day Checkbox */}
//         <label className="inline-flex items-center cursor-pointer">
//           <input
//             type="checkbox"
//             className="form-checkbox h-5 w-5 text-blue-600"
//             checked={formData.availableAllDay || false}
//             onChange={toggleAllDay}
//           />
//           <span className="ml-2 text-gray-700">Available All Day</span>
//         </label>
//       </div>

//       {/* Extra space at the bottom */}
//       <div className="mb-48"></div>
//     </form>
//   );
// };

// ContactInformation.propTypes = {
//   formData: PropTypes.shape({
//     agentName: PropTypes.string,
//     teamName: PropTypes.string,
//     phoneNumber1: PropTypes.string,
//     phoneNumber2: PropTypes.string,
//     emailAddress: PropTypes.string,
//     agentProfilePhoto: PropTypes.object,
//     availability: PropTypes.string,
//     startTime: PropTypes.string,
//     endTime: PropTypes.string,
//     availableAllDay: PropTypes.bool,
//   }).isRequired,
//   updateFormData: PropTypes.func.isRequired,
// };

// export default React.memo(ContactInformation);

/// file upload code:

// import { useRef } from "react";

// const ContactInformation = ({ formData, updateFormData }) => {
//   const fileInputRef = useRef(null);

//   const handlePhotoSelect = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);
//     const preset = "preset";
//     formData.append("upload_preset", preset);

//     try {
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/de3did404/image/upload`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );
//       const data = await response.json();
//       updateFormData((prevData) => ({
//         ...prevData,
//         agentProfilePhoto: data.secure_url,
//       }));
//     } catch (error) {
//       console.error("Error uploading image to Cloudinary", error);
//     }
//   };

//   const handleBrowseClick = () => {
//     fileInputRef.current.click();
//   };

//   return (
//     <form
//       onSubmit={(e) => e.preventDefault()}
//       className="p-4 border rounded-lg"
//     >
//       <label className="block text-gray-700 font-semibold mb-2">
//         Agent Name
//       </label>
//       <input
//         type="text"
//         className="w-full p-2 border rounded"
//         required
//         value={formData.agentName}
//         onChange={(e) =>
//           updateFormData({ ...formData, agentName: e.target.value })
//         }
//       />

//       <div className="mt-4">
//         <label className="block text-gray-700 font-semibold">
//           Profile Photo
//         </label>
//         {formData.agentProfilePhoto ? (
//           <img
//             src={formData.agentProfilePhoto}
//             alt="Agent Profile"
//             className="w-32 h-32 object-cover rounded-full mt-2"
//           />
//         ) : (
//           <div className="w-32 h-32 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full mt-2">
//             No photo
//           </div>
//         )}
//         <button
//           type="button"
//           onClick={handleBrowseClick}
//           className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           {formData.agentProfilePhoto ? "Change Photo" : "Upload Photo"}
//         </button>
//         <input
//           type="file"
//           ref={fileInputRef}
//           className="hidden"
//           accept="image/*"
//           onChange={handlePhotoSelect}
//         />
//       </div>
//     </form>
//   );
// };

// export default ContactInformation;
