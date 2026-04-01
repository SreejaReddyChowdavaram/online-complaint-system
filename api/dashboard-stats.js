import dbConnect from "../lib/db.js";
import Complaint from "../models/Complaint.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed. Use GET." });
  }

  try {
    await dbConnect();
    
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: { $regex: /^pending$/i } });
    const inProgress = await Complaint.countDocuments({ status: { $regex: /^(in progress|in_progress|in-progress)$/i } });
    const resolved = await Complaint.countDocuments({ status: { $regex: /^resolved$/i } });

    return res.status(200).json({
      success: true,
      total,
      pending,
      inProgress,
      resolved,
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
