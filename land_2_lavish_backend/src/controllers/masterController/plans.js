import prisma from "../../db/index.js";

export const addNewInstallmentPlan = async (req, res) => {
    try {
        console.log("Received request body:", req.body);

        if (typeof req.body !== 'object') {
            return res.status(400).json({ success: false, message: "Invalid JSON format." });
        }

        const { installment_no, due_days, due_date, percentage, lumpsum_amount, remarks } = req.body;

        // Convert installment_no to string if it's a number
        const processedInstallmentNo = installment_no ? installment_no.toString() : null;

        if (!processedInstallmentNo) {
            return res.status(400).json({ success: false, message: "Installment No is required." });
        }

        // Guard: Only one of due_days or due_date
        if (due_days !== null && due_date !== null) {
            return res.status(400).json({ success: false, message: "Provide either due_days or due_date, not both." });
        }

        // Guard: Only one of percentage or lumpsum_amount
        if (percentage !== null && lumpsum_amount !== null) {
            return res.status(400).json({ success: false, message: "Provide either percentage or lumpsum_amount, not both." });
        }

        // Check if installment_no exists
        const existing = await prisma.installmentPlan.findUnique({
            where: { installment_no: processedInstallmentNo }
        });

        if (existing) {
            return res.status(400).json({ success: false, message: "Installment No already exists. Please use a different one." });
        }

        // Convert percentage to float if provided
        const processedPercentage = percentage !== null ? parseFloat(percentage) : null;
        // Convert lumpsum_amount to float if provided
        const processedLumpsumAmount = lumpsum_amount !== null ? parseFloat(lumpsum_amount) : null;
        // Convert due_days to integer if provided
        const processedDueDays = due_days !== null ? parseInt(due_days) : null;

        const newInstallment = await prisma.installmentPlan.create({
            data: {
                installment_no: processedInstallmentNo,
                due_days: processedDueDays,
                due_date: due_date ? new Date(due_date) : null,
                percentage: processedPercentage,
                lumpsum_amount: processedLumpsumAmount,
                remarks: remarks ? remarks.trim() : null,
            }
        });

        res.status(201).json({ success: true, data: newInstallment });
    } catch (error) {
        console.error("Error submitting installment plan:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};



export const getInstallments = async (req, res) => {
    try {
        const installments = await prisma.installmentPlan.findMany({
            select: {
                installment_no: true
            }
        });

        return res.status(200).json({
            success: true,
            data: installments
        });
    } catch (error) {
        console.error("Prisma query error:", error);
        return res.status(500).json({ success: false, message: "Database query failed" });
    }
};

export const getInstallmentById = async (req, res) => {
    try {
        const { installment_no } = req.params;
        if (!installment_no) {
            return res.status(400).json({ success: false, message: "Installment No is required." });
        }

        const installment = await prisma.installmentPlan.findUnique({
            where: { installment_no }
        });

        if (!installment) {
            return res.status(404).json({ success: false, message: "Installment not found." });
        }
        res.status(200).json({ success: true, data: installment });
    }
    catch (error) {
        console.error("Error fetching installment by ID:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateInstallment = async (req, res) => {
    try {
        const { installment_no } = req.params;
        const { due_days, due_date, percentage, lumpsum_amount, remarks } = req.body;

        if (!installment_no) {
            return res.status(400).json({ success: false, message: "Installment No is required." });
        }

        const updatedInstallment = await prisma.installmentPlan.update({
            where: { installment_no },
            data: { due_days, due_date, percentage, lumpsum_amount, remarks }
        }); 

        if (!updatedInstallment) {
            return res.status(404).json({ success: false, message: "Installment not found." });
        }

        res.status(200).json({ success: true, data: updatedInstallment });  
        
    } catch (error) {
        console.error("Error updating installment:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteInstallment = async (req, res) => {
    try {
        const { installment_no } = req.params;

        if (!installment_no) {
            return res.status(400).json({ success: false, message: "Installment No is required." });
        }
        
        const deletedInstallment = await prisma.installmentPlan.delete({   
            where: { installment_no }
        });

        if (!deletedInstallment) {
            return res.status(404).json({ success: false, message: "Installment not found." });
        }
        res.status(200).json({ success: true, message: "Installment deleted successfully." });
    } catch (error) {
        console.error("Error deleting installment:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}
