import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const AddPropertySize = () => {
  const [formData, setFormData] = useState({
    project_id: "",
    property_size: "",
    measuring_unit: "", // ✅ Added
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    property_size: false,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const filteredProjects = projects.filter((project) =>
    project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "https://land-2-lavish-backend-chi.vercel.app/api/master/get-projects"
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.success) {
          setProjects(data.data);
        } else {
          setErrors({ fetch: data.message || "Failed to load projects" });
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setErrors({ fetch: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "property_size") {
      validateField(name, value);
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let error = "";
    if (name === "property_size") {
      if (!value) {
        error = "Property size is required";
      } else if (isNaN(Number(value))) {
        error = "Property size must be a number";
      } else if (Number(value) <= 0) {
        error = "Property size must be positive";
      }
    }
    setErrors({ ...errors, [name]: error });
  };

  const selectProject = (projectId) => {
    setFormData({ ...formData, project_id: projectId });
    setDropdownOpen(false);
    setSearchTerm("");
    setErrors({ ...errors, project_id: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    let newErrors = {};
    if (!formData.project_id) newErrors.project_id = "Project is required";
    if (!formData.property_size) {
      newErrors.property_size = "Property size is required";
    } else if (isNaN(Number(formData.property_size))) {
      newErrors.property_size = "Property size must be a number";
    } else if (Number(formData.property_size) <= 0) {
      newErrors.property_size = "Property size must be positive";
    }
    if (!formData.measuring_unit) {
      newErrors.measuring_unit = "Measuring unit is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        "https://land-2-lavish-backend-chi.vercel.app/api/master/add-new-property-size",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            project_id: Number(formData.project_id),
            property_size: Number(formData.property_size),
            measuring_unit: formData.measuring_unit, // ✅ Added
          }),
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(text || "Server returned non-JSON response");
      }

      const result = await response.json();

      if (!response.ok) {
        if (result.message && result.message.toLowerCase().includes("duplicate")) {
          throw new Error("property_size: " + result.message);
        }
        throw new Error(result.message || "Failed to add property size");
      }

      alert("Property size added successfully!");
      setFormData({
        project_id: "",
        property_size: "",
        measuring_unit: "", // ✅ Reset added field
      });
      window.history.back();
    } catch (error) {
      console.error("Submission error:", error);
      if (error.message.startsWith("property_size:")) {
        setErrors({
          ...errors,
          property_size: error.message.replace("property_size:", "").trim(),
        });
      } else {
        setErrors({ ...errors, submit: error.message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#272727]">
      <form
        onSubmit={handleSubmit}
        className="relative w-[600px] bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-2"
      >
        <h2 className="text-2xl font-bold text-center text-black mb-2">
          <span className="px-6 py-2 rounded-lg">Add New Property Size</span>
        </h2>
        <p className="text-center text-sm text-red-500">
          Fields marked by <span className="text-red-500">*</span> are mandatory
        </p>
        {errors.fetch && (
          <p className="text-red-500 text-center">{errors.fetch}</p>
        )}

        {/* Project Dropdown */}
        <label className="text-gray-600 font-medium">
          {errors.project_id && (
            <p className="text-red-500 text-sm">{errors.project_id}</p>
          )}
          Project <span className="text-red-600">*</span>
          {loading ? (
            <div className="w-full p-2 mt-1 border rounded-md bg-gray-100 animate-pulse">
              Loading projects...
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <div
                className={`w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 cursor-pointer ${
                  errors.project_id
                    ? "border-red-500 focus:ring-red-500"
                    : "border-black focus:ring-green-500"
                }`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                tabIndex="0"
              >
                {formData.project_id
                  ? projects.find((p) => p.project_id === formData.project_id)
                      ?.project_name
                  : "Select Project"}
              </div>

              {dropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  <input
                    type="text"
                    className="w-full p-2 border-b border-gray-300 focus:outline-none"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                  <div className="max-h-60 overflow-y-auto">
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map((project) => (
                        <div
                          key={project.project_id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => selectProject(project.project_id)}
                        >
                          {project.project_name}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500">No projects found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </label>

        {/* Property Size */}
        <label className="text-gray-600 font-medium">
          {(touched.property_size || errors.property_size) &&
            errors.property_size && (
              <p className="text-red-500 text-sm">{errors.property_size}</p>
            )}
          Property Size <span className="text-red-600">*</span>
          <input
            type="number"
            name="property_size"
            value={formData.property_size}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
              errors.property_size
                ? "border-red-500 focus:ring-red-500"
                : "border-black focus:ring-green-500"
            }`}
            placeholder="Enter property size"
            required
            disabled={submitting}
          />
        </label>

        {/* ✅ Measuring Unit Dropdown */}
        <label className="text-gray-600 font-medium">
          {errors.measuring_unit && (
            <p className="text-red-500 text-sm">{errors.measuring_unit}</p>
          )}
          Measuring Unit <span className="text-red-600">*</span>
          <select
            name="measuring_unit"
            value={formData.measuring_unit}
            onChange={handleChange}
            className={`w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
              errors.measuring_unit
                ? "border-red-500 focus:ring-red-500"
                : "border-black focus:ring-green-500"
            }`}
            required
            disabled={submitting}
          >
            <option value="">Select unit</option>
            <option value="sq. ft.">sq. ft.</option>
            <option value="sq. metre">sq. metre</option>
            <option value="acres">acres</option>
            <option value="hectare">hectare</option>
          </select>
        </label>

        {/* Submission Error */}
        {errors.submit && !errors.property_size && (
          <p className="text-red-500 text-center">
            {errors.submit.startsWith("<!DOCTYPE html>")
              ? "Server error occurred"
              : errors.submit}
          </p>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-1/3 p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:bg-blue-400"
            disabled={loading || submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPropertySize;





// import { useState, useEffect, useRef } from "react";

// const AddPropertySize = () => {
//   const [formData, setFormData] = useState({
//     project_id: "",
//     property_size: "",
//   });
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({
//     property_size: false,
//   });
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const dropdownRef = useRef(null);

//   // Filter projects based on search term
//   const filteredProjects = projects.filter((project) =>
//     project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/master/get-projects"
//         );
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         if (data.success) {
//           setProjects(data.data);
//         } else {
//           setErrors({ fetch: data.message || "Failed to load projects" });
//         }
//       } catch (error) {
//         console.error("Fetch error:", error);
//         setErrors({ fetch: error.message });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (name === "property_size") {
//       validateField(name, value);
//     } else {
//       setErrors({ ...errors, [name]: "" });
//     }
//   };

//   const handleBlur = (e) => {
//     const { name } = e.target;
//     setTouched({ ...touched, [name]: true });
//     validateField(name, formData[name]);
//   };

//   const validateField = (name, value) => {
//     let error = "";
//     if (name === "property_size") {
//       if (!value) {
//         error = "Property size is required";
//       } else if (isNaN(Number(value))) {
//         error = "Property size must be a number";
//       } else if (Number(value) <= 0) {
//         error = "Property size must be positive";
//       }
//     }
//     setErrors({ ...errors, [name]: error });
//   };

//   const selectProject = (projectId) => {
//     setFormData({ ...formData, project_id: projectId });
//     setDropdownOpen(false);
//     setSearchTerm("");
//     // Clear the project_id error when a project is selected
//     setErrors({ ...errors, project_id: "" });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     // Clear all errors before validation
//     setErrors({});

//     let newErrors = {};
//     if (!formData.project_id) newErrors.project_id = "Project is required";
//     if (!formData.property_size) {
//       newErrors.property_size = "Property size is required";
//     } else if (isNaN(Number(formData.property_size))) {
//       newErrors.property_size = "Property size must be a number";
//     } else if (Number(formData.property_size) <= 0) {
//       newErrors.property_size = "Property size must be positive";
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       setSubmitting(false);
//       return;
//     }

//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/master/add-new-property-size",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//           body: JSON.stringify({
//             project_id: Number(formData.project_id),
//             property_size: Number(formData.property_size),
//           }),
//         }
//       );

//       const contentType = response.headers.get("content-type");
//       if (!contentType || !contentType.includes("application/json")) {
//         const text = await response.text();
//         throw new Error(text || "Server returned non-JSON response");
//       }

//       const result = await response.json();

//       if (!response.ok) {
//         if (
//           result.message &&
//           result.message.toLowerCase().includes("duplicate")
//         ) {
//           throw new Error("property_size: " + result.message);
//         }
//         throw new Error(result.message || "Failed to add property size");
//       }

//       alert("Property size added successfully!");
//       setFormData({
//         project_id: "",
//         property_size: "",
//       });
//       window.history.back();
//     } catch (error) {
//       console.error("Submission error:", error);
//       if (error.message.startsWith("property_size:")) {
//         setErrors({
//           ...errors,
//           property_size: error.message.replace("property_size:", "").trim(),
//         });
//       } else {
//         setErrors({ ...errors, submit: error.message });
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-[#272727]">
//       <form
//         onSubmit={handleSubmit}
//         className="relative w-[600px] bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-4" // Increased gap
//       >
//         <h2 className="text-2xl font-bold text-center text-black mb-2">
//           Add New Property Size
//         </h2>
//         <p className="text-center text-sm text-gray-600 mb-4">
//           Fields marked by <span className="text-red-500">*</span> are mandatory
//         </p>

//         {errors.fetch && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {errors.fetch}
//           </div>
//         )}

//         {/* Project Dropdown */}
//         <div className="space-y-1">
//           <label className="block text-gray-700 font-medium">
//             Project <span className="text-red-500">*</span>
//           </label>
//           {loading ? (
//             <div className="w-full p-2 mt-1 border rounded-md bg-gray-100 animate-pulse">
//               Loading projects...
//             </div>
//           ) : (
//             <div className="relative" ref={dropdownRef}>
//               <div
//                 className={`w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 cursor-pointer ${
//                   errors.project_id
//                     ? "border-red-500 focus:ring-red-500"
//                     : "border-gray-300 focus:ring-green-500"
//                 }`}
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//               >
//                 {formData.project_id
//                   ? projects.find((p) => p.project_id === formData.project_id)
//                       ?.project_name
//                   : "Select Project"}
//               </div>
//               {errors.project_id && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.project_id}
//                 </p>
//               )}
              
//               {dropdownOpen && (
//                 <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
//                   <input
//                     type="text"
//                     className="w-full p-2 border-b border-gray-300 focus:outline-none"
//                     placeholder="Search projects..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     autoFocus
//                   />
//                   <div className="max-h-60 overflow-y-auto">
//                     {filteredProjects.length > 0 ? (
//                       filteredProjects.map((project) => (
//                         <div
//                           key={project.project_id}
//                           className="p-2 hover:bg-gray-100 cursor-pointer"
//                           onClick={() => selectProject(project.project_id)}
//                         >
//                           {project.project_name}
//                         </div>
//                       ))
//                     ) : (
//                       <div className="p-2 text-gray-500">No projects found</div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Property Size Input */}
//         <div className="space-y-1">
//           <label className="block text-gray-700 font-medium">
//             Property Size (sq.ft) <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="number"
//             name="property_size"
//             value={formData.property_size}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className={`w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
//               errors.property_size
//                 ? "border-red-500 focus:ring-red-500"
//                 : "border-gray-300 focus:ring-green-500"
//             }`}
//             placeholder="Enter property size"
//             disabled={submitting}
//           />
//           {errors.property_size && (
//             <p className="text-red-500 text-xs mt-1">
//               {errors.property_size}
//             </p>
//           )}
//         </div>

//         {errors.submit && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//             {errors.submit.startsWith("<!DOCTYPE html>")
//               ? "Server error occurred"
//               : errors.submit}
//           </div>
//         )}

//         <div className="flex justify-center mt-4">
//           <button
//             type="submit"
//             className={`w-1/3 p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition ${
//               submitting ? "opacity-70 cursor-not-allowed" : ""
//             }`}
//             disabled={submitting}
//           >
//             {submitting ? (
//               <span className="flex items-center justify-center">
//                 <svg
//                   className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Submitting...
//               </span>
//             ) : (
//               "Submit"
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddPropertySize;
