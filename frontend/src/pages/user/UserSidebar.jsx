import { NavLink } from "react-router-dom";
import { FileText, Pencil, User, X, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

const UserSidebar = ({ onClose }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();

  if (!t) return null;

  const menuItems = [
    { to: "/dashboard", icon: <FileText size={20} />, label: t("sidebar.view_complaints"), end: true },
    { to: "/dashboard/post-complaint", icon: <Pencil size={20} />, label: t("sidebar.post_complaint"), end: false },
    { to: "/dashboard/profile", icon: <User size={20} />, label: t("sidebar.my_profile"), end: false },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0f172a] dark:bg-dark-card transition-all duration-300 relative">
      {/* MOBILE CLOSE BUTTON (❌ FIX) */}
      <div className="lg:hidden absolute top-4 right-4 z-[1100]">
        <button 
          onClick={onClose}
          className="w-9 h-9 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center font-bold text-lg"
          aria-label="Close Sidebar"
        >
          ✕
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-20 lg:pt-6 pb-6 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-semibold ${isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
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
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 dark:text-slate-400 hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span>{String(t("navbar.logout"))}</span>
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;

