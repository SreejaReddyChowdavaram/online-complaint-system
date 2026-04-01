import dbConnect from "../../lib/db.js";
import User from "../../models/User.js";
import { withAuth } from "../../lib/authMiddleware.js";

const handler = async (req, res) => {
  try {
    await dbConnect();

    if (req.method === "GET") {
      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .lean();
      return res.status(200).json(users);
    }

    if (req.method === "PUT") {
      const { id, role } = req.body;
      const allowedRoles = ["Citizen", "Officer", "Admin"];

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role specified" });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.role = role;
      await user.save();

      return res.status(200).json({ success: true, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ success: true, message: "User deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default withAuth(handler, ["Admin"]);
