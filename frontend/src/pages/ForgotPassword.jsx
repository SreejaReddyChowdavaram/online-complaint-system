import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./ForgotPassword.css";


export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!t) return null;

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  /* ---------- SEND OTP ---------- */
  const sendOTP = async () => {
    try {
      setLoading(true);
      setMessage("");
      setIsError(false);
      const res = await api.post("/auth/send-otp", { email });
      setMessage(res.data.message || "OTP sent successfully");
      setStep(2);
      setResendTimer(60);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- VERIFY OTP ---------- */
  const verifyOTP = async () => {
    try {
      setLoading(true);
      setMessage("");
      setIsError(false);
      const res = await api.post("/auth/verify-otp", { email, otp });
      setMessage(res.data.message || "OTP verified");
      setStep(3);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RESET PASSWORD ---------- */
  const resetPassword = async () => {
    try {
      setLoading(true);
      setMessage("");
      setIsError(false);
      const res = await api.post("/auth/reset-password", { email, newPassword });
      setMessage(res.data.message);
      setIsError(false);
      
      const role = res.data.role;
      setTimeout(() => {
        if (role === "Admin") navigate("/login/admin");
        else if (role === "Officer") navigate("/login/officer");
        else navigate("/login/user");
      }, 2000);
    } catch (err) {
      setIsError(true);
      setMessage("Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Animated Background Circles matching LandingPage */}
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>

      <div className="auth-card">
        {step === 1 && (
          <>
            <h2 className="auth-title">Forgot Password</h2>
            <p className="auth-subtitle">Recover your online complaint account</p>
            
            {message && <div className={`message ${isError ? 'error' : 'success'}`}>{String(message)}</div>}

            <input
              type="email"
              placeholder={t("auth.email", "Email")}
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <div className="auth-actions right-only">
              <button className="auth-btn" onClick={sendOTP} disabled={loading}>
                {loading ? t("forgot_password.sending", "Sending...") : "Send OTP"}
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="auth-title">Verify it's you</h2>
            <p className="auth-subtitle">
              An email with a verification code was just sent to <strong>{email}</strong>
            </p>

            {message && <div className={`message ${isError ? 'error' : 'success'}`}>{String(message)}</div>}

            <input
              type="text"
              placeholder="Enter code"
              className="auth-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <div className="auth-actions">
              <button 
                className="auth-btn-text" 
                onClick={sendOTP} 
                disabled={loading || resendTimer > 0}
              >
                {resendTimer > 0 ? `Resend code (${resendTimer}s)` : "Resend code"}
              </button>
              <button className="auth-btn" onClick={verifyOTP} disabled={loading}>
                {loading ? t("forgot_password.verifying", "Verifying...") : "Next"}
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="auth-title">Reset password</h2>
            <p className="auth-subtitle">
              Create a strong, new password that you don't use for other websites.
            </p>

            {message && <div className={`message ${isError ? 'error' : 'success'}`}>{String(message)}</div>}

            <input
              type="password"
              placeholder="Create password"
              className="auth-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <div className="auth-actions right-only">
              <button className="auth-btn" onClick={resetPassword} disabled={loading}>
                {loading ? t("forgot_password.updating", "Updating...") : "Save password"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}