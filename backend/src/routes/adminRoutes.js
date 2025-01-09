import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { adminDashboard } from "../controllers/adminController.js";

const router = express.Router();

////////////////////------------------------DASHBOARD ROUTES--------------------------////////////////////

// dashboard ( ONLY ADMIN CAN ACCESS )
router.get("/dashboard", protect, authorize("admin"), adminDashboard);

export default router;
