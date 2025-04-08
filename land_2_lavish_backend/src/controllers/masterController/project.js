import prisma from "../../db/index.js";

export const addProject = async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const {
      project_name,
      company_name,
      address,
      landmark = null,
      plan,
      size = null,
      sign_image_name = null
    } = req.body;

    // 🔍 Validate required fields
    const requiredFields = { project_name, company_name, address, plan };
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // 🧼 Normalize size into array
    const sizeArray = Array.isArray(size) ? size : (size !== null ? [size] : []);

    // Convert plan to string for database query
    const planString = plan.toString();

    // 🔍 Check if the plan exists
    const planExists = await prisma.installmentPlan.findUnique({
      where: {
        installment_no: planString
      }
    });

    if (!planExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid installment plan selected"
      });
    }

    // 🔍 Check for duplicate project
    const existingProject = await prisma.project.findFirst({
      where: {
        project_name
      }
    });

    if (existingProject) {
      return res.status(400).json({
        success: false,
        message: "Project name already exists"
      });
    }

    //  Create the project
    const newProject = await prisma.project.create({
      data: {
        project_name,
        company_name,
        address,
        landmark,
        plan: planString,
        size: size ? parseInt(size) : null,
        sign_image_name
      }
    });

    return res.status(201).json({
      success: true,
      data: newProject,
      message: "Project created successfully"
    });

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};



export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Valid project ID is required"
      });
    }

    const project = await prisma.project.findUnique({
      where: {
        project_id: parseInt(id)
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // Optional: format the size array into a comma-separated string
    const formattedProject = {
      ...project,
      size: project.size?.join(', ') || null
    };

    return res.status(200).json({
      success: true,
      data: formattedProject,
      message: "Project retrieved successfully"
    });

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};




export const getProjects = async (req, res) => {
  try {
    const { project_id, project_name } = req.query;

    // Build dynamic Prisma "where" object
    let whereClause = {};
    if (project_id) {
      whereClause.project_id = parseInt(project_id);
    }
    if (project_name) {
      whereClause.project_name = {
        contains: project_name,
        mode: 'insensitive' // equivalent to ILIKE
      };
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      orderBy: {
        project_id: 'desc'
      }
    });

    // Format size array if needed
    const formattedData = projects.map((project) => ({
      ...project,
      size: project.size ? project.size.toString() : null
    }));

    return res.status(200).json({
      success: true,
      data: formattedData,
      message: "Projects retrieved successfully"
    });

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};



//  Update Project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Valid project ID is required"
      });
    }

    const {
      project_name,
      company_name,
      address,
      landmark = null,
      plan,
      size = null,
      sign_image_name = null
    } = req.body;

    const existingProject = await prisma.project.findUnique({
      where: {
        project_id: parseInt(id)
      }
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // Check for duplicate project name (only if name is being changed)
    if (project_name && project_name !== existingProject.project_name) {
      const nameExists = await prisma.project.findUnique({
        where: { project_name }
      });

      if (nameExists) {
        return res.status(400).json({
          success: false,
          message: "Project name already exists"
        });
      }
    }

    // Validate plan if updating
    if (plan) {
      const planExists = await prisma.installmentPlan.findUnique({
        where: { installment_no: plan }
      });

      if (!planExists) {
        return res.status(400).json({
          success: false,
          message: "Invalid installment plan selected"
        });
      }
    }

    const sizeArray = Array.isArray(size) ? size : (size !== null ? [size] : []);

    const updatedProject = await prisma.project.update({
      where: {
        project_id: parseInt(id)
      },
      data: {
        project_name,
        company_name,
        address,
        landmark,
        plan,
        size: sizeArray,
        sign_image_name
      }
    });

    return res.status(200).json({
      success: true,
      data: updatedProject,
      message: "Project updated successfully"
    });

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

//  Delete Project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Valid project ID is required"
      });
    }

    const existingProject = await prisma.project.findUnique({
      where: {
        project_id: parseInt(id)
      }
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    await prisma.project.delete({
      where: {
        project_id: parseInt(id)
      }
    });

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
