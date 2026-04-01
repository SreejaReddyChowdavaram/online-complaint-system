import dbConnect from "../../lib/db.js";
import User from "../../models/User.js";
import { withAuth } from "../../lib/authMiddleware.js";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed. Use GET." });
  }

  try {
    await dbConnect();
    
    // req.user is already populated by withAuth
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({ success: true, data: user });

  } catch (error) {
    console.error("GET ME ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default withAuth(handler);
