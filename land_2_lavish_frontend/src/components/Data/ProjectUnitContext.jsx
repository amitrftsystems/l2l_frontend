import React, { createContext, useState, useContext } from "react";

const ProjectUnitContext = createContext();

export const ProjectUnitProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");

  return (
    <ProjectUnitContext.Provider
      value={{
        selectedProject,
        setSelectedProject,
        selectedUnit,
        setSelectedUnit,
      }}
    >
      {children}
    </ProjectUnitContext.Provider>
  );
};

export const useProjectUnit = () => {
  const context = useContext(ProjectUnitContext);
  if (!context) {
    throw new Error("useProjectUnit must be used within a ProjectUnitProvider");
  }
  return context;
};
