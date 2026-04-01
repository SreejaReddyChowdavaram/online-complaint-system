import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { 
  Globe, 
  UserCircle, 
  Settings, 
  LogOut, 
  ChevronDown,
  HelpCircle,
  Sun,
  Moon
} from "lucide-react";
import Logo from "./Logo";
import NotificationBell from "./NotificationBell";
import "./Navbar.css";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, token, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const langRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) setIsLangOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    setIsLangOpen(false);
  };

  const languages = [
    { code: "en", label: "English" },
    { code: "te", label: "తెలుగు" },
    { code: "hi", label: "हिन्दी" }
  ];

  const currentLangLabel = languages.find(l => l.code === i18n.language)?.label || "English";

  if (!t) return null;

  return (
    <motion.nav
      className="gov-navbar bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border transition-all duration-300 shadow-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="navbar-container">
        {/* LEFT: Logo & System Name */}
        <Link to="/" className="navbar-brand">
          <Logo size="sm" showText={false} />
          <div className="brand-text">
            <span className="main-title">{t("navbar.title")}</span>
          </div>
        </Link>

        {/* RIGHT: Strict Order Controls */}
        <div className="navbar-controls">
          {/* Theme Toggle */}
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-glow-blue transition-all duration-300" 
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
          </button>

          {/* 1. Language Selector */}
          <div className="control-item language-selector-v2" ref={langRef}>
            <button className="control-btn" onClick={() => setIsLangOpen(!isLangOpen)}>
              <Globe size={18} className="icon-blue" />
              <span className="label">{currentLangLabel}</span>
              <ChevronDown size={14} className="chevron" />
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <motion.div 
                  className="gov-dropdown"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  {languages.map(lang => (
                    <button 
                      key={lang.code} 
                      className={`dropdown-item ${i18n.language === lang.code ? 'active' : ''}`}
                      onClick={() => changeLanguage(lang.code)}
                    >
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. Notifications Bell */}
          <div className="control-item notification-bell-wrapper">
            <NotificationBell />
          </div>

          {/* 3. User Profile (Name + Role) */}
          {token && user && (
            <div className="control-item profile-selector" ref={profileRef}>
              <button className="profile-btn" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <div className="avatar-small">
                  {user.avatar ? (
                    <img src={`/uploads/${user.avatar}`} alt="Avatar" />
                  ) : (
                    <span>{user.name?.[0]?.toUpperCase()}</span>
                  )}
                </div>
                <div className="profile-info">
                  <span className="name">{user.name}</span>
                  <span className="role">{user.role?.toUpperCase()}</span>
                </div>
                <ChevronDown size={14} className="chevron" />
              </button>
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    className="gov-dropdown profile-dropdown"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <Link to={user.role === 'Officer' ? "/officer/profile" : "/dashboard/profile"} className="dropdown-item">
                      <UserCircle size={18} /> {t("sidebar.my_profile")}
                    </Link>
                    <button className="dropdown-item lang-toggle-mobile" onClick={() => setIsLangOpen(true)}>
                      <Globe size={18} /> Change Language
                    </button>
                    <hr />
                    <button onClick={handleLogout} className="dropdown-item logout-link">
                      <LogOut size={18} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* 4. Logout (Strict Order far right) */}
          <button onClick={handleLogout} className="gov-logout-btn">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;