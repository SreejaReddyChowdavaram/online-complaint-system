import connectDB from "../config/database.js"; // ✅ ADD THIS
import { generateToken } from "../services/authService.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


/* =========================
   REGISTER USER
========================= */
export const registerUser = async (req, res) => {
  try {
    await connectDB();
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "local",
      role: role || "Citizen",
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   1️⃣ SEND OTP
========================= */
export const forgotPassword = async (req, res) => {
  try {
    await connectDB();

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    // ✅ PROFESSIONAL EMAIL
    const result = await sendEmail(
      email,
      "🔐 Reset Your Password - Online Civic Complaint System",
      `
        <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
          <div style="max-width:500px; margin:auto; background:#ffffff; border-radius:10px; padding:25px; text-align:center;">
            
            <h2 style="color:#2c3e50;">Online Civic Complaint System</h2>
            <p style="color:#555;">Password Reset Request</p>

            <p style="color:#666;">
              We received a request to reset your password.
            </p>

            <p style="color:#666;">Use the OTP below:</p>

            <div style="
              font-size:32px;
              font-weight:bold;
              letter-spacing:5px;
              color:#4CAF50;
              margin:20px 0;
            ">
              ${otp}
            </div>

            <p style="color:#888;">
              This OTP is valid for <b>5 minutes</b>.
            </p>

            <p style="color:#aaa; font-size:12px;">
              If you didn’t request this, please ignore this email.
            </p>

            <hr style="margin:20px 0;" />

            <p style="font-size:12px; color:#bbb;">
              © ${new Date().getFullYear()} Online Civic Complaint System
            </p>

          </div>
        </div>
      `
    );

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
        error: result.error,
      });
    }

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: error.message });
  }
};
/* =========================
   2️⃣ VERIFY OTP
========================= */
export const verifyOtp = async (req, res) => {
  try {
    await connectDB();
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   3️⃣ RESET PASSWORD
========================= */
export const resetPassword = async (req, res) => {
  try {
    await connectDB();
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful", role: user.role });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
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

    if (!user.password) {
      return res.status(400).json({ message: "This account uses Google Sign-In. Please use Google login." });
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

/* =========================
   ADMIN LOGIN
========================= */
export const adminLogin = async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Admin not found" });
    }

    if (user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    if (!user.password) {
      return res.status(400).json({ message: "This admin account uses a different login method. Please check your credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      message: "Admin login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GOOGLE LOGIN
================================ */
export const googleLogin = async (req, res) => {
  try {
    await connectDB(); // 🔥 FIX

    const { token, credential, role } = req.body;
    const idToken = token || credential;

    if (!idToken) {
      return res.status(400).json({ message: "No Google ID token provided." });
    }

    const ticket = await client.verifyIdToken({
      idToken: idToken,
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
        provider: "google",
        password: null, // Explicitly set password to null
        profilePic: picture,
        avatar: picture,
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

/* ===============================
   SET PASSWORD (for Google Users)
================================ */
export const setPassword = async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Once password is set, we still keep provider as "google" or update it?
    // The requirement says "Allow Google users to set password later".
    // We'll keep the provider as is or just ensure it can log in with either.

    await user.save();

    res.status(200).json({ message: "Password set successfully. You can now log in with email and password." });
  } catch (error) {
    console.error("SET PASSWORD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};