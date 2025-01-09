import express from "express";
import {
  addUser,
  getAllUsers,
  updateUser,
  deactivateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { uploadImage } from "../utils/uploadManager.js";

const router = express.Router();

// add user or staff
router.post(
  "/add",
  [protect],
  authorize("admin"),
  uploadImage.single("picture"),
  addUser
);

// get all users or staff
router.get("/", [protect], authorize("admin"), getAllUsers);

// update user or staff data
router.put(
  "/update",
  [protect],
  authorize("admin"),
  uploadImage.single("picture"),
  updateUser
);

// deactivate user or staff account
router.put("/deactivate", [protect], authorize("admin"), deactivateUser);

// delete user or staff account
router.delete("/delete", [protect], authorize("admin"), deleteUser);

export default router;
