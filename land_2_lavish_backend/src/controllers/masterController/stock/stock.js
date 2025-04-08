import prisma from "../db/index.js";

export const addStock = async (req, res) => {
  try {
    const {
      project_id,
      property_id,
      property_type,
      size,
      bsp,
      broker_id,
      remarks,
      on_hold_status,
      hold_till_date,
      hold_remarks
    } = req.body;

    if (!project_id || !property_id || !property_type || !size) {
      return res.status(400).json({
        success: false,
        message: "Project ID, Property ID, Property Type, and Size are required.",
      });
    }

    // Ensure property exists
    const property = await prisma.property.findUnique({ where: { property_id } });
    if (!property) {
      return res.status(400).json({
        success: false,
        message: `Property ID ${property_id} does not exist.`,
      });
    }

    const newStock = await prisma.stock.create({
      data: {
        project_id,
        property_id,
        property_type,
        size,
        bsp,
        broker_id,
        remarks,
        on_hold_status,
        hold_till_date: hold_till_date ? new Date(hold_till_date) : null,
        hold_remarks,
      },
    });

    res.status(201).json({ success: true, data: newStock });
  } catch (error) {
    console.error("Error adding stock:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateStock = async (req, res) => {
    try {
      const {
        stock_id,
        project_id,
        property_id,
        property_type,
        size,
        bsp,
        broker_id,
        remarks,
        on_hold_status,
        hold_till_date,
        hold_remarks
      } = req.body;
  
      if (!stock_id) {
        return res.status(400).json({ success: false, message: "Stock ID is required." });
      }
  
      const updatedStock = await prisma.stock.update({
        where: { stock_id },
        data: {
          project_id,
          property_id,
          property_type,
          size,
          bsp,
          broker_id,
          remarks,
          on_hold_status,
          hold_till_date: hold_till_date ? new Date(hold_till_date) : null,
          hold_remarks,
        },
      });
  
      res.status(200).json({ success: true, data: updatedStock });
    } catch (error) {
      console.error("Error updating stock:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

export const getAllStock = async (req, res) => {
    try {
      const stocks = await prisma.stock.findMany({
        orderBy: { updated_at: 'desc' },
        include: {
          project: { select: { project_name: true } },
          property: { select: { property_name: true } },
          broker: { select: { broker_name: true } },
        },
      });
  
      res.status(200).json({ success: true, data: stocks });
    } catch (error) {
      console.error("Error fetching stock:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

  export const getStockById = async (req, res) => {
    try {
      const { stock_id } = req.params;
  
      if (!stock_id) {
        return res.status(400).json({ success: false, message: "Stock ID is required." });
      }
  
      const stock = await prisma.stock.findUnique({
        where: { stock_id: Number(stock_id) },
        include: {
          project: { select: { project_name: true } },
          property: { select: { property_name: true } },
          broker: { select: { broker_name: true } },
        },
      });
  
      if (!stock) {
        return res.status(404).json({ success: false, message: "Stock not found." });
      }
  
      res.status(200).json({ success: true, data: stock });
    } catch (error) {
      console.error("Error fetching stock by ID:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  