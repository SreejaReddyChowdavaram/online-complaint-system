import dbConnect from "../../lib/db.js";
import Complaint from "../../models/Complaint.js";
import User from "../../models/User.js";
import Feedback from "../../models/Feedback.js";
import { withAuth } from "../../lib/authMiddleware.js";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    // 1. Complaint Stats (Dynamic Aggregation)
    const statsResult = await Complaint.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    let stats = { total: 0, pending: 0, inProgress: 0, resolved: 0 };
    statsResult.forEach(item => {
      const status = (item._id || "").toLowerCase();
      if (status === "pending") stats.pending += item.count;
      else if (status.includes("progress")) stats.inProgress += item.count;
      else if (status === "resolved") stats.resolved += item.count;
      stats.total += item.count;
    });

    // 2. User Metrics
    const totalUsers = await User.countDocuments({ role: "Citizen" });
    const totalOfficers = await User.countDocuments({ role: "Officer" });

    // 3. Recent Complaints
    const recentComplaints = await Complaint.find()
      .populate("userId", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    // 4. Performance Metrics (Top 3 Officers)
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

    // 5. System Health Alerts
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const overdueCount = await Complaint.countDocuments({
      status: "Pending",
      createdAt: { $lt: threeDaysAgo }
    });

    return res.status(200).json({
      success: true,
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
    console.error("ADMIN DASHBOARD ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default withAuth(handler, ["Admin"]);
