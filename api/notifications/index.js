import dbConnect from "../../lib/db.js";
import Notification from "../../models/Notification.js";
import { withAuth } from "../../lib/authMiddleware.js";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    // Fetch notifications for the authenticated user and their specific role
    const notifications = await Notification.find({
      userId: req.user._id,
      role: req.user.role,
    }).sort({ createdAt: -1 });

    return res.status(200).json(notifications);

  } catch (error) {
    console.error("NOTIFICATIONS ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default withAuth(handler);
