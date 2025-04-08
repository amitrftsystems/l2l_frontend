import prisma from "../../db/index.js";

export const addBroker = async (req, res) => {
  try {
    const {
      project_id,
      name,
      address,
      mobile,
      email,
      phone,
      fax,
      income_tax_ward_no,
      dist_no,
      pan_no,
      net_commission_rate,
      code
    } = req.body;

    // Validate required fields
    if (!project_id || !name || !code) {
      return res.status(400).json({
        success: false,
        message: "Project ID, name, and code are required"
      });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { project_id: parseInt(project_id) }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // Check if broker code already exists
    const existingBroker = await prisma.broker.findFirst({
      where: {
        code: parseInt(code)
      }
    });

    if (existingBroker) {
      return res.status(400).json({
        success: false,
        message: "Broker code already exists"
      });
    }

    // Create the broker
    const newBroker = await prisma.broker.create({ 
      data: {
        project_id: parseInt(project_id),
        name,
        address,
        mobile,
        email,
        phone,
        fax,
        income_tax_ward_no,
        dist_no,
        pan_no,
        net_commission_rate: parseFloat(net_commission_rate) || 0,
        code: parseInt(code)
      }
    });

    return res.status(201).json({
      success: true,
      data: newBroker,
      message: "Broker added successfully"
    });

  } catch (error) {
    console.error("Error adding broker:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const editBroker = async (req, res) => {
  try {
    if (typeof req.body !== "object") {
      return res.status(400).json({ success: false, message: "Invalid JSON format." });
    }

    const { 
      broker_id, project_id, name, code,address, mobile, email, phone, 
      fax, income_tax_ward_no, dist_no, pan_no, net_commission_rate 
    } = req.body;

    // Required field check
    if (!broker_id) {
      return res.status(400).json({ success: false, message: "broker_id is required for updating." });
    }

    // Validations
    if (pan_no && pan_no.length !== 10) {
      return res.status(400).json({ success: false, message: "PAN number must be exactly 10 characters." });
    }

    if (mobile && !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ success: false, message: "Invalid mobile number. It must be 10 digits." });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format." });
    }

    if (net_commission_rate !== undefined && net_commission_rate < 0) {
      return res.status(400).json({ success: false, message: "Net commission rate cannot be negative." });
    }

    // Create update object dynamically
    const updateData = {};

    if (project_id !== undefined) updateData.project_id = project_id;
    if (name !== undefined) updateData.name = name;                                   
    if (code !== undefined) updateData.code = code;
    if (address !== undefined) updateData.address = address;
    if (mobile !== undefined) updateData.mobile = mobile;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (fax !== undefined) updateData.fax = fax;
    if (income_tax_ward_no !== undefined) updateData.income_tax_ward_no = income_tax_ward_no;
    if (dist_no !== undefined) updateData.dist_no = dist_no;
    if (pan_no !== undefined) updateData.pan_no = pan_no;
    if (net_commission_rate !== undefined) updateData.net_commission_rate = net_commission_rate;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No fields provided for update." });
    }

    // Update via Prisma
    const updatedBroker = await prisma.broker.update({
      where: { broker_id: parseInt(broker_id) },
      data: updateData,
    });

    res.status(200).json({ success: true, data: updatedBroker });

  } catch (error) {
    console.error("Error updating broker:", error);

    // If broker not found
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: "Broker not found." });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBroker = async (req, res) => {
  try {
    const { broker_id, project_id, name } = req.query;

    // Build dynamic Prisma `where` clause
    const filters = {};

    if (broker_id) filters.broker_id = parseInt(broker_id);
    if (project_id) filters.project_id = parseInt(project_id);
    if (name) filters.name = { contains: name, mode: 'insensitive' }; // ILIKE equivalent

    const brokers = await prisma.broker.findMany({
      where: filters,
      orderBy: {
        broker_id: 'desc'
      },
      select: {
        broker_id: true,
        project_id: true,
        name: true,
        code: true,
        address: true,
        mobile: true,
        email: true,
        phone: true,
        fax: true,
        income_tax_ward_no: true,
        dist_no: true,
        pan_no: true,
        net_commission_rate: true,
      }
    });

    res.status(200).json({
      success: true,
      data: brokers,
      message: "Brokers retrieved successfully"
    });

  } catch (error) {
    console.error("Error fetching brokers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getBrokerById = async (req, res) => {
  try {
    const { broker_id } = req.params;
    const broker = await prisma.broker.findUnique({
      where: { broker_id: parseInt(broker_id) }
    });

    if (!broker) {
      return res.status(404).json({ success: false, message: "Broker not found." });
    }

    res.status(200).json({ success: true, data: broker });

  } catch (error) {
    console.error("Error fetching broker by ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error", 
      error: error.message
    });
  }
};    

export const deleteBroker = async (req, res) => {
  try {
    const { broker_id } = req.params;
    const deletedBroker = await prisma.broker.delete({
      where: { broker_id: parseInt(broker_id) }
    }); 
    if (!deletedBroker) {
      return res.status(404).json({ success: false, message: "Broker not found." });
    }
    res.status(200).json({ success: true, message: "Broker deleted successfully." });
  } catch (error) {
    console.error("Error deleting broker:", error); 
    res.status(500).json({ success: false, message: "Server error while deleting broker." });
  }
};



