import express from "express";
import Feedback from "../models/Feedback.js";
import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import { sendNotification } from "../utils/notificationHelper.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// 📝 POST Feedback (Self-Submission or bot-triggered)
router.post("/", protect, async (req, res) => {
  try {
    const { 
      officerName, 
      officerId,
      department, 
      complaintId, 
      type, 
      rating, 
      message,
      sentiment,
      visibility,
      escalated
    } = req.body;
    
    if (!officerName || !department || !type || !rating || !message || !sentiment) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Determine officerId: Use provided ID, find by name, or find via Complaint record
    let finalOfficerId = officerId;
    if (!finalOfficerId || finalOfficerId === "null" || finalOfficerId === "undefined") {
      // 1. Try finding by officer name
      if (officerName && officerName !== "N/A") {
        const officerRef = await User.findOne({ name: officerName, role: "Officer" });
        finalOfficerId = officerRef ? officerRef._id : null;
      }
      
      // 2. Fallback: Check the actual complaint record for assignment
      if (!finalOfficerId && complaintId) {
        const complaint = await Complaint.findById(complaintId).select("assignedTo");
        if (complaint && complaint.assignedTo) {
          finalOfficerId = complaint.assignedTo;
        }
      }
    }

    const feedback = new Feedback({
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


    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully", feedback });

    // 🔔 Notify Officer (Real-time)
    try {
      const officer = await User.findOne({ name: officerName, role: "Officer" });
      if (officer) {
        await sendNotification({
          userId: officer._id,
          role: "Officer",
          message: "⭐ New feedback received",
          type: "success"
        });
      }
    } catch (err) {
      console.error("Notification Error (Feedback Officer):", err);
    }

    // 🔔 Notify Admins if Low Rating (Real-time)
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
      } catch (err) {
        console.error("Notification Error (Low Rating Admin):", err);
      }
    }


  } catch (err) {
    console.error("FEEDBACK ERROR:", err);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
});

// 👮 GET feedback for current officer
router.get("/my-feedback", protect, async (req, res) => {
  try {
    // Filter strictly by officerId and populate latest data
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

    res.json({ 
      feedback, 
      stats: { totalCount, avgRating, positivePercent, negativePercent: 100 - positivePercent } 
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching feedback" });
  }
});

// 🛠️ GET all feedback (Admin view)
router.get("/all", protect, async (req, res) => {
  if (req.user.role !== "Admin") return res.status(403).json({ message: "Access denied" });
  
  try {
    const { department, rating } = req.query;
    let query = {};
    if (department) query.department = department;
    if (rating) query.rating = parseInt(rating);

    // Populate officerId and citizenId to get latest profile info
    const feedback = await Feedback.find(query)
      .populate("officerId", "name department")
      .populate("citizenId", "name")
      .sort({ submittedAt: -1 });

    // Summary stats for Admin Analytics (ID-based)
    let aggregatePipeline = [];
    
    // Filter by department if provided (using the denormalized string for now or join)
    if (department) {
      aggregatePipeline.push({ $match: { department } });
    }

    aggregatePipeline.push(
      {
        $group: {
          _id: "$officerId",
          count: { $sum: 1 },
          avgRating: { $avg: "$rating" }
        }
      },
      // Join with Users collection to get the LATEST name and department
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "officer"
        }
      },
      {
        $unwind: "$officer"
      },
      {
        $project: {
          _id: 1,
          avgRating: 1,
          count: 1,
          name: "$officer.name",
          dept: "$officer.department"
        }
      },
      { $sort: { avgRating: -1 } }
    );

    const officerStats = await Feedback.aggregate(aggregatePipeline);
    res.json({ feedback, officerStats });
  } catch (err) {
    console.error("ADMIN ANALYTICS ERROR:", err);
    res.status(500).json({ message: "Error fetching analytics" });
  }
});

// 🔍 Check if feedback exists for a complaint
router.get("/check/:complaintId", protect, async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ 
      complaintId: req.params.complaintId,
      citizenId: req.user._id 
    });
    res.json({ exists: !!feedback, feedback });
  } catch (err) {
    res.status(500).json({ message: "Error checking feedback status" });
  }
});


export default router;
