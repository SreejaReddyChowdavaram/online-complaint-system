import express from "express";
import {
  getAssignedComplaints,
  updateComplaint,
  upload,
} from "../controllers/officerController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/assigned", protect, getAssignedComplaints);

// 🔥 UPDATE ROUTE (with multer)
router.put(
  "/update/:id",
  protect,
  upload.single("resolutionImage"),
  updateComplaint
);

export default router;
