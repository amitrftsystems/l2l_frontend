import express from "express";
import { createBooking, getBookings, getBookingById, updateBooking, deleteBooking } from "../controllers/trasactionController/booking.js";

const router = express.Router();

// booking
router.post("/booking", createBooking);
router.get("/bookings", getBookings);
router.get("/booking/:booking_id", getBookingById);
router.put("/booking/:booking_id", updateBooking);
router.delete("/booking/:booking_id", deleteBooking);

export default router;

