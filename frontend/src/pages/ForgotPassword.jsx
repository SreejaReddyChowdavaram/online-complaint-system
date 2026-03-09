import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const API_URL = "http://localhost:5000/api";

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------- SEND OTP ---------- */

  const sendOTP = async () => {
    try {

      setLoading(true);

      const res = await axios.post(`${API_URL}/auth/send-otp`, {
        email
      });

      setMessage(res.data.message || "OTP sent successfully");
      setStep(2);

    } catch (err) {

      setMessage(
        err.response?.data?.message || "Error sending OTP"
      );

    } finally {
      setLoading(false);
    }
  };

  /* ---------- VERIFY OTP ---------- */

  const verifyOTP = async () => {
    try {

      setLoading(true);

      const res = await axios.post(`${API_URL}/auth/verify-otp`, {
        email,
        otp
      });

      setMessage(res.data.message || "OTP verified");
      setStep(3);

    } catch (err) {

      setMessage(
        err.response?.data?.message || "Invalid OTP"
      );

    } finally {
      setLoading(false);
    }
  };

  /* ---------- RESET PASSWORD ---------- */

const resetPassword = async () => {
  try {

    const res = await axios.post(`${API_URL}/auth/reset-password`, {
      email,
      newPassword
    });

    setMessage(res.data.message);

    const role = res.data.role;

    setTimeout(() => {

      if (role === "Admin") {
        navigate("/login/admin");
      }
      else if (role === "Officer") {
        navigate("/login/officer");
      }
      else {
        navigate("/login/user");
      }

    }, 2000);

  } catch (err) {
    setMessage("Password reset failed");
  }
};
  return (

    <div className="auth-wrapper">

      {/* floating lights */}
      <div className="light light1"></div>
      <div className="light light2"></div>
      <div className="light light3"></div>
      <div className="light light4"></div>

      <div className="auth-card">

        <h2>Forgot Password</h2>

        {message && <p className="message">{message}</p>}

        {/* STEP 1 - EMAIL */}

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter Email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              className="auth-btn"
              onClick={sendOTP}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 - OTP */}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="auth-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <button
              className="auth-btn"
              onClick={verifyOTP}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* STEP 3 - NEW PASSWORD */}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="Enter New Password"
              className="auth-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button
              className="auth-btn"
              onClick={resetPassword}
              disabled={loading}
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </>
        )}

      </div>
    </div>
  );
}