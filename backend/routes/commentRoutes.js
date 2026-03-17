import express from "express";
import protect from "../middleware/authMiddleware.js";
import Comment from "../models/Comment.js";

const router = express.Router();

/* ===============================
   ADD COMMENT
================================ */
router.post("/comments/:complaintId", protect, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Comment message required",
      });
    }

    const comment = await Comment.create({
      complaintId: req.params.complaintId,
      userId: req.user.id,
      message,
    });

    res.status(201).json({
      message: "Comment added",
      comment,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* ===============================
   GET COMMENTS FOR COMPLAINT
================================ */
router.get("/comments/:complaintId", protect, async (req, res) => {
  try {
    const comments = await Comment.find({
      complaintId: req.params.complaintId,
    })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;