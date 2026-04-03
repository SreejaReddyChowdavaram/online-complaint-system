import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Globe, 
  UserCircle, 
  LogOut, 
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import NotificationDropdown from "./NotificationDropdown";

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
    setIsMobileMenuOpen(false);
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

  const getRoleLabel = (role) => {
    switch (role?.toLowerCase()) {
      case "citizen": return "Citizen Portal";
      case "officer": return "Officer Portal";
      case "admin": return "Admin Portal";
      default: return "Complaints Portal";
    }
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-8 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-all duration-300"
    >
      {/* LEFT: Branding */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 sm:h-9 sm:w-9 object-contain" />
          <div className="flex flex-col">
            <span className="text-slate-800 dark:text-white font-black text-sm sm:text-lg whitespace-nowrap leading-none tracking-tight">
              Online Complaint System
            </span>
            <span className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mt-1">
              {token && user ? getRoleLabel(user.role) : "Complaints System"}
            </span>
          </div>
        </Link>
      </div>

      {/* RIGHT: Desktop Controls */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 text-xs font-bold border border-slate-100 dark:border-slate-700 shadow-sm"
            onClick={() => setIsLangOpen(!isLangOpen)}
          >
            <Globe size={18} className="text-blue-600 dark:text-blue-400" />
            <span>{currentLangLabel}</span>
            <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isLangOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden py-1"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
              >
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-800 ${i18n.language === lang.code ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20' : 'text-slate-600 dark:text-slate-400'}`}
                    onClick={() => changeLanguage(lang.code)}
                  >
                    {lang.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <button
          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg transition-all duration-300 border border-slate-100 dark:border-slate-700 shadow-sm"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />}
        </button>

        {/* Notifications */}
        {token && <NotificationDropdown />}

        {/* Auth / Profile Area */}
        {token && user ? (
          <div className="relative pl-4 border-l border-slate-100 dark:border-slate-800" ref={profileRef}>
            <button 
              className="flex items-center gap-3 hover:opacity-80 transition-all"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider italic">{user.role}</p>
              </div>
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-blue-500/20 ring-2 ring-white dark:ring-slate-900">
                {user.name?.charAt(0)}
              </div>
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden py-2"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                >
                  <Link 
                    to={user.role === 'Officer' ? "/officer/dashboard" : user.role === 'Admin' ? "/admin/dashboard" : "/dashboard"} 
                    className="flex items-center gap-3 px-5 py-3 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <UserCircle size={18} className="text-blue-600" />
                    Enter Portal
                  </Link>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 mx-3 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-left"
                  >
                    <LogOut size={18} />
                    Logout Account
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-3 pl-4 border-l border-slate-100 dark:border-slate-800">
            <Link to="/login" className="px-5 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-all">Login</Link>
            <Link to="/register" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 transition-all active:scale-95 uppercase tracking-widest border border-blue-700">Register</Link>
          </div>
        )}
      </div>

      {/* MOBILE: Toggle */}
      <button 
        className="lg:hidden p-2 text-slate-600 dark:text-slate-400"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu size={28} />
      </button>

      {/* MOBILE: Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[70] w-full max-w-[300px] bg-white dark:bg-slate-900 shadow-2xl lg:hidden flex flex-col pt-20"
            >
              <button 
                className="absolute top-4 right-4 p-2 text-slate-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={32} />
              </button>

              <div className="flex-1 overflow-y-auto px-6 space-y-8 pb-10">
                {token && user ? (
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-xl shadow-blue-500/20">
                        {user.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 dark:text-white leading-none">{user.name}</p>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">{user.role}</p>
                      </div>
                    </div>
                    <Link 
                      to={user.role === 'Officer' ? "/officer/dashboard" : user.role === 'Admin' ? "/admin/dashboard" : "/dashboard"}
                      className="block w-full py-4 bg-white dark:bg-slate-800 text-center rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-white border border-slate-100 dark:border-slate-700 shadow-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Enter Portal
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link to="/login" className="block w-full py-4 text-center text-sm font-bold text-slate-600 dark:text-slate-400" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                    <Link to="/register" className="block w-full py-4 bg-blue-600 text-white text-center rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/25" onClick={() => setIsMobileMenuOpen(false)}>Create Account</Link>
                  </div>
                )}

                <div className="space-y-6 pt-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 font-sans">Preferences</p>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Appearance</span>
                      <button className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm" onClick={toggleTheme}>
                        {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 font-sans">Language Settings</p>
                    <div className="grid grid-cols-2 gap-2">
                       {languages.map(lang => (
                         <button 
                           key={lang.code}
                           className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all border ${i18n.language === lang.code ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-transparent hover:border-slate-200'}`}
                           onClick={() => changeLanguage(lang.code)}
                         >
                           {lang.label}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>

                {token && (
                  <button 
                    onClick={handleLogout}
                    className="w-full mt-10 py-5 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-3xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-sm border border-red-100 dark:border-red-900/30"
                  >
                    <LogOut size={20} />
                    Sign Out Account
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