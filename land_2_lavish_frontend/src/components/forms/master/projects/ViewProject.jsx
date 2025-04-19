import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ViewProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/master/projects/${id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setProject(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch project");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        setError("Failed to load project. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // Helper function to format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    // Handle MySQL/PostgreSQL timestamp format (2023-05-23T00:00:00.000Z or similar)
    if (typeof dateString === 'string' && dateString.includes('T')) {
      try {
        return new Date(dateString).toLocaleDateString();
      } catch (e) {
        console.error("Error parsing date with T:", e);
      }
    }
    
    // Handle pure date string (YYYY-MM-DD)
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      try {
        const [year, month, day] = dateString.split('-');
        return new Date(year, month - 1, day).toLocaleDateString();
      } catch (e) {
        console.error("Error parsing YYYY-MM-DD:", e);
      }
    }
    
    // Try other formats as fallback
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
    } catch (e) {
      console.error("Error with fallback date parsing:", e);
    }
    
    // If we have a string but couldn't parse it, just show it as is
    if (typeof dateString === 'string' && dateString.trim() !== '') {
      return dateString;
    }
    
    return "N/A";
  };

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Project Details</h1>
          <button
            onClick={() => navigate("/masters/projects")}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back to Projects
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          project && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
                      Project Information
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Project Name</p>
                        <p className="text-base font-medium text-gray-900">{project.project_name}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Company Name</p>
                        <p className="text-base font-medium text-gray-900">{project.company_name}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Created Date</p>
                        <p className="text-base font-medium text-gray-900">
                          {formatDate(project.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
                      Location Details
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Address</p>
                        <p className="text-base font-medium text-gray-900">{project.address}</p>
                      </div>
                      
                      {project.landmark && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Landmark</p>
                          <p className="text-base font-medium text-gray-900">{project.landmark}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
                    Payment Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Installment Plan</p>
                      <p className="text-base font-medium text-gray-900">{project.plan}</p>
                    </div>
                  </div>
                </div>
                
                {project.sign_img && (
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
                      Signature
                    </h2>
                    
                    <div className="flex justify-center">
                      <img 
                        src={`http://localhost:5000/uploads/sign_images/${project.sign_img}`} 
                        alt="Signature" 
                        className="max-h-40 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                )}
                
                <div className="mt-8 flex justify-center space-x-4">
                  <button
                    onClick={() => navigate(`/masters/edit-project/${project.project_id}`)}
                    className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    Edit Project
                  </button>
                  
                  <button
                    onClick={() => navigate("/masters/projects")}
                    className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Back to List
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ViewProject; 