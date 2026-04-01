import dbConnect from "../../lib/db.js";
import Feedback from "../../models/Feedback.js";
import { withAuth } from "../../lib/authMiddleware.js";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query; // complaintId

  try {
    await dbConnect();
    const feedback = await Feedback.findOne({ 
      complaintId: id,
      citizenId: req.user._id 
    });
    
    return res.status(200).json({ exists: !!feedback, feedback });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default withAuth(handler);
