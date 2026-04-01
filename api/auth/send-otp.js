import dbConnect from "../../lib/db.js";
import User from "../../models/User.js";
import sendEmail from "../../utils/sendEmail.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed. Use POST." });
  }

  try {
    await dbConnect();
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail(
      email,
      "Jan Suvidha Password Reset OTP",
      `Your OTP is: ${otp}`
    );

    return res.status(200).json({ success: true, message: "OTP sent" });

  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
