const db = require("../../config/db");

// Create a new allotment
const createAllotment = async (req, res) => {
  try {
    const { customer_id, allot_date, property_id, remark } = req.body;

    // Validate required fields
    if (!customer_id || !allot_date || !property_id) {
      return res.status(400).json({
        success: false,
        message: "Customer ID, Allotment Date, and Property ID are required"
      });
    }

    // Start transaction
    await db.query('BEGIN');

    try {
      // 1. Check property status first
      const propertyCheck = await db.query(
        `SELECT status FROM property WHERE property_id = $1 FOR UPDATE`,
        [property_id]
      );

      if (propertyCheck.rowCount === 0) {
        await db.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          message: "Property not found"
        });
      }

      if (propertyCheck.rows[0].status.toLowerCase() === 'allotted') {
        await db.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: "Property is already allotted"
        });
      }

      // 2. Create allotment
      const allotmentResult = await db.query(
        `INSERT INTO allotment (
          allot_date, customer_id, property_id, remark
        ) VALUES ($1, $2, $3, $4) RETURNING *`,
        [allot_date, customer_id, property_id, remark || null]
      );

      // 3. Update property status
      await db.query(
        `UPDATE property SET 
          status = 'allotted',
          updated_at = NOW()
        WHERE property_id = $1`,
        [property_id]
      );

      await db.query('COMMIT');

      return res.status(201).json({
        success: true,
        data: allotmentResult.rows[0],
        message: "Allotment created successfully"
      });

    } catch (error) {
      await db.query('ROLLBACK');
      console.error("Transaction error:", error);
      throw error;
    }

  } catch (error) {
    console.error("Create allotment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create allotment",
      error: error.message
    });
  }
};

// Get all allotments
const getAllotments = async (req, res) => {
  try {
    const { customer_id, property_id, date_from, date_to } = req.query;
    
    let query = `
      SELECT a.*, 
             c.name as customer_name,
             c.address as customer_address,
             p.p_type as property_type,
             p.p_desc as property_description,
             p.p_size as property_size
      FROM allotment a
      JOIN customer c ON a.customer_id = c.customer_id
      JOIN property p ON a.property_id = p.property_id
    `;
    const params = [];
    let whereClauses = [];

    if (customer_id) {
      params.push(customer_id);
      whereClauses.push(`a.customer_id = $${params.length}`);
    }

    if (property_id) {
      params.push(property_id);
      whereClauses.push(`a.property_id = $${params.length}`);
    }

    if (date_from) {
      params.push(date_from);
      whereClauses.push(`a.allot_date >= $${params.length}`);
    }

    if (date_to) {
      params.push(date_to);
      whereClauses.push(`a.allot_date <= $${params.length}`);
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    query += " ORDER BY a.allot_date DESC";

    const result = await db.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      message: "Allotments retrieved successfully"
    });

  } catch (error) {
    console.error("Get allotments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve allotments",
      error: error.message
    });
  }
};

// Get allotment by ID
const getAllotmentById = async (req, res) => {
  try {
    const { allotment_id } = req.params;

    const result = await db.query(
      `SELECT a.*, 
              c.name as customer_name, 
              c.address as customer_address,
              p.p_type as property_type,
              p.p_desc as property_description,
              p.p_size as property_size
       FROM allotment a
       JOIN customer c ON a.customer_id = c.customer_id
       JOIN property p ON a.property_id = p.property_id
       WHERE a.allotment_id = $1`,
      [allotment_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Allotment not found"
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "Allotment retrieved successfully"
    });

  } catch (error) {
    console.error("Get allotment by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve allotment",
      error: error.message
    });
  }
};

