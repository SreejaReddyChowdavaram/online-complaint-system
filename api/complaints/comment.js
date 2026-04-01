import dbConnect from "../../lib/db.js";
import Comment from "../../models/Comment.js";
import { withAuth } from "../../lib/authMiddleware.js";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed. Use POST." });
  }

  const { id } = req.query; // complaintId
  const { text } = req.body;

  if (!id || !text) {
    return res.status(400).json({ message: "Missing complaint ID or comment text." });
  }

  try {
    await dbConnect();
    
    if (req.user.role !== "Citizen") {
      return res.status(403).json({ message: "Only citizens can comment" });
    }

    const comment = await Comment.create({
      complaintId: id,
      userId: req.user._id,
      message: text,
    });

    const populatedComment = await Comment.findById(comment._id).populate("userId", "name");
    return res.status(201).json(populatedComment);

  } catch (error) {
    console.error("ADD COMMENT ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default withAuth(handler);
