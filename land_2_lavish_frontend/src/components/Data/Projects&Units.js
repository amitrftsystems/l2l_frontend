// Data/Projects&Units.js
export const projectData = { // Changed to exported const
  "HL-ABC": ["HL-ABC-1", "HL-ABC-2", "HL-ABC-3"],
  "HL-XYZ": ["HL-XYZ-1", "HL-XYZ-2", "HL-XYZ-3"],
  "HL-PQR": ["HL-PQR-1", "HL-PQR-2", "HL-PQR-3"],
};

export async function initializeProjects() { // Now properly exported
  try {
    const response = await fetch('http://localhost:5000/api/master/get-projects');
    const apiData = await response.json();
    console.log(apiData);

    if (apiData.success) {
      apiData.data.forEach(apiProject => {
        if (!projectData[apiProject.project_name]) {
          projectData[apiProject.project_name] = [];
        }
      });
    }
    return projectData;
  } catch (error) {
    console.error('Error initializing projects:', error);
    return projectData;
  }
}



