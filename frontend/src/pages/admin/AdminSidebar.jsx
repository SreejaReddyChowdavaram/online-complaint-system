import { NavLink } from "react-router-dom";
import { LayoutDashboard, ClipboardList, BarChart3, User, UserCog, LogOut, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = ({ onClose, isSidebarOpen, onToggle }) => {
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
    <div className={`flex flex-col h-full bg-[#0f172a] dark:bg-dark-card transition-all duration-300 relative ${!isSidebarOpen ? 'items-center' : ''}`}>
      
      {/* 🔄 FIXED TOGGLE BUTTON (Persistent) */}
      <div className="fixed top-4 left-4 z-[1200]">
        <button
          onClick={onToggle}
          className="w-10 h-10 rounded-xl bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 active:scale-95 transition-all"
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} className={`transition-transform duration-300 ${!isSidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* MOBILE CLOSE BUTTON (Now redundant but kept for safety or replaced by toggle) */}
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
      <nav className={`flex-1 pt-20 lg:pt-6 pb-6 px-4 space-y-2 overflow-y-auto w-full`}>
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={!isSidebarOpen ? String(item.label) : ""}
            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
            className={({ isActive }) =>
              `flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center px-0'} py-2.5 rounded-xl transition-all duration-200 ease-in-out text-sm font-medium ${isActive
                ? "bg-orange-600 text-white shadow-lg shadow-orange-500/20"
                : "text-gray-400 hover:bg-white/10 hover:text-white transition-all"
              }`
            }
          >
            {item.icon}
            {isSidebarOpen && <span className="whitespace-nowrap overflow-hidden transition-all duration-300">{String(item.label)}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className={`p-4 border-t border-light-border dark:border-dark-border w-full`}>
        <button
          onClick={logout}
          title={!isSidebarOpen ? String(t("navbar.logout") || "Logout") : ""}
          className={`flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center px-0'} w-full py-3 rounded-xl text-sm font-semibold text-slate-400 dark:text-slate-400 hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-colors`}
        >
          <LogOut size={20} />
          {isSidebarOpen && <span className="whitespace-nowrap overflow-hidden transition-all duration-300">{String(t("navbar.logout") || "Logout")}</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

