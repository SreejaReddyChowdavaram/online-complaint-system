// backend/controllers/authController.js


import { generateToken } from "../services/authService.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";

/* =========================
   1️⃣ SEND OTP
========================= */
export const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    // check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Email not registered"
      });
    }

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // save OTP in database
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    // send email
    await sendEmail(
      email,
      "Jan Suvidha Password Reset OTP",
      `
Your OTP for resetting password is: ${otp}

This OTP is valid for 5 minutes.

If you didn't request this, please ignore this email.
`
    );

    res.status(200).json({
      message: "OTP sent to registered email"
    });

  } catch (error) {

    console.error("Forgot Password Error:", error);

    res.status(500).json({
      message: "Error sending OTP"
    });

  }
};
/* =========================
   2️⃣ VERIFY OTP
========================= */
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (
    !user ||
    user.otp !== otp ||
    user.otpExpiry < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  res.json({ message: "OTP verified successfully" });
};

/* =========================
   3️⃣ RESET PASSWORD
========================= */
export const resetPassword = async (req, res) => {

  try {

    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({
      message: "Password reset successful",
      role: user.role   // ⭐ send role to frontend
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};
/* ===============================
   REGISTER USER
================================ */
export const registerUser = async (req, res) => {

  try {

    const { name, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "Citizen"
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "Registration successful",
      token,
      user
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};
/* ===============================
   LOGIN USER
================================ */
export const loginUser = async (req, res) => {

  try {

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

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};