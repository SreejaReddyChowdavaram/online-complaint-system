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
      console.log("📥 Incoming Complaint Submission:");
      console.log("Body:", req.body);
      console.log("Files:", req.files ? req.files.length : 0);

      const {
        title,
        category,
        description,
        address,
        latitude,
        longitude,
      } = req.body;

      if (
        !title ||
        !category ||
        !description ||
        !latitude ||
        !longitude
      ) {
        console.warn("⚠️ Validation Failed: Missing fields in body", req.body);
        return res.status(400).json({
          message: "Missing required fields",
        });
      }

      if (!req.files || req.files.length === 0) {
        console.warn("⚠️ Validation Failed: No files uploaded");
        return res.status(400).json({
          message: "No files uploaded",
        });
      }

     const images = req.files.map(
  (file) => file.filename
);

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

      // 🤖 SMART AUTO-ASSIGNMENT
      // Attempt to find the best officer for this complaint automatically
      const assignedOfficer = await autoAssignOfficer(complaint);

      res.status(201).json({
        message: assignedOfficer 
          ? `Complaint assigned to ${assignedOfficer.name}` 
          : "Complaint submitted successfully (Pending Review)",
        complaint,
      });

      // 🔔 Notify ALL Admins (Real-time)
      try {
        const admins = await User.find({ role: "Admin" });
        await Promise.all(admins.map(admin => 
          sendNotification({
            userId: admin._id,
            role: "Admin",
            message: "📩 New complaint submitted",
            type: "info",
            targetId: complaint._id
          })
        ));
      } catch (err) {
        console.error("Notification Error (New Complaint):", err);
      }


    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: err.message,
      });
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