import dbConnect from "../../lib/db.js";
import Complaint from "../../models/Complaint.js";
import { withAuth } from "../../lib/authMiddleware.js";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();
    const complaints = await Complaint.find({
      assignedTo: req.user._id,
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(complaints);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default withAuth(handler, ["Officer"]);
