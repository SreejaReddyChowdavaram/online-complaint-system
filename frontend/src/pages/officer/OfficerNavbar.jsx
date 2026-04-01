import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Bell, Menu, X, Sun, Moon, Globe, ChevronDown } from "lucide-react";
import NotificationDropdown from "../../components/NotificationDropdown";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const OfficerNavbar = ({ onMenuClick, isSidebarOpen }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) setIsLangOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: "en", label: "English" },
    { code: "te", label: "తెలుగు" },
    { code: "hi", label: "हिन्दी" }
  ];

  const currentLangLabel = languages.find(l => l.code === i18n.language)?.label || "English";

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    setIsLangOpen(false);
  };

  const getRoleLabel = (role) => {
    switch (role?.toLowerCase()) {
      case "citizen": return "Citizen Portal";
      case "officer": return "Officer Portal";
      case "admin": return "Admin Portal";
      default: return "";
    }
  };

  return (
    <header className="flex justify-between items-center px-6 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="flex items-center gap-6">
        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* BRANDING */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
          <div className="flex flex-col">
            <span className="text-gray-800 dark:text-white font-semibold whitespace-nowrap leading-none">
              Online Complaint System
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider mt-1">
              Officer Portal
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button
            className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-glow-blue transition-all duration-300 text-xs md:text-sm font-semibold"
            onClick={() => setIsLangOpen(!isLangOpen)}
          >
            <Globe size={18} className="text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:block">{currentLangLabel}</span>
            <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isLangOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-light-border dark:border-dark-border rounded-xl shadow-xl z-50 overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${i18n.language === lang.code ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-600 dark:text-slate-300'
                      }`}
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
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-glow-blue transition-all duration-300"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
        </button>

        {/* Notifications Icon */}
        <NotificationDropdown />

        {/* User Info / Profile */}
        <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800 dark:text-white leading-none">{user?.name}</p>
            <p className="text-[10px] text-emerald-500 dark:text-emerald-400 font-semibold uppercase mt-1 tracking-wider italic">Officer</p>
          </div>
          <div className="h-10 w-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 ring-2 ring-white dark:ring-gray-900 overflow-hidden">
            {user?.name?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default OfficerNavbar;
