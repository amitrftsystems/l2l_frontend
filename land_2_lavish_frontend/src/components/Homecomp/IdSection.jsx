import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { projectData as staticProjects } from "../Data/Projects&Units";
import { useProjectUnit } from "../Data/ProjectUnitContext";

export default function ProjectUnitSelector() {
  const navigate = useNavigate();
  const [mergedProjects, setMergedProjects] = useState(staticProjects);
  const { selectedProject, setSelectedProject, selectedUnit, setSelectedUnit } = useProjectUnit();

  useEffect(() => {
    // Fetch projects from API and merge with static data
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/master/get-projects');
        const data = await response.json();
        
        if (data.success) {
          const newProjects = { ...staticProjects };
          
          data.data.forEach(apiProject => {
            if (!newProjects[apiProject.project_name]) {
              newProjects[apiProject.project_name] = [];
            }
          });
          
          setMergedProjects(newProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleGoClick = () => {
    if (!selectedUnit) {
      alert("Please select a unit!");
      return;
    }
    navigate("/customer-info");
  };

  return (
    <div className="flex items-center space-x-4 mt-5 ml-80 z-0 relative">
      <h1 className="text-lg font-semibold">Select Project:</h1>
      <Select
        onValueChange={(value) => {
          setSelectedProject(value);
          setSelectedUnit("");
        }}
      >
        <SelectTrigger className="w-40 border p-2 rounded">
          <SelectValue placeholder="Select Project" />
        </SelectTrigger>
        <SelectContent className="absolute z-50 bg-white shadow-md border rounded-md">
          {Object.keys(mergedProjects).map((project) => (
            <SelectItem key={project} value={project}>
              {project}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <h1 className="text-lg font-semibold">Select Unit:</h1>
      <Select onValueChange={setSelectedUnit} disabled={!selectedProject}>
        <SelectTrigger className="w-40 border p-2 rounded">
          <SelectValue placeholder="Select Unit" />
        </SelectTrigger>
        <SelectContent className="absolute z-50 bg-white shadow-md border rounded-md">
          {selectedProject &&
            mergedProjects[selectedProject].map((unit) => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <button
        style={{
          backgroundColor: "green",
          color: "white",
          padding: "7px 15px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          transition: "transform 0.2s ease-in-out",
        }}
        onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
        onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        onClick={handleGoClick}
      >
        Go
      </button>
    </div>
  );
}