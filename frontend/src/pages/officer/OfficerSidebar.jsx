import React from "react";
import { NavLink } from "react-router-dom";
import { ClipboardList, BarChart3, User, X, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

const OfficerSidebar = ({ onClose }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();

  const menuItems = [
    { to: "/officer/complaints", icon: <ClipboardList size={20} />, label: t("sidebar.assigned_complaints") },
    { to: "/officer/feedback", icon: <BarChart3 size={20} />, label: t("sidebar.performance_feedback") },
    { to: "/officer/profile", icon: <User size={20} />, label: t("sidebar.my_profile") },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0f172a] dark:bg-dark-card transition-all duration-300">
      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-semibold ${
                isActive 
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" 
                  : "text-slate-400 dark:text-slate-400 hover:bg-white/10 hover:text-white dark:hover:bg-slate-800 dark:hover:text-white"
              }`
            }
          >
            {item.icon}
            <span>{String(item.label)}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-light-border dark:border-dark-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span>{String(t("navbar.logout"))}</span>
        </button>
      </div>
    </div>
  );
};

export default OfficerSidebar;