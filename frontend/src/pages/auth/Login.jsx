import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";

const API_URL = "/api";

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
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        t("auth.login_failed")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/auth/google-login`, {
        token: response.credential,
        role: role // Send the role we are logging in as
      });

      const { token, user } = res.data;
      login(token, user);

      if (user.role === "Admin") navigate("/admin/dashboard");
      else if (user.role === "Officer") navigate("/officer/dashboard");
      else navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Google Login Failed");
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
        <h2 className="auth-title">{title || t("auth.login")}</h2>

        {error && <p className="error-text">{error}</p>}

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
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_blue"
                size="large"
                text="signin_with"
                shape="pill"
                width="100%"
              />
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