import React from "react";
import { useTranslation } from "react-i18next";
import { Bell, Menu, X, Sun, Moon, Globe, ChevronDown } from "lucide-react";
import NotificationDropdown from "../../components/NotificationDropdown";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const AdminNavbar = ({ onMenuClick, isSidebarOpen }) => {
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
    <header className="flex justify-between items-center px-4 md:px-8 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-all duration-300">
      <div className="flex items-center gap-4 lg:gap-8">
        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-all active:scale-95"
          aria-label="Toggle Menu"
        >
          {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* BRANDING */}
        <div className="flex items-center gap-3 group">
          <div className="p-2 bg-red-600 rounded-xl shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform duration-300">
             <img src="/logo.png" alt="Logo" className="h-6 w-6 object-contain brightness-0 invert" />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-900 dark:text-white font-black text-sm md:text-lg tracking-tight whitespace-nowrap">
              JAN SUVIDHA
            </span>
            <span className="text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-[0.2em] -mt-0.5">
              Admin Portal
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all text-[11px] md:text-xs font-bold border border-transparent hover:border-slate-200 dark:hover:border-slate-700 Shadow-sm"
            onClick={() => setIsLangOpen(!isLangOpen)}
          >
            <Globe size={16} className="text-blue-500" />
            <span className="hidden sm:block">{currentLangLabel}</span>
            <ChevronDown size={12} className={`transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isLangOpen && (
              <motion.div
                className="absolute right-0 mt-3 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
              >
                <div className="p-2 space-y-1">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        i18n.language === lang.code 
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => changeLanguage(lang.code)}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <button
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700 active:scale-95"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
        </button>

        <NotificationDropdown />

        {/* User Info */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{user?.name}</p>
            <p className="text-[9px] text-red-600 dark:text-red-400 font-bold uppercase tracking-widest opacity-80">Super Admin</p>
          </div>
          <div className="h-10 w-10 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-red-500/20 ring-2 ring-white dark:ring-slate-900 transform hover:rotate-6 transition-transform">
            {user?.name?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};


export default AdminNavbar;
