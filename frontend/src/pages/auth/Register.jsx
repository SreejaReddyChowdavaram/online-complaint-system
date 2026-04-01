import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./Register.css";

const API_URL = "/api";

const Register = () => {
  const { t } = useTranslation();

  if (!t) return null;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  const { name, email, phone, password, role } = formData;

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !phone || !password || !role) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        phone,
        password,
        role,
      });

      if (role === "Citizen") window.location.href = "/login/user";
      else if (role === "Officer") window.location.href = "/login/officer";
      else if (role === "Admin") window.location.href = "/login/admin";

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        t("auth.registration_failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#020617] auth-wrapper overflow-hidden">
      
      {/* Background Glows (Aurora Effect) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <form className="auth-card" onSubmit={handleSubmit} autoComplete="off">
        {/* Autofill trap */}
        <input type="text" style={{ display: "none" }} />
        <input type="password" style={{ display: "none" }} />

        <h2 className="auth-title">{t("register.title")}</h2>

        {error && <p className="error-text">{String(error)}</p>}


        <input
          type="text"
          name="name"
          placeholder={t("register.name")}
          className="auth-input"
          value={name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder={t("auth.email")}
          className="auth-input"
          value={email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder={t("register.phone")}
          className="auth-input"
          value={phone}
          onChange={handleChange}
          required
        />

        {/* PASSWORD FIELD */}
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={t("auth.password")}
            className="auth-input"
            value={password}
            onChange={handleChange}
            required
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEye /> : <FiEyeOff />}
          </span>
        </div>

        {/* ROLE SELECT */}
        <select
          name="role"
          className="auth-input register-select"
          value={role}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            {t("register.select_role")}
          </option>
          <option value="Citizen">{t("roles.citizen")}</option>
          <option value="Officer">{t("roles.officer")}</option>
          <option value="Admin">{t("roles.admin")}</option>
        </select>

        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? t("register.registering") : t("register.title")}
        </button>

        <p className="auth-footer">
          {t("auth.already_have_account")}{" "}
          <Link to="/landing">{t("auth.login")}</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;