import prisma from "../../db/index.js";

export const createBooking = async (req, res) => {
  try {
    const { customer_id, booking_date, name, address, property_id } = req.body;

    // Validate required fields
    if (!customer_id || !booking_date || !name || !address || !property_id) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Check if customer exists
    const customerExists = await prisma.customer.findUnique({
      where: { customer_id: customer_id },
    });
    if (!customerExists) {
      return res.status(400).json({ success: false, message: `Customer ID ${customer_id} does not exist.` });
    }

    // Check if property exists
    const propertyExists = await prisma.property.findUnique({
      where: { property_id: parseInt(property_id) },
    });
    if (!propertyExists) {
      return res.status(400).json({ success: false, message: `Property ID ${property_id} does not exist.` });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        customer_id: customer_id,
        booking_date: new Date(booking_date),
        name,
        address,
        property_id: parseInt(property_id),
      },
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error("Error in booking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


export const getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany();
    res.status(200).json({ success: true, data: bookings });
  } catch (error) { 
    console.error("Error in getting bookings:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};  


export const getBookingById = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { booking_id: parseInt(booking_id) },  
    });
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }
    res.status(200).json({ success: true, data: booking }); 
  } catch (error) {
    console.error("Error in getting booking by ID:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};  


export const updateBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const { customer_id, booking_date, name, address, property_id } = req.body; 

    const updatedBooking = await prisma.booking.update({
      where: { booking_id: parseInt(booking_id) },
      data: { customer_id, booking_date, name, address, property_id },
    }); 

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    res.status(200).json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error("Error in updating booking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};      


export const deleteBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const deletedBooking = await prisma.booking.delete({
      where: { booking_id: parseInt(booking_id) },  
    });
    if (!deletedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }
    res.status(200).json({ success: true, message: "Booking deleted successfully." });
  } catch (error) {
    console.error("Error in deleting booking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};    






