import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";

const API_URL = "/api";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

/**
 * 🔹 HELPER: Safe Error Extraction
 * Ensures we never try to render a raw object in JSX.
 */
const getErrorMessage = (err, fallback = "An unexpected error occurred") => {
  try {
    console.error("🔍 [Login Debug] Raw Error:", err);
    
    if (typeof err === "string") return err;
    if (!err) return String(fallback);
    
    let result = fallback;
    
    // Axios response structure
    if (err.response?.data) {
      const data = err.response.data;
      result = data.message || data.error || (typeof data === "string" ? data : data);
    } else if (err.message) {
      result = err.message;
    } else {
      result = err;
    }

    // FINAL GUARD: If result is still an object, stringify it
    return typeof result === "object" ? JSON.stringify(result) : String(result);
  } catch (e) {
    return String(fallback);
  }
};

function Login({ title, role = "Citizen" }) {
  const { t } = useTranslation();

  if (!t) return null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Admins use /admin-login, others use /login (if they still use email/pass)
      const endpoint = role === "Admin" ? `${API_URL}/auth/admin-login` : `${API_URL}/auth/login`;

      const res = await axios.post(endpoint, {
        email,
        password,
        role,
      });

      const { token, user } = res.data;
      login(token, user);

      // Redirect based on role
      if (user.role === "Admin") navigate("/admin/dashboard");
      else if (user.role === "Officer") navigate("/officer/dashboard");
      else navigate("/dashboard");

    } catch (err) {
      setError(getErrorMessage(err, t("auth.login_failed")));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/auth/google`, {
        token: response.credential,
        role: role // Send the role we are logging in as
      });

      const { token, user } = res.data;
      login(token, user);

      if (user.role === "Admin") navigate("/admin/dashboard");
      else if (user.role === "Officer") navigate("/officer/dashboard");
      else navigate("/dashboard");

    } catch (err) {
      setError(getErrorMessage(err, "Google Login Failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google Login Failed");
  };

  const isAdmin = role === "Admin";

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#020617] auth-wrapper overflow-hidden">
      
      {/* Background Glows (Aurora Effect) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="auth-card">
        <h2 className="auth-title">{String(title || t("auth.login"))}</h2>

        {error && <p className="error-text">{String(error)}</p>}

        {/* --- 📧 EMAIL/PASSWORD FORM (TOP) --- */}
        <form onSubmit={handleSubmit} style={{ display: "contents" }}>
          <input
            type="email"
            placeholder={t("auth.email")}
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.password")}
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </span>
          </div>

          <p className="forgot">
            <a href="/forgot-password">{t("auth.forgot_password")}</a>
          </p>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? t("auth.logging_in") : t("auth.login")}
          </button>
        </form>

        {/* --- 🌐 GOOGLE LOGIN & DIVIDER (CITIZEN & OFFICER) --- */}
        {!isAdmin && (
          <>
            <div className="divider">
              <span>OR</span>
            </div>

            <div className="google-login-container">
              {GOOGLE_CLIENT_ID ? (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_blue"
                  size="large"
                  text="signin_with"
                  shape="pill"
                  width="100%"
                />
              ) : (
                <div className="google-not-config bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-amber-500 text-xs text-center">
                  Google Login Not Configured (Missing ID)
                </div>
              )}
            </div>

            <p className="auth-info-text" style={{ marginTop: "20px", opacity: 0.7, fontSize: "0.9rem" }}>
              {role === "Officer"
                ? "Official system assistant for officer operations."
                : "Safe and secure login using your Google account."}
            </p>
          </>
        )}

        {/* Footer: Register link for all roles as per user request */}
        <p className="auth-footer">
          {t("auth.dont_have_account")}{" "}
          <Link to="/register">{t("auth.register")}</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;