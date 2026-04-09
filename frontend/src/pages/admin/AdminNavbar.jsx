import React from "react";
import { useTranslation } from "react-i18next";
import { Bell, Menu, X, Sun, Moon, Globe, ChevronDown } from "lucide-react";
import NotificationDropdown from "../../components/NotificationDropdown";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const AdminNavbar = ({ onToggle, isSidebarOpen }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const langRef = React.useRef(null);

  React.useEffect(() => {
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

  return (
    <header className="flex justify-between items-center px-4 sm:px-6 h-14 sm:h-16 bg-transparent dark:bg-transparent backdrop-blur-md transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* BRANDING */}
        <div className="flex items-center gap-2 sm:gap-3">
          <img src="/logo.png" alt="Logo" className="h-7 w-7 sm:h-8 sm:w-8 object-contain" />
          <div className="flex flex-col">
            <span className="text-gray-800 dark:text-white font-black text-sm sm:text-base whitespace-nowrap leading-none transition-all">
              Online Complaint System
            </span>
            <span className="text-orange-600 dark:text-orange-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-0.5 sm:mt-1">
              Admin Portal
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-4">
        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button
            className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 text-xs font-semibold"
            onClick={() => setIsLangOpen(!isLangOpen)}
          >
            <Globe size={18} className="text-orange-600 dark:text-orange-400" />
            <span className="hidden lg:block">{currentLangLabel}</span>
            <ChevronDown size={14} className={`transition-transform hidden sm:block ${isLangOpen ? 'rotate-180' : ''}`} />
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
                    className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${i18n.language === lang.code ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20' : 'text-slate-600 dark:text-slate-300'
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
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase mt-1 tracking-wider">Administrator</p>
          </div>
          <div className="h-10 w-10 bg-orange-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-orange-500/20 ring-2 ring-white dark:ring-gray-900 overflow-hidden">
            {user?.name?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
