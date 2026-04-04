import express from "express";
import protect from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";
import upload from "../middleware/upload.js";
import User from "../models/User.js";

import {
  getDashboardData,
  getAllComplaints,
  assignComplaint,
  getAllOfficers,
  getAllUsers,
  updateUserRole,
  deleteUser
} from "../controllers/adminController.js";

const router = express.Router();


router.get("/stats", getDashboardData); 
router.get("/dashboard-data", getDashboardData);
router.get("/complaints", getAllComplaints);
router.get("/officers", getAllOfficers);
router.post("/assign", assignComplaint);

// Admin Profile Update
router.put("/profile", protect, upload.single("avatar"), async (req, res) => {
  try {
    const { name, mobile } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (mobile !== undefined) updateData.mobile = mobile;
    
    if (req.file) {
      updateData.avatar = req.file.path; // Store Cloudinary URL (path)
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error("ADMIN PROFILE UPDATE ERROR:", error);
    res.status(500).json({ message: "Update failed" });
  }
});

// ─── USER MANAGEMENT ROUTES ────────────────────────────────────────────────
router.get("/users", protect, isAdmin, getAllUsers);
router.put("/user/:id", protect, isAdmin, updateUserRole);
router.delete("/user/:id", protect, isAdmin, deleteUser);

export default router;
