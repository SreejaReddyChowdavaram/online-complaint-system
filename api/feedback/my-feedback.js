import dbConnect from "../../lib/db.js";
import Feedback from "../../models/Feedback.js";
import { withAuth } from "../../lib/authMiddleware.js";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();
    const feedback = await Feedback.find({ 
      officerId: req.user._id 
    })
    .populate("officerId", "name department")
    .populate("citizenId", "name")
    .sort({ submittedAt: -1 });

    const totalCount = feedback.length;
    const avgRating = totalCount > 0 
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / totalCount).toFixed(1) 
      : 0;
    
    const positiveCount = feedback.filter(f => f.type === "Positive").length;
    const positivePercent = totalCount > 0 ? Math.round((positiveCount / totalCount) * 100) : 0;

    return res.json({ 
      feedback, 
      stats: { totalCount, avgRating, positivePercent, negativePercent: 100 - positivePercent } 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default withAuth(handler, ["Officer"]);
