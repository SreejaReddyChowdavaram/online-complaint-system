import User from "../models/User.js";
import { sendNotification } from "./notificationHelper.js";

/**
 * Automatically assigns a complaint to the most suitable officer.
 * Criteria:
 * 1. Matches Department (User) with Category (Complaint)
 * 2. Matches AssignedArea (User) with Zone/Location (Complaint)
 * 3. Least Workload (CurrentActiveComplaints)
 * 4. Fallback: Pending Review
 */
export const autoAssignOfficer = async (complaint) => {
  try {
    console.log(`🤖 Attempting Auto-Assignment for Complaint: ${complaint.title}`);

    // 1. Find all officers in the relevant department
    // We normalize the search by making it case-insensitive
    // We make the search smarter by matching any part of the category (e.g., "Water" matches "Water Supply")
    const departmentPrefix = complaint.category.split(" ")[0]; // Take the first word
    const deptOfficers = await User.find({
      role: "Officer",
      $or: [
        { department: { $regex: new RegExp(complaint.category, "i") } },
        { department: { $regex: new RegExp(departmentPrefix, "i") } }
      ]
    });

    if (deptOfficers.length === 0) {
      console.warn("⚠️ No officers found for department:", complaint.category);
      return null;
    }

    // 2. Filter by Zone/Location if possible
    // We check if the officer's 'assignedArea' is mentioned in the complaint address
    let potentialOfficers = deptOfficers.filter(officer => {
      if (!officer.assignedArea) return true; // Officer handles all areas if not specified
      return complaint.location.address.toLowerCase().includes(officer.assignedArea.toLowerCase());
    });

    // If no zone match, fallback to all officers in that department
    if (potentialOfficers.length === 0) {
      potentialOfficers = deptOfficers;
    }

    // 3. Select the officer with the least workload
    // Sort by currentActiveComplaints ascending
    potentialOfficers.sort((a, b) => a.currentActiveComplaints - b.currentActiveComplaints);

    const bestOfficer = potentialOfficers[0];

    // 4. Update Database
    if (bestOfficer) {
      // Assign the officer to the complaint
      complaint.assignedTo = bestOfficer._id;
      complaint.assignedAt = new Date();
      complaint.status = "Assigned";
      await complaint.save();

      // Update Officer workload
      await User.findByIdAndUpdate(bestOfficer._id, {
        $inc: { currentActiveComplaints: 1 }
      });

      console.log(`✅ Assigned to Officer: ${bestOfficer.name} (Workload: ${bestOfficer.currentActiveComplaints})`);

      // 5. Send Notification to Officer
      try {
        await sendNotification({
          userId: bestOfficer._id,
          role: "Officer",
          message: `📩 New complaint assigned: ${complaint.title}`,
          type: "info",
          targetId: complaint._id
        });
      } catch (notifyErr) {
        console.error("Notification Error (Auto-Assign):", notifyErr);
      }

      return bestOfficer;
    }

    return null;
  } catch (error) {
    console.error("🔥 Auto-Assignment System Error:", error);
    return null;
  }
};
