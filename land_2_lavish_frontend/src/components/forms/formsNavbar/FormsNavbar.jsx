import React from "react";
import {
  ArrowLeft,
  LogOut,
  Home,
  FileText,
  Edit,
  Coins,
  Search,
  Mail,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const FormsNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Get the current pathname (e.g., "/masters/add-new-plc" or "/masters/add-new-plc/123")
    const currentPath = location.pathname;

    // Define the categories that should navigate to "/" when on a base form route
    const categories = ["masters", "transactions", "utilities", "reports"];

    // Split the path into segments (e.g., ["", "masters", "add-new-plc"] or ["", "masters", "add-new-plc", "123"])
    const pathSegments = currentPath.split("/").filter((segment) => segment);

    // Check if the first segment is one of the categories
    const isCategoryRoute = categories.includes(pathSegments[0]);

    if (isCategoryRoute) {
      // If the path has exactly 2 segments (e.g., "/masters/add-new-plc"), it's a base form route
      if (pathSegments.length === 2) {
        navigate("/"); // Navigate to homepage
      }
      // If the path has more than 2 segments (e.g., "/masters/add-new-plc/123"), it's an extended form route
      else if (pathSegments.length > 2) {
        // Navigate to the parent form route (e.g., "/masters/add-new-plc")
        const parentPath = `/${pathSegments[0]}/${pathSegments[1]}`;
        navigate(parentPath);
      }
    } else {
      // Fallback for other routes: Navigate to the parent path
      const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/"));
      navigate(parentPath || "/"); // Navigate to parent path, or "/" if no parent
    }
  };

  return (
    <nav className="bg-[#272727] p-2 flex items-center justify-between">
      {/* Left side: Icons */}
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-500 rounded" onClick={handleBack}>
          <ArrowLeft className="w-6 h-6 text-white" />{" "}
          {/* Back button with dynamic functionality */}
        </button>
        <button className="p-2 hover:bg-gray-500 rounded">
          <Edit className="w-6 h-6 text-white" />
        </button>
        <button className="p-2 hover:bg-gray-500 rounded">
          <Coins className="w-6 h-6 text-white" />
        </button>
        <button className="p-2 hover:bg-gray-500 rounded">
          <FileText className="w-6 h-6 text-white" />
        </button>
        <button className="p-2 hover:bg-gray-500 rounded">
          <Home className="w-6 h-6 text-white" /> {/* Repeated icon */}
        </button>
        <button className="p-2 hover:bg-gray-500 rounded">
          <Search className="w-6 h-6 text-white" />
        </button>
        <button className="p-2 hover:bg-gray-500 rounded">
          <Mail className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Right side: Logout button */}
      <button className="p-2 text-white hover:bg-gray-500 rounded flex items-center">
        <LogOut className="w-6 h-6 mr-2" />
        <span>Logout</span>
      </button>
    </nav>
  );
};

export default FormsNavbar;
