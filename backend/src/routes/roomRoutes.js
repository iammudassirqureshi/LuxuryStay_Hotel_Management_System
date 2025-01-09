import express from "express";
import {
  roomReservation,
  getAllRooms,
  getRoomById,
  checkRoomAvailability,
  bookRoomOnline,
  confirmReservation,
} from "../controllers/roomController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// all users can access these routes with authentication
router.post("/reservation", [protect], roomReservation);

// all users can access these routes without authentication
router.get("/", getAllRooms);
router.get("/single", getRoomById);
router.get("/checkAvailability", checkRoomAvailability); // check room availability by check-in and check-out dates

router.post("/book", bookRoomOnline);
router.post("/confirm", confirmReservation);

export default router;
