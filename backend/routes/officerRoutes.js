import express from "express";
import multer from "multer";
import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";
import { sendNotification } from "../utils/notificationHelper.js";

const router = express.Router();


// ===============================
// 📦 MULTER CONFIG (FIXED)
// ===============================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


// ===============================
// 📌 GET ASSIGNED COMPLAINTS
// ===============================
router.get("/assigned", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ assignedTo: req.user._id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Error fetching complaints" });
  }
});


// ===============================
// 🔄 UPDATE COMPLAINT
// ===============================
router.put(
  "/update/:id",
  protect,
  upload.single("resolutionImage"),
  async (req, res) => {
    try {
      console.log("File:", req.file);

      const updateData = {
        status: req.body.status,
        assignedTo: req.user._id // Ensure assignment is tracked
      };

      const oldComplaint = await Complaint.findById(req.params.id);
      if (!oldComplaint) return res.status(404).json({ message: "Complaint not found" });

      if (req.file) {
        updateData.resolutionImage = req.file.filename; // ✅ correct
      }

      const updated = await Complaint.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      // 🧠 Workload Management
      // If the complaint is newly marked as "Resolved", decrement officer's workload
      if (oldComplaint.status !== "Resolved" && updated.status === "Resolved") {
        await User.findByIdAndUpdate(req.user._id, {
          $inc: { currentActiveComplaints: -1 }
        });
        console.log(`📉 Workload decremented for Officer: ${req.user.name}`);
      }

      res.json(updated);

      // 🔔 Notify User (Real-time)
      try {
        const message = updated.status === "Resolved" 
          ? "✅ Your complaint is resolved. Please give feedback"
          : "🔄 Your complaint status is updated";
        
        await sendNotification({
          userId: updated.userId,
          role: "Citizen",
          message,
          type: updated.status === "Resolved" ? "success" : "info",
          targetId: updated._id
        });
      } catch (err) {
        console.error("Notification Error (Status Update):", err);
      }


    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Update failed" });
    }
  }
);


// ===============================
// 👤 GET PROFILE
// ===============================
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});


// ===============================
// ✏️ UPDATE PROFILE
// ===============================
router.put("/profile", protect, upload.single("avatar"), async (req, res) => {
  try {
    const { name, department, mobile } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (department !== undefined) updateData.department = department;
    if (mobile !== undefined) updateData.mobile = mobile;
    
    if (req.file) {
      updateData.avatar = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);

  } catch (err) {
    console.error("OFFICER UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;