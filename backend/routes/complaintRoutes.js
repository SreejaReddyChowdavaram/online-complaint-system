import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import Complaint from "../models/Complaint.js";
import Comment from "../models/Comment.js";

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
      const {
        title,
        category,
        description,
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
        return res.status(400).json({
          message: "Missing required fields",
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          message: "No files uploaded",
        });
      }

      const images = req.files.map(
        (file) => `/uploads/${file.filename}`
      );

      const complaint = await Complaint.create({
        title,
        category,
        description,
        location: {
          lat: Number(latitude),
          lng: Number(longitude),
        },
        images,
        userId: req.user.id,
      });

      res.status(201).json({
        message: "Complaint submitted successfully",
        complaint,
      });
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
    }).sort({ createdAt: -1 });

    res.json(complaints);
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
      .sort({ createdAt: -1 });

    res.json(complaints);
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

    const existingVote = complaint.votes.find(
      (v) => v.user.toString() === req.user.id
    );

    if (existingVote) {
      if (existingVote.voteType === "upvote") {
        return res.status(400).json({ message: "Already upvoted" });
      }

      // 🔥 switch vote
      complaint.downvotes -= 1;
      complaint.upvotes += 1;
      existingVote.voteType = "upvote";
    } else {
      complaint.upvotes += 1;
      complaint.votes.push({
        user: req.user.id,
        voteType: "upvote",
      });
    }

    await complaint.save();
    res.json(complaint);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* ===============================
   DOWNVOTE COMPLAINT
================================ */
router.post("/downvote/:id", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    const existingVote = complaint.votes.find(
      (v) => v.user.toString() === req.user.id
    );

    if (existingVote) {
      if (existingVote.voteType === "downvote") {
        return res.status(400).json({ message: "Already downvoted" });
      }

      complaint.upvotes -= 1;
      complaint.downvotes += 1;
      existingVote.voteType = "downvote";
    } else {
      complaint.downvotes += 1;
      complaint.votes.push({
        user: req.user.id,
        voteType: "downvote",
      });
    }

    await complaint.save();
    res.json(complaint);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   ADD COMMENT
================================ */
router.post("/comment/:id", protect, async (req, res) => {
  try {
    const { text } = req.body; // 🔥 FIX HERE

    const comment = await Comment.create({
      complaintId: req.params.id,
      userId: req.user.id,
      message: text,
    });

    res.json(comment);

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