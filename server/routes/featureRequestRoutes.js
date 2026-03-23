import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  createFeatureRequest,
  deleteFeatureRequest,
  getFeatureRequestById,
  getFeatureRequests,
  updateFeatureRequest,
} from "../controllers/featureRequestController.js";

const router = express.Router();

router.get("/", protect, getFeatureRequests);
router.get("/:id", protect, getFeatureRequestById);
router.post("/", protect, createFeatureRequest);
router.patch("/:id", protect, updateFeatureRequest);
router.delete("/:id", protect, adminOnly, deleteFeatureRequest);

export default router;
