import express from "express";
import { uploadImage } from "../utils/uploadManager.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

import {
  roomReservation,
  getAllRooms,
  getRoomById,
  checkRoomAvailability,
  bookRoomOnline,
  confirmReservation,
  addRoom,
  updateRoomStatus,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";

const router = express.Router();

// get all rooms
router.get("/", getAllRooms);

// add room
router.post(
  "/addRoom",
  [protect],
  authorize("admin"),
  uploadImage.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pictures", maxCount: 10 },
  ]),
  addRoom
);

// update room status
router.put("/roomStatus", [protect], authorize("admin"), updateRoomStatus);

// update room details
router.put(
  "/update",
  [protect],
  authorize("admin"),
  uploadImage.single("picture"),
  updateRoom
);

// delete room
router.delete("/delete", [protect], authorize("admin"), deleteRoom);

// all users can access these routes with authentication
router.post("/reservation", [protect], roomReservation);

// all users can access these routes without authentication
router.get("/single", getRoomById);
router.get("/checkAvailability", checkRoomAvailability); // check room availability by check-in and check-out dates

router.post("/book", bookRoomOnline);
router.post("/confirm", confirmReservation);

export default router;
