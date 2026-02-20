import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./Register.css";

const API_URL = "http://localhost:5000/api";

const Register = () => {
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

      // ROLE BASED REDIRECT
      if (role === "Citizen") window.location.href = "/login/user";
      else if (role === "Officer") window.location.href = "/login/officer";
      else if (role === "Admin") window.location.href = "/login/admin";
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} autoComplete="off">
        {/* Autofill trap */}
        <input type="text" style={{ display: "none" }} />
        <input type="password" style={{ display: "none" }} />

        <h2 className="auth-title">Register</h2>

        {error && <p className="error-text">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="auth-input"
          value={name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="auth-input"
          value={email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="auth-input"
          value={phone}
          onChange={handleChange}
          required
        />

        {/* PASSWORD WITH EYE ICON */}
     <div className="password-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
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

       <select
  name="role"
  className="auth-input register-select"
  value={role}
  onChange={handleChange}
  required
>
  <option value="" disabled>
    Select Role
  </option>
  <option value="Citizen">Citizen</option>
  <option value="Officer">Officer</option>
  <option value="Admin">Admin</option>
</select>


        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
