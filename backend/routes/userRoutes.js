import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.put("/update/:id", async (req, res) => {
  try {
    const { name, mobile, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, mobile, address },
      { new: true }
    );

    res.json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;   // ✅ THIS IS VERY IMPORTANT