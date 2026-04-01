import dbConnect from "../../lib/db.js";
import Notification from "../../models/Notification.js";
import { withAuth } from "../../lib/authMiddleware.js";

const handler = async (req, res) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed. Use PUT." });
  }

  const { id } = req.query;

  try {
    await dbConnect();

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found or access denied." });
    }

    return res.status(200).json({ success: true, notification });

  } catch (error) {
    console.error("MARK READ ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default withAuth(handler);
