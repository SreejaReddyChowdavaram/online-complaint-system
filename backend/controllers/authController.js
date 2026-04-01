import connectDB from "../config/database.js"; // ✅ ADD THIS
import { generateToken } from "../services/authService.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* =========================
   1️⃣ SEND OTP
========================= */
export const forgotPassword = async (req, res) => {
  try {
    await connectDB(); // 🔥 IMPORTANT

    const { email } = req.body;

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

    res.status(200).json({ message: "OTP sent" });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   LOGIN USER
========================= */
export const loginUser = async (req, res) => {
  try {
    await connectDB(); // 🔥 FIX

    const { email, password, role } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: "Incorrect role login" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GOOGLE LOGIN
================================ */
export const googleLogin = async (req, res) => {
  try {
    await connectDB(); // 🔥 FIX

    const { token, role } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, picture, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        profilePic: picture,
        role: role || "Citizen"
      });
    }

    const jwtToken = generateToken(user);

    res.json({
      message: "Google login success",
      token: jwtToken,
      user
    });

  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};