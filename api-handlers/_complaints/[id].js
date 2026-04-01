import dbConnect from "../../lib/db.js";
import Complaint from "../../models/Complaint.js";
import Comment from "../../models/Comment.js";
import { withAuth } from "../../lib/authMiddleware.js";

const handler = async (req, res) => {
  const { id } = req.query;

  try {
    await dbConnect();

    if (req.method === "GET") {
      const complaint = await Complaint.findById(id)
        .populate("userId", "name email mobile avatar")
        .populate("assignedTo", "name department email mobile avatar");

      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      const commentCount = await Comment.countDocuments({
        complaintId: id,
      });

      return res.status(200).json({ ...complaint.toObject(), commentCount });
    }

    if (req.method === "PUT") {
      const { status } = req.body;
      const complaint = await Complaint.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      return res.status(200).json({ success: true, complaint });
    }

    if (req.method === "DELETE") {
      const complaint = await Complaint.findByIdAndDelete(id);
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      return res.status(200).json({ success: true, message: "Complaint deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default withAuth(handler);