// Update allotment
const updateAllotment = async (req, res) => {
  try {
    const { allotment_id } = req.params;
    const {
      customer_id,
      allot_date,
      property_id,
      remark
    } = req.body;

    // Check if customer exists if being updated
    if (customer_id) {
      const customerCheck = await db.query(
        "SELECT 1 FROM customer WHERE customer_id = $1",
        [customer_id]
      );

      if (customerCheck.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Customer not found"
        });
      }
    }

    // Check if property exists if being updated
    if (property_id) {
      const propertyCheck = await db.query(
        "SELECT 1 FROM property WHERE property_id = $1",
        [property_id]
      );

      if (propertyCheck.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Property not found"
        });
      }
    }

    const result = await db.query(
      `UPDATE allotment SET
        customer_id = COALESCE($1, customer_id),
        allot_date = COALESCE($2, allot_date),
        property_id = COALESCE($3, property_id),
        remark = COALESCE($4, remark),
        updated_at = NOW()
      WHERE allotment_id = $5
      RETURNING *`,
      [
        customer_id || null,
        allot_date || null,
        property_id || null,
        remark || null,
        allotment_id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Allotment not found"
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "Allotment updated successfully"
    });

  } catch (error) {
    console.error("Update allotment error:", error);

    const errorResponse = {
      success: false,
      message: "Failed to update allotment",
      error: error.message
    };

    if (error.code === '23503') {
      if (error.constraint === 'fk_allotment_customer') {
        errorResponse.message = "Invalid customer reference";
      } else if (error.constraint === 'fk_allotment_property') {
        errorResponse.message = "Invalid property reference";
      }
      res.status(400).json(errorResponse);
    } else {
      res.status(500).json(errorResponse);
    }
  }
};

// Delete allotment
const deleteAllotment = async (req, res) => {
  try {
    const { allotment_id } = req.params;

    // Start transaction
    await db.query('BEGIN');

    try {
      // First get the property_id from the allotment
      const allotmentResult = await db.query(
        `SELECT property_id FROM allotment WHERE allotment_id = $1`,
        [allotment_id]
      );

      if (allotmentResult.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Allotment not found"
        });
      }

      const property_id = allotmentResult.rows[0].property_id;

      // Delete the allotment
      const deleteResult = await db.query(
        `DELETE FROM allotment 
         WHERE allotment_id = $1
         RETURNING *`,
        [allotment_id]
      );

      // Update the property status back to 'free'
      await db.query(
        `UPDATE property SET 
          status = 'free',
          updated_at = NOW()
        WHERE property_id = $1`,
        [property_id]
      );

      // Commit transaction
      await db.query('COMMIT');

      res.json({
        success: true,
        data: deleteResult.rows[0],
        message: "Allotment deleted successfully and property status reset to free"
      });

    } catch (error) {
      // Rollback transaction on error
      await db.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error("Delete allotment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete allotment",
      error: error.message
    });
  }
};

// Check if property is already allotted
const checkPropertyAllotment = async (req, res) => {
  try {
    const { property_id } = req.params;
    
    // Check if property exists first
    const propertyCheck = await db.query(
      `SELECT property_id, status FROM property WHERE property_id = $1`,
      [property_id]
    );
    
    if (propertyCheck.rowCount === 0) {
      return res.status(404).json({ 
        exists: false,
        isAlloted: false,
        message: "Property not found"
      });
    }

    // Check if property is already allotted
    const isAlloted = propertyCheck.rows[0].status && 
                     propertyCheck.rows[0].status.toLowerCase() === 'alloted';

    // If allotted, get allotment details
    let allotmentDetails = null;
    if (isAlloted) {
      const allotmentResult = await db.query(
        `SELECT a.*, c.name as customer_name
         FROM allotment a
         JOIN customer c ON a.customer_id = c.customer_id
         WHERE a.property_id = $1`,
        [property_id]
      );
      if (allotmentResult.rowCount > 0) {
        allotmentDetails = allotmentResult.rows[0];
      }
    }

    res.json({ 
      exists: true,
      isAlloted: isAlloted,
      property: propertyCheck.rows[0],
      allotment: allotmentDetails,
      message: isAlloted ? "Property is already allotted" : "Property is available for allotment"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: "Error checking property allotment status"
    });
  }
};

module.exports = {
  createAllotment,
  getAllotments,
  getAllotmentById,
  updateAllotment,
  deleteAllotment,
  checkPropertyAllotment
};