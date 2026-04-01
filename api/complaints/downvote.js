import dbConnect from "../../lib/db.js";
import Complaint from "../../models/Complaint.js";
import { withAuth } from "../../lib/authMiddleware.js";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed. Use POST." });
  }

  const { id } = req.query;

  try {
    await dbConnect();
    const complaint = await Complaint.findById(id);
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

    // Recalculate upvotes/downvotes
    complaint.markModified('votes');
    complaint.upvotes = complaint.votes.filter(v => v.voteType === "upvote").length;
    complaint.downvotes = complaint.votes.filter(v => v.voteType === "downvote").length;

    await complaint.save();
    return res.status(200).json(complaint);
  } catch (error) {
    console.error("DOWNVOTE ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default withAuth(handler);
