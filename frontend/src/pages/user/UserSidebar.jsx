import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, PlusCircle, User, LogOut, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

const UserSidebar = ({ onClose, isSidebarOpen, onToggle }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();

  const menuItems = [
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: t("sidebar.dashboard") || "Dashboard", end: true },
    { to: "/dashboard/post-complaint", icon: <PlusCircle size={20} />, label: t("sidebar.post_complaint") || "Post Complaint", end: false },
    { to: "/dashboard/profile", icon: <User size={20} />, label: t("sidebar.my_profile") || "Profile", end: false },
  ];

  return (
    <div className={`flex flex-col h-full bg-[#0f172a] dark:bg-dark-card transition-all duration-300 relative ${!isSidebarOpen ? 'items-center' : ''}`}>
      
      {/* 🔄 EDGE-ATTACHED TOGGLE BUTTON */}
      <button
        onClick={onToggle}
        className={`fixed top-6 z-[1200] flex items-center justify-center w-8 h-10 bg-[#0f172a] dark:bg-dark-card border-y border-r border-slate-700 dark:border-dark-border rounded-r-xl shadow-xl transition-all duration-300 hover:brightness-110 active:scale-95 ${
          isSidebarOpen ? 'left-[256px]' : 'lg:left-16 left-0'
        }`}
        aria-label="Toggle Sidebar"
      >
        <Menu 
          size={18} 
          className={`text-slate-400 transition-transform duration-300 ${!isSidebarOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* MOBILE CLOSE BUTTON (Now redundant but keeping structure for layout) */}
      <div className="lg:hidden absolute top-4 right-4 z-[1100]">
        <button 
          onClick={onClose}
          className="w-9 h-9 opacity-0 pointer-events-none"
        >
          ✕
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-20 lg:pt-6 pb-6 px-4 space-y-2 overflow-y-auto w-full">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={!isSidebarOpen ? String(item.label) : ""}
            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
            className={({ isActive }) =>
              `flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center px-0'} py-2.5 rounded-xl transition-all duration-200 ease-in-out text-sm font-medium ${isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "text-gray-400 hover:bg-white/10 hover:text-white transition-all"
              }`
            }
          >
            {item.icon}
            {isSidebarOpen && <span className="whitespace-nowrap transition-all duration-300">{String(item.label)}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-light-border dark:border-dark-border w-full">
        <button
          onClick={logout}
          title={!isSidebarOpen ? String(t("navbar.logout") || "Logout") : ""}
          className={`flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center px-0'} w-full py-3 rounded-xl text-sm font-semibold text-slate-400 dark:text-slate-400 hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-colors`}
        >
          <LogOut size={20} />
          {isSidebarOpen && <span className="whitespace-nowrap transition-all duration-300">{String(t("navbar.logout") || "Logout")}</span>}
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;

