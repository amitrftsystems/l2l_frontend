import express from "express";
const router = express.Router();


import { 
    createBooking,
    getBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
    checkCustomerBookings
 } from "../controllers/trasactionController/booking.js";


 router.post("/booking", createBooking);
 router.get("/booking", getBookings);
 router.get("/booking/:booking_id", getBookingById);
 router.put("/booking/:booking_id", updateBooking);
 router.delete("/booking/:booking_id", deleteBooking);
 router.get("/booking/check-customer-bookings/:customer_id", checkCustomerBookings);



export default router;

