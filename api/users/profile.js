import dbConnect from "../../lib/db.js";
import User from "../../models/User.js";
import { withAuth } from "../../lib/authMiddleware.js";

const handler = async (req, res) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed. Use PUT." });
  }

  try {
    const { name, email, phone, mobile, department } = req.body;
    
    await dbConnect();
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: "Email already in use." });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (mobile) user.mobile = mobile;
    if (department) user.department = department;

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({ success: true, data: userObj });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default withAuth(handler);
