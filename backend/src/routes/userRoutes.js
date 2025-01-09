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

router.post(
  "/add",
  [protect],
  authorize("admin"),
  uploadImage.single("picture"),
  addUser
);
router.get("/", [protect], authorize("admin"), getAllUsers);
router.put(
  "/update",
  [protect],
  authorize("admin"),
  uploadImage.single("picture"),
  updateUser
);
router.put("/deactivate", [protect], authorize("admin"), deactivateUser);
router.delete("/delete", [protect], authorize("admin"), deleteUser);

export default router;
