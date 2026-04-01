import dbConnect from "../../lib/db.js";
import Complaint from "../../models/Complaint.js";
import Comment from "../../models/Comment.js";
import { withAuth } from "../../lib/authMiddleware.js";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed. Use GET." });
  }

  try {
    await dbConnect();
    const complaints = await Complaint.find({
      userId: req.user._id,
    }).populate("assignedTo", "name department").sort({ createdAt: -1 });

    // Attach comment counts
    const complaintsWithCounts = await Promise.all(complaints.map(async (c) => {
      const count = await Comment.countDocuments({ complaintId: c._id });
      return { ...c.toObject(), commentCount: count };
    }));

    return res.status(200).json(complaintsWithCounts);
  } catch (error) {
    console.error("USER COMPLAINTS ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default withAuth(handler);
