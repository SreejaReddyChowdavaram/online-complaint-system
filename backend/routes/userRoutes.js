import express from "express";
import protect from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/* =========================
   GET LOGGED-IN USER
========================= */
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   PREFLIGHT (🔥 REQUIRED)
========================= */
router.options("/update-profile", (req, res) => {
  res.sendStatus(200);
});

/* =========================
   UPDATE PROFILE
========================= */
router.put("/update-profile", protect, async (req, res) => {
  try {
    const { mobile, address, name } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.mobile = mobile || user.mobile;
    user.address = address || user.address;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
