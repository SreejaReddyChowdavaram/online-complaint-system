import cron from "node-cron";
import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

/**
 * Automatically checks for complaints that haven't been resolved within 24 hours
 * of being assigned and notifies the admin.
 */
export const initEscalationCron = () => {
  // Run every hour on the hour
  cron.schedule("0 * * * *", async () => {
    console.log("🕒 Running Automated Escalation Check...");
    await checkAndEscalateComplaints();
  });
  
  console.log("✅ Escalation Cron Job Initialized (Hourly)");
};

export const checkAndEscalateComplaints = async () => {
  try {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Find complaints:
    // 1. Not resolved
    // 2. AssignedTo is set
    // 3. assignedAt is older than 24 hours
    // 4. Escalation hasn't been sent yet
    const overdueComplaints = await Complaint.find({
      status: { $ne: "Resolved" },
      assignedTo: { $ne: null },
      assignedAt: { $lt: twentyFourHoursAgo },
      escalationSent: false
    }).populate("assignedTo", "name department");

    if (overdueComplaints.length === 0) {
      console.log("✅ No overdue complaints found.");
      return;
    }

    console.log(`🚨 Found ${overdueComplaints.length} overdue complaints. Escalating...`);

    // Find all Admin users to notify
    const admins = await User.find({ role: "Admin" });

    for (const complaint of overdueComplaints) {
      const officerName = complaint.assignedTo?.name || "Unknown Officer";
      const message = `🚨 ESCALATION: Complaint "${complaint.title}" (assigned to ${officerName}) has remained unresolved for over 24 hours. Immediate attention required.`;

      // Create notifications for all admins
      const notificationPromises = admins.map(admin => {
        return Notification.create({
          userId: admin._id,
          role: "Admin",
          message: message,
          type: "ESCALATION",
          targetId: complaint._id
        });
      });

      await Promise.all(notificationPromises);

      // Mark as escalated
      complaint.escalationSent = true;
      await complaint.save();

      console.log(`🚩 Escalated: ${complaint.title}`);
    }

  } catch (error) {
    console.error("❌ Escalation System Error:", error);
  }
};
