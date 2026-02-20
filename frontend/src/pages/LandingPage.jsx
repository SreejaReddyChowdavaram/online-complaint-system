import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // 🔁 Redirect logged-in users based on role
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "Admin") {
        navigate("/admin/dashboard");
      } else if (user?.role === "Officer") {
        navigate("/officer/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="landing-container">
      <motion.div
        className="landing-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
       
 
        {/* Logo */}
        <img
          src={logo}
          alt="Jan Suvidha Logo"
          className="landing-logo"
        />

        {/* Title */}
        <h1 className="landing-title">Civic Complaint Registring System</h1>
       

        {/* 🔐 ROLE-BASED LOGIN BUTTONS */}
        <div className="landing-buttons">
  <Link to="/login/user" className="role-btn">Citizen</Link>
  <Link to="/login/officer" className="role-btn">Officer</Link>
  <Link to="/login/admin" className="role-btn">Admin</Link>
</div>

{/* ✅ REGISTER LINK */}
<div style={{ marginTop: "20px", textAlign: "center" }}>
  <Link to="/register" style={{ color: "#2563eb", fontWeight: "500" }}>
    New user? Register here
  </Link>
</div>

      </motion.div>
    </div>
  );
};

export default LandingPage;
