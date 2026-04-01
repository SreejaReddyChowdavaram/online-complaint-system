// backend/controllers/authController.js


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
    console.log(`🔑 Login attempt for: ${email} (Role: ${role})`);

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return res.status(400).json({ message: "User not found" });
    }

    if (user.role !== role) {
      console.log(`❌ Role mismatch for ${email}: Expected ${role}, but user is ${user.role}`);
      return res.status(403).json({ message: "Incorrect role login" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log(`❌ Invalid password for ${email}`);
      return res.status(400).json({ message: "Invalid password" });
    }

    console.log(`✅ Login successful for: ${email}`);

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
/* ===============================
   GOOGLE LOGIN
================================ */
export const googleLogin = async (req, res) => {
  try {
    const { token, role: requestedRole } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, picture, sub: googleId } = payload;

    // ⛔ ADMINS CANNOT USE GOOGLE LOGIN
    if (requestedRole === "Admin") {
      return res.status(403).json({ message: "Administrators must login with email and password." });
    }

    // 👮 OFFICER VALIDATION (REMOVED AS PER USER REQUEST)
    /*
    if (requestedRole === "Officer") {
      const allowedOfficers = process.env.ALLOWED_OFFICER_EMAILS
        ? process.env.ALLOWED_OFFICER_EMAILS.split(",").map(e => e.trim().toLowerCase())
        : [];

      if (!allowedOfficers.includes(email.toLowerCase())) {
        return res.status(403).json({ message: "Authorized officer email not found. Please contact administration." });
      }
    }
    */

    let user = await User.findOne({ email });

    if (user) {
      // If an existing Admin tries to use Google login (regardless of requestedRole)
      if (user.role === "Admin") {
        return res.status(403).json({ message: "This account is registered as Admin. Please use password login." });
      }

      // Preserve existing role unless it's a new Officer-whitelisted login
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePic = picture;
        user.avatar = picture;
        if (requestedRole === "Officer") user.role = "Officer";
        await user.save();
      }
    } else {
      // Create new user (Citizen/Officer)
      user = await User.create({
        name,
        email,
        googleId,
        profilePic: picture,
        avatar: picture,
        role: requestedRole === "Officer" ? "Officer" : "Citizen"
      });
    }

    const jwtToken = generateToken(user);
    res.status(200).json({
      message: "Google login successful",
      token: jwtToken,
      user
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: `Google authentication failed: ${error.message}` });
  }
};

/* ===============================
   ADMIN LOGIN (EMAIL + PASSWORD)
================================ */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.role !== "Admin") {
      return res.status(401).json({ message: "Unauthorized. Admin access only." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = generateToken(user);
    res.json({
      message: "Admin login successful",
      token,
      user
    });

  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Server error during admin login" });
  }
};
