import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "Admin") navigate("/admin/dashboard");
      else if (user?.role === "Officer") navigate("/officer/dashboard");
      else navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="landing-container">

      {/* Animated Background Circles */}
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>

      <motion.div
        className="landing-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >

        {/* Logo */}
        <motion.img
          src={logo}
          alt="Logo"
          className="landing-logo"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />

        {/* Title */}
        <motion.h1
          className="landing-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Civic Complaint Registering System
        </motion.h1>

        {/* Buttons */}
        <div className="landing-buttons">

          <motion.div whileHover={{ scale: 1.1 }}>
            <Link to="/login/user" className="role-btn citizen">
              Citizen
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }}>
            <Link to="/login/officer" className="role-btn officer">
              Officer
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }}>
            <Link to="/login/admin" className="role-btn admin">
              Admin
            </Link>
          </motion.div>

        </div>

        <p className="register-link">
          <Link to="/register">New user? Register here</Link>
        </p>

      </motion.div>
    </div>
  );
};

export default LandingPage;