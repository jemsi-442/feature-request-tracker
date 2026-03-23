import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getFeatureRequestDashboard } from "../controllers/featureRequestController.js";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, getFeatureRequestDashboard);

export default router;
