import prisma from "../../db/index.js";

// Check if project exists
export const checkProject = async (req, res) => {
  try {
    const { project_id } = req.query;
    const project = await prisma.project.findUnique({
      where: { project_id: parseInt(project_id) },
      select: { project_id: true },
    });

    res.json({ exists: !!project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check if property exists or create it
export const checkOrCreateProperty = async (req, res) => {
  try {
    const { property_id, property_type, size } = req.body;

    let property = await prisma.property.findUnique({
      where: { property_id: parseInt(property_id) },
    });

    if (!property) {
      property = await prisma.property.create({
        data: {
          property_id: parseInt(property_id),
          property_type,
          size: parseInt(size),
        },
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add stock entry
export const addStock = async (req, res) => {
  try {
    const {
      projectId,
      propertyId,
      propertyDescription,
      size,
      bsp,
      collaborator,
      remarks,
      onHold,
      tillDate
    } = req.body;

    // Check for existing stock
    const existingStock = await prisma.stock.findFirst({
      where: {
        project_id: parseInt(projectId),
        property_id: parseInt(propertyId),
      },
    });

    if (existingStock) {
      return res.status(400).json({
        success: false,
        message: "This property already exists in stock for this project"
      });
    }

    const newStock = await prisma.stock.create({
      data: {
        project_id: parseInt(projectId),
        property_id: parseInt(propertyId),
        property_type: propertyDescription,
        size: parseInt(size),
        bsp: bsp ? parseFloat(bsp) : null,
        broker_id: collaborator ? parseInt(collaborator) : null,
        remarks: remarks || null,
        on_hold_status: onHold || 'Free',
        hold_till_date: onHold === 'Hold' ? new Date(tillDate) : null
      },
    });

    res.status(201).json({ success: true, data: newStock });

  } catch (error) {
    console.error("Prisma error:", error);

    if (error.code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: "Invalid reference (project, property, or broker not found)"
      });
    }

    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: "Stock entry already exists for this property"
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to add stock",
      error: error.message
    });
  }
};

// Check if property exists in stock
export const checkStockProperty = async (req, res) => {
  try {
    const { project_id, property_id } = req.query;

    if (!project_id || !property_id) {
      return res.status(400).json({
        success: false,
        message: "Project ID and Property ID are required"
      });
    }

    const stock = await prisma.stock.findFirst({
      where: {
        project_id: parseInt(project_id),
        property_id: parseInt(property_id)
      }
    });

    return res.status(200).json({
      success: true,
      exists: !!stock,
      data: stock
    });

  } catch (error) {
    console.error("Error checking stock property:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


