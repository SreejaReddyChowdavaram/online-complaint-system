import express from "express";
import multer from "multer";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// 📦 MULTER CONFIG
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

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
      updateData.avatar = req.file.filename;
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