import express from "express";
import multer from "multer";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();


// Get current user profile
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

router.put("/update/:id", upload.single("avatar"), async (req, res) => {
  try {
    const { name, mobile, address } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (mobile !== undefined) updateData.mobile = mobile;
    if (address !== undefined) updateData.address = address;
    
    if (req.file) {
      updateData.avatar = req.file.path; // Store Cloudinary URL (path)
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    res.json({ user: updatedUser });
  } catch (error) {
    console.error("USER UPDATE ERROR:", error);
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;