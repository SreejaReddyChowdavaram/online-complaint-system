import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import "./Navbar.css";

const Navbar = () => {
  const { user, token, logout } = useAuth(); // ✅ FIXED
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="navbar-content">

        {/* LEFT : LOGO */}
        <Link to="/" className="navbar-brand">
          <Logo size="md" showText={false} />
          <span className="navbar-title">
  Civic Complaint Registring System
</span>

        </Link>

        {/* RIGHT : USER INFO */}
        {token && user && (   /* ✅ FIXED CONDITION */
          <div className="navbar-user">
            <span className="user-name">{user.name}</span>
            <span className="user-role">({user.role})</span>

            <button
              onClick={handleLogout}
              className="btn btn-outline btn-sm"
            >
              Logout
            </button>
          </div>
        )}

      </div>
    </motion.nav>
  );
};

export default Navbar;
