import { NavLink } from "react-router-dom";
import { LayoutDashboard, ClipboardList, BarChart3, User, UserCog, LogOut, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = ({ onClose }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();

  if (!t) return null;

  const menuItems = [
    { to: "/admin/dashboard", icon: <LayoutDashboard size={20} />, label: t("sidebar.dashboard") || "Dashboard", end: true },
    { to: "/admin/complaints", icon: <ClipboardList size={20} />, label: t("sidebar.view_complaints") || "Complaints", end: false },
    { to: "/admin/feedback", icon: <BarChart3 size={20} />, label: t("sidebar.officer_performance") || "Feedback", end: false },
    { to: "/admin/manage-users", icon: <UserCog size={20} />, label: "Manage Users", end: false },
    { to: "/admin/profile", icon: <User size={20} />, label: t("sidebar.my_profile") || "Profile", end: false },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0f172a] dark:bg-dark-card transition-all duration-300 relative">
      {/* MOBILE CLOSE BUTTON */}
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
              `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-black tracking-tight ${isActive
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                : "text-slate-400 dark:text-slate-500 hover:bg-emerald-500/10 hover:text-emerald-500 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
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
          <span>{String(t("navbar.logout") || "Logout")}</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

