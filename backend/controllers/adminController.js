import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import Feedback from "../models/Feedback.js";
import { sendNotification } from "../utils/notificationHelper.js";


export const getDashboardData = async (req, res) => {
  try {
    // 1. Complaint Stats
    const statsResult = await Complaint.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    let stats = { total: 0, pending: 0, assigned: 0, inProgress: 0, resolved: 0 };
    statsResult.forEach(item => {
      const status = (item._id || "").toLowerCase();
      if (status === "pending") stats.pending += item.count;
      else if (status === "assigned") stats.assigned += item.count;
      else if (status === "in progress" || status === "in_progress" || status === "in-progress") stats.inProgress += item.count;
      else if (status === "resolved") stats.resolved += item.count;
      
      stats.total += item.count;
    });

    // 2. User Metrics
    const totalUsers = await User.countDocuments({ role: "Citizen" });
    const totalOfficers = await User.countDocuments({ role: "Officer" });

    // 3. Recent Complaints (Last 5)
    const recentComplaints = await Complaint.find()
      .populate("userId", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    // 4. Top Performing Officers (Avg Rating)
    const officerRatings = await Feedback.aggregate([
      {
        $group: {
          _id: "$officerId",
          name: { $first: "$officerName" },
          dept: { $first: "$department" },
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgRating: -1 } },
      { $limit: 3 }
    ]);

    // 5. System Alerts (Example: Pending > 3 days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const overdueCount = await Complaint.countDocuments({
      status: "Pending",
      createdAt: { $lt: threeDaysAgo }
    });

    res.json({
      stats,
      userMetrics: { totalUsers, totalOfficers },
      recentComplaints,
      topOfficers: officerRatings,
      alerts: {
        overduePending: overdueCount,
        criticalIssues: overdueCount > 0 ? [`${overdueCount} complaints pending > 3 days`] : []
      }
    });

  } catch (error) {
    console.error("Dashboard Data Error:", error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};

/**
 * GET /api/dashboard-stats
 * Returns simple counts for admin dashboard cards.
 */
export const getDashboardStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    
    // Using case-insensitive regex to handle inconsistent values in DB
    const pending = await Complaint.countDocuments({ status: { $regex: /^pending$/i } });
    const assigned = await Complaint.countDocuments({ status: { $regex: /^assigned$/i } });
    const inProgress = await Complaint.countDocuments({ status: { $regex: /^(in progress|in_progress|in-progress)$/i } });
    const resolved = await Complaint.countDocuments({ status: { $regex: /^resolved$/i } });

    console.log("--- DASHBOARD STATS DEBUG ---");
    console.log("Total:", total);
    console.log("Pending:", pending);
    console.log("Assigned:", assigned);
    console.log("In Progress:", inProgress);
    console.log("Resolved:", resolved);
    console.log("----------------------------");

    res.json({
      total,
      pending,
      assigned,
      inProgress,
      resolved,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("userId", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Error fetching complaints" });
  }
};


export const getAllOfficers = async (req, res) => {
  try {
    const officers = await User.find({ role: "Officer" })
      .select("name email department assignedArea currentActiveComplaints")
      .lean();

    res.json(officers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching officers" });
  }
};

// ─── USER MANAGEMENT ──────────────────────────────────────────────────────────

/**
 * GET /api/admin/users
 * Fetch all users (all roles) excluding passwords.
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    res.json(users);
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

/**
 * PUT /api/admin/user/:id
 * Update the role of a user.
 * Body: { role: "Citizen" | "Officer" | "Admin" }
 */
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ["Citizen", "Officer", "Admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from demoting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "Role updated successfully", user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("updateUserRole error:", error);
    res.status(500).json({ message: "Error updating user role" });
  }
};

import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import Notification from "../models/Notification.js";

/**
 * DELETE /api/admin/user/:id
 * Permanently delete a user account and ALL associated trace data (Deep Cascade Delete).
 */
export const deleteUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.params.id;
    const user = await User.findById(userId).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    console.log(`🧹 Starting Deep Cascade deletion for user: ${user.name} (${userId})`);

    // 1. OFFICER REASSIGNMENT LOGIC (If user is an Officer)
    let reassignedCount = 0;
    let unassignedCount = 0;

    if (user.role === "Officer") {
      console.log(`📋 User is an Officer. Identifying complaints for reassignment...`);
      
      // Find all ACTIVE complaints assigned to this officer
      const assignedComplaints = await Complaint.find({ 
        assignedTo: userId,
        status: { $ne: "Resolved" }
      }).session(session);

      for (const complaint of assignedComplaints) {
        // Find a suitable replacement officer
        // Criteria: Same Department (Category), Not the deleted officer, Least Workload
        const potentialOfficers = await User.find({
          _id: { $ne: userId },
          role: "Officer",
          department: { $regex: new RegExp(`^${complaint.category}$`, "i") }
        })
        .sort({ currentActiveComplaints: 1 })
        .session(session);

        if (potentialOfficers.length > 0) {
          const replacement = potentialOfficers[0];
          
          // Reassign Complaint
          await Complaint.findByIdAndUpdate(
            complaint._id,
            { 
              assignedTo: replacement._id,
              assignedAt: new Date(),
              status: "Assigned"
            },
            { session }
          );

          // Update New Officer Workload
          await User.findByIdAndUpdate(
            replacement._id,
            { $inc: { currentActiveComplaints: 1 } },
            { session }
          );

          // Notify replacement
          try {
             await sendNotification({
               userId: replacement._id,
               role: "Officer",
               message: `📢 Reassigned: ${complaint.title} (Reason: Previous officer deleted)`,
               type: "info",
               targetId: complaint._id
             });
          } catch (notifyErr) {
             console.error(`Notification failure during reassignment for ${replacement._id}`);
          }

          reassignedCount++;
          console.log(`✅ Reassigned ${complaint._id} to ${replacement.name}`);
        } else {
          // No suitable officer found - mark as Pending Assignment
          await Complaint.findByIdAndUpdate(
            complaint._id,
            { 
              assignedTo: null,
              status: "Pending Assignment" 
            },
            { session }
          );
          unassignedCount++;
          console.log(`⚠️ No replacement found for ${complaint._id}. Marked as Pending Assignment.`);
        }
      }
    }

    // 2. Pre-fetch dependencies for deep cleanup (Feedback & Complaints list)
    const userComplaints = await Complaint.find({ userId }).session(session);
    const userFeedback = await Feedback.find({ citizenId: userId }).session(session);
    const complaintIds = userComplaints.map(c => c._id);

    // 2. Identify and Update Officer Performance Stats
    const officerStatsUpdates = {};

    // Map Complaints to Officer Stats
    userComplaints.forEach(complaint => {
      if (complaint.assignedTo) {
        const officerId = complaint.assignedTo.toString();
        if (!officerStatsUpdates[officerId]) {
          officerStatsUpdates[officerId] = { active: 0, completed: 0, sumRating: 0, countRating: 0 };
        }
        
        // Decrement active cases if not resolved
        if (complaint.status !== "Resolved") {
          officerStatsUpdates[officerId].active++;
        } else {
          // Decrement completed cases if resolved
          officerStatsUpdates[officerId].completed++;
        }
      }
    });

    // Map Feedback to Officer Stats
    userFeedback.forEach(fb => {
      if (fb.officerId) {
        const officerId = fb.officerId.toString();
        if (!officerStatsUpdates[officerId]) {
          officerStatsUpdates[officerId] = { active: 0, completed: 0, sumRating: 0, countRating: 0 };
        }
        officerStatsUpdates[officerId].sumRating += fb.rating;
        officerStatsUpdates[officerId].countRating++;
      }
    });

    // Apply Bulk Updates for each Officer
    for (const [officerId, stats] of Object.entries(officerStatsUpdates)) {
      await User.findByIdAndUpdate(
        officerId,
        { 
          $inc: { 
            currentActiveComplaints: -stats.active,
            completedCases: -stats.completed,
            cumulativeRating: -stats.sumRating,
            totalRatings: -stats.countRating
          } 
        },
        { session }
      );
      console.log(`📉 Updated performance sync for officer ${officerId}`);
    }

    // 3. Perform the Deep Cleanup
    // A. Delete All Comments (by user OR on their complaints)
    const commentDeleteResult = await Comment.deleteMany({
      $or: [
        { userId: userId },
        { complaintId: { $in: complaintIds } }
      ]
    }).session(session);

    // B. Delete All Notifications (for user OR about their complaints)
    const notificationDeleteResult = await Notification.deleteMany({
      $or: [
        { userId: userId },
        { targetId: { $in: complaintIds.map(id => id.toString()) } }
      ]
    }).session(session);

    // C. Delete All Complaints by the user
    const complaintDeleteResult = await Complaint.deleteMany({ userId }).session(session);

    // D. Delete All Feedback by the user
    const feedbackDeleteResult = await Feedback.deleteMany({ citizenId: userId }).session(session);

    // E. Delete the core User
    await User.findByIdAndDelete(userId).session(session);

    console.log(`👤 Cascade deletion for ${user.name} complete.`);

    // Commit Transaction
    await session.commitTransaction();
    session.endSession();

    res.json({ 
      message: "Deep cascade deletion successful. All traces removed.",
      details: {
        complaints: complaintDeleteResult.deletedCount,
        comments: commentDeleteResult.deletedCount,
        notifications: notificationDeleteResult.deletedCount,
        feedback: feedbackDeleteResult.deletedCount,
        reassigned: reassignedCount,
        unassigned: unassignedCount
      }
    });

  } catch (error) {
    // Rollback on error
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Deep Cascade Error:", error);
    res.status(500).json({ message: "Error performing deep cascade deletion", error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

export const assignComplaint = async (req, res) => {
  try {
    const { complaintId, officerId } = req.body;

    const officer = await User.findById(officerId);

    if (!officer || officer.role !== "Officer") {
      return res.status(400).json({ message: "Invalid officer" });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const oldOfficerId = complaint.assignedTo;

    // 1. Update Complaint
    complaint.assignedTo = officerId;
    complaint.assignedAt = new Date();
    complaint.status = "Assigned";
    await complaint.save();

    // 2. Manage Workload (Old Officer)
    if (oldOfficerId && oldOfficerId.toString() !== officerId.toString()) {
      await User.findByIdAndUpdate(oldOfficerId, {
        $inc: { currentActiveComplaints: -1 }
      });
    }

    // 3. Manage Workload (New Officer)
    if (!oldOfficerId || oldOfficerId.toString() !== officerId.toString()) {
      await User.findByIdAndUpdate(officerId, {
        $inc: { currentActiveComplaints: 1 }
      });
    }

    res.status(200).json({
      message: "Complaint assigned successfully",
      complaint,
    });

    // 🔔 Notify Officer (Real-time)
    try {
      await sendNotification({
        userId: officerId,
        role: "Officer",
        message: "📌 A complaint has been assigned to you",
        type: "info",
        targetId: complaintId
      });
    } catch (err) {
      console.error("Notification Error (Assign Complaint):", err);
    }


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Assignment failed" });
  }
};



