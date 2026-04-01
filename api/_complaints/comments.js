import dbConnect from "../../lib/db.js";
import Comment from "../../models/Comment.js";
import { withAuth } from "../../lib/authMiddleware.js";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query; // complaintId

  if (!id) {
    return res.status(400).json({ message: "Missing complaint ID." });
  }

  try {
    await dbConnect();
    const comments = await Comment.find({
      complaintId: id,
    })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default withAuth(handler);
