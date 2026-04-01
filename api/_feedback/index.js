import dbConnect from "../../lib/db.js";
import Feedback from "../../models/Feedback.js";
import User from "../../models/User.js";
import Complaint from "../../models/Complaint.js";
import { withAuth } from "../../lib/authMiddleware.js";
import { sendNotification } from "../../utils/notificationHelper.js";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();
    const { 
      officerName, officerId, department, complaintId, 
      type, rating, message, sentiment, visibility, escalated 
    } = req.body;

    if (!officerName || !department || !type || !rating || !message || !sentiment) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    let finalOfficerId = officerId;
    if (!finalOfficerId || finalOfficerId === "null") {
      if (officerName && officerName !== "N/A") {
        const officerRef = await User.findOne({ name: officerName, role: "Officer" });
        finalOfficerId = officerRef ? officerRef._id : null;
      }
      if (!finalOfficerId && complaintId) {
        const cmp = await Complaint.findById(complaintId);
        if (cmp) finalOfficerId = cmp.assignedTo;
      }
    }

    const feedback = await Feedback.create({
      citizenId: req.user._id,
      officerName,
      officerId: finalOfficerId,
      department,
      complaintId,
      type,
      rating,
      message,
      sentiment,
      visibility,
      escalated
    });

    // Notify Officer
    if (finalOfficerId) {
      try {
        await sendNotification({
          userId: finalOfficerId,
          role: "Officer",
          message: "⭐ New feedback received",
          type: "success"
        });
      } catch (e) { console.error(e); }
    }

    // Notify Admin on Low Rating
    if (rating <= 2) {
      try {
        const admins = await User.find({ role: "Admin" });
        await Promise.all(admins.map(admin => 
          sendNotification({
            userId: admin._id,
            role: "Admin",
            message: "⚠️ Low rating feedback received",
            type: "warning"
          })
        ));
      } catch (e) { console.error(e); }
    }

    return res.status(201).json({ success: true, feedback });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default withAuth(handler);
