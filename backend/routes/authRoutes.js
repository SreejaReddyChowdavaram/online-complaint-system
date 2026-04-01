import express from "express";
import {
  registerUser,
  loginUser,
  googleLogin,
  adminLogin,
  forgotPassword,
  verifyOtp,
  resetPassword
} from "../controllers/authController.js";

const router = express.Router();

/* -------- AUTH -------- */
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/admin-login", adminLogin);

/* -------- FORGOT PASSWORD FLOW -------- */
router.post("/send-otp", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;