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
  Moon,
  Menu,
  X
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const langRef = useRef(null);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) setIsLangOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) setIsMobileMenuOpen(false);
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

        {/* RIGHT: Desktop Controls */}
        <div className="navbar-controls-wrapper">
          <div className="navbar-controls desktop-only">
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
                <span className="label text-slate-700 dark:text-slate-200">{currentLangLabel}</span>
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
                    {user?.avatar ? (
                      <img src={`/uploads/${user.avatar}`} alt="Avatar" />
                    ) : (
                      <span>{user?.name?.[0]?.toUpperCase() || "U"}</span>
                    )}
                  </div>
                  <div className="profile-info">
                    <span className="name">{user?.name || "User"}</span>
                    <span className="role">{user?.role?.toUpperCase() || "CITIZEN"}</span>
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
                        <LogOut size={18} /> {t("navbar.logout")}
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

          {/* Hamburger Menu Icon */}
          <button 
            className="hamburger-menu mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              className="mobile-drawer bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              ref={mobileMenuRef}
            >
              <div className="drawer-header border-b border-slate-100 dark:border-slate-800">
                <Logo size="sm" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="close-drawer-btn">
                  <X size={24} />
                </button>
              </div>

              <div className="drawer-content p-6 space-y-8">
                {/* User Info Section */}
                {token && user ? (
                  <div className="drawer-user-info flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <div className="avatar-large w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold">
                       {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="font-black text-slate-800 dark:text-white">{user.name}</div>
                      <div className="text-xs font-bold text-blue-500 uppercase tracking-tighter">{user.role}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link to="/login" className="drawer-primary-btn flex items-center justify-center py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                    <Link to="/register" className="drawer-secondary-btn flex items-center justify-center py-4 border border-blue-600/20 text-blue-600 rounded-2xl font-black uppercase tracking-widest text-xs" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="drawer-nav flex flex-col gap-2">
                  <Link to="/" className="drawer-link" onClick={() => setIsMobileMenuOpen(false)}>{t("common.home") || "Home"}</Link>
                  <Link to="/landing" className="drawer-link" onClick={() => setIsMobileMenuOpen(false)}>Access Portals</Link>
                  {token && user && (
                    <Link to={user.role === 'Officer' ? "/officer/profile" : "/dashboard/profile"} className="drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
                      {t("sidebar.my_profile")}
                    </Link>
                  )}
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                {/* Controls Section */}
                <div className="drawer-controls space-y-4">
                   <div className="flex items-center justify-between">
                     <span className="text-sm font-bold text-slate-500">Theme</span>
                     <button 
                       className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl"
                       onClick={toggleTheme}
                     >
                        {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
                     </button>
                   </div>

                   <div className="language-selector-mobile">
                     <div className="text-sm font-bold text-slate-500 mb-3">Language</div>
                     <div className="grid grid-cols-2 gap-2">
                       {languages.map(lang => (
                         <button 
                           key={lang.code}
                           className={`p-3 rounded-xl border text-sm font-bold transition-all ${i18n.language === lang.code ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-transparent border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}
                           onClick={() => changeLanguage(lang.code)}
                         >
                           {lang.label}
                         </button>
                       ))}
                     </div>
                   </div>
                </div>

                {token && (
                  <button onClick={handleLogout} className="drawer-logout-btn w-full mt-8 p-4 bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-400 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest">
                    <LogOut size={18} /> {t("navbar.logout")}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;