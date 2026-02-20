import Complaint from "../models/Complaint.js";
import User from "../models/User.js";


export const getDashboardStats = async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    let result = {
      total: 0,
      pending: 0,
      inProgress: 0,
      resolved: 0
    };

    stats.forEach(item => {
      result.total += item.count;

      if (item._id === "Pending") result.pending = item.count;
      if (item._id === "In Progress") result.inProgress = item.count;
      if (item._id === "Resolved") result.resolved = item.count;
    });

    res.json(result);
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Error fetching stats" });
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
      .select("name email department")
      .lean();

    res.json(officers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching officers" });
  }
};

export const assignComplaint = async (req, res) => {
  try {
    const { complaintId, officerId } = req.body;

    const officer = await User.findById(officerId);

    if (!officer || officer.role !== "Officer") {
      return res.status(400).json({ message: "Invalid officer" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { assignedTo: officerId, status: "In Progress" },
      { new: true }
    );

    res.status(200).json({
      message: "Complaint assigned successfully",
      complaint,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Assignment failed" });
  }
};



