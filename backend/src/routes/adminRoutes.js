import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { uploadImage } from "../utils/uploadManager.js";
import {
  adminDashboard,
  getAllRooms,
  addRoom,
  updateRoomStatus,
  updateRoom,
  deleteRoom,
} from "../controllers/adminController.js";

const router = express.Router();

////////////////////------------------------DASHBOARD ROUTES--------------------------////////////////////

// dashboard
router.get("/", protect, authorize("admin"), adminDashboard);

////////////////////------------------------ALL ROOM ROUTES--------------------------////////////////////

// get al rooms
router.get("/rooms", protect, authorize("admin"), getAllRooms);

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

////////////////////--------------------------------------------------////////////////////

////////////////////--------------------------------------------------////////////////////

////////////////////--------------------------------------------------////////////////////

export default router;
