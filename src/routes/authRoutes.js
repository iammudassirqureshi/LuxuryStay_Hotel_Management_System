import express from "express";
import multer from "multer";
import mimeType from "mime-types";
import { register, login, logout } from "../controllers/authController.js";
import { uploadImage } from "../utils/uploadManager.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", uploadImage.single("picture"), register);

router.post("/login", login);

router.post("/logout", protect, logout);

export default router;
