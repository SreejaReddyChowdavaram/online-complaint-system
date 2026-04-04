import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import Complaint from "../models/Complaint.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import { sendNotification } from "../utils/notificationHelper.js";
import { autoAssignOfficer } from "../utils/assignmentHelper.js";

const router = express.Router();

/* ===============================
   POST COMPLAINT
================================ */
router.post(
  "/post",
  protect,
  upload.array("files", 5),
  async (req, res) => {
    try {
      console.log(`[${new Date().toISOString()}] 📥 Submission: ${req.body.title} (User: ${req.user.id})`);

      const {
        title,
        category,
        description,
        address,
        latitude,
        longitude,
      } = req.body;

      // 1. Validation (Fast)
      if (!title || !category || !description || !latitude || !longitude) {
        console.warn("⚠️ Validation: Missing fields", { title, category, description, latitude, longitude });
        return res.status(400).json({
          success: false,
          message: "All fields are required. Please check your input.",
        });
      }

      const files = req.files || [];
      if (files.length === 0) {
        console.warn("⚠️ Validation: No files");
        return res.status(400).json({
          success: false,
          message: "At least one evidence image is required.",
        });
      }

      // 2. Database Record Creation (Fast)
      const images = files.map(file => file.path); // Store Cloudinary URL (path)
      const complaint = await Complaint.create({
        title,
        category,
        description,
        location: {
          address,
          lat: Number(latitude),
          lng: Number(longitude),
        },
        images,
        userId: req.user.id,
      });

      // 3. Send Immediate Success Response (FAST)
      res.status(201).json({
        success: true,
        message: "Complaint submitted successfully! We are assigning an officer right now.",
        data: complaint,
      });
      console.log(`[${new Date().toISOString()}] ✅ Response sent for: ${complaint._id}`);

      // 4. Background Post-Submission Tasks (NON-BLOCKING)
      (async () => {
        try {
          // A. Smart Auto-Assignment
          console.log(`[${new Date().toISOString()}] 🤖 Background: Assigning officer for ${complaint._id}`);
          const assignedOfficer = await autoAssignOfficer(complaint);
          
          // B. Administrative Notifications
          const admins = await User.find({ role: "Admin" }).select('_id').lean();
          await Promise.all(admins.map(admin => 
            sendNotification({
              userId: admin._id,
              role: "Admin",
              message: `📩 New complaint: ${complaint.title}`,
              type: "info",
              targetId: complaint._id
            }).catch(e => console.error("Admin Notify Error:", e.message))
          ));

          if (assignedOfficer) {
            console.log(`[${new Date().toISOString()}] ✅ Background: Assigned to ${assignedOfficer.name}`);
          }
        } catch (bgErr) {
          console.error("❌ Background Task Error:", bgErr.message);
        }
      })();

    } catch (err) {
      console.error("🔥 Submission Critical Error:", err);
      // Ensure we haven't already sent a response
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "System error: Failed to submit complaint. Please try again later.",
          error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }
    }
  }
);

/* ===============================
   GET USER COMPLAINTS
================================ */
router.get("/user", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({
      userId: req.user.id,
    }).populate("assignedTo", "name department").sort({ createdAt: -1 });

    // Attach comment counts
    const complaintsWithCounts = await Promise.all(complaints.map(async (c) => {
      const count = await Comment.countDocuments({ complaintId: c._id });
      return { ...c.toObject(), commentCount: count };
    }));

    res.json(complaintsWithCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   GET ALL COMPLAINTS
================================ */
router.get("/", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("assignedTo", "name department email")
      .sort({ createdAt: -1 });

    // Attach comment counts
    const complaintsWithCounts = await Promise.all(complaints.map(async (c) => {
      const count = await Comment.countDocuments({ complaintId: c._id });
      return { ...c.toObject(), commentCount: count };
    }));

    res.json(complaintsWithCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   GET SINGLE COMPLAINT
================================ */
router.get("/:id", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("userId", "name email mobile avatar")
      .populate("assignedTo", "name department email mobile avatar");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Attach comment counts
    const commentCount = await Comment.countDocuments({
      complaintId: req.params.id,
    });

    res.json({ ...complaint.toObject(), commentCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* ===============================
   UPVOTE COMPLAINT
================================ */
router.post("/upvote/:id", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (!complaint.votes) {
      complaint.votes = [];
    }

    const userId = req.user._id.toString();
    const existingVoteIndex = complaint.votes.findIndex(
      (v) => v.user && v.user.toString() === userId
    );

    if (existingVoteIndex !== -1) {
      const existingVote = complaint.votes[existingVoteIndex];
      if (existingVote.voteType === "upvote") {
        // Remove existing upvote
        complaint.votes.splice(existingVoteIndex, 1);
      } else {
        // Change downvote to upvote
        existingVote.voteType = "upvote";
      }
    } else {
      // Add new upvote
      complaint.votes.push({ user: req.user._id, voteType: "upvote" });
    }

    // Force Mongoose to recognize changes in the votes array
    complaint.markModified('votes');

    // Recalculate upvotes/downvotes
    complaint.upvotes = complaint.votes.filter(v => v.voteType === "upvote").length;
    complaint.downvotes = complaint.votes.filter(v => v.voteType === "downvote").length;

    await complaint.save();
    res.json(complaint);
  } catch (err) {
    console.error("Upvote Error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   DOWNVOTE COMPLAINT
================================ */
router.post("/downvote/:id", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (!complaint.votes) {
      complaint.votes = [];
    }

    const userId = req.user._id.toString();
    const existingVoteIndex = complaint.votes.findIndex(
      (v) => v.user && v.user.toString() === userId
    );

    if (existingVoteIndex !== -1) {
      const existingVote = complaint.votes[existingVoteIndex];
      if (existingVote.voteType === "downvote") {
        // Remove existing downvote
        complaint.votes.splice(existingVoteIndex, 1);
      } else {
        // Change upvote to downvote
        existingVote.voteType = "downvote";
      }
    } else {
      // Add new downvote
      complaint.votes.push({ user: req.user._id, voteType: "downvote" });
    }

    // Force Mongoose to recognize changes in the votes array
    complaint.markModified('votes');

    // Recalculate upvotes/downvotes
    complaint.upvotes = complaint.votes.filter(v => v.voteType === "upvote").length;
    complaint.downvotes = complaint.votes.filter(v => v.voteType === "downvote").length;

    await complaint.save();
    res.json(complaint);
  } catch (err) {
    console.error("Downvote Error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   ADD COMMENT
================================ */
router.post("/comment/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "Citizen") {
      return res.status(403).json({ message: "Only citizens can comment" });
    }
    const { text } = req.body;

    const comment = await Comment.create({
      complaintId: req.params.id,
      userId: req.user.id,
      message: text,
    });

    const populatedComment = await comment.populate("userId", "name");
    res.json(populatedComment);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   GET COMMENTS
================================ */
router.get("/comments/:id", protect, async (req, res) => {
  try {
    const comments = await Comment.find({
      complaintId: req.params.id,
    })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;