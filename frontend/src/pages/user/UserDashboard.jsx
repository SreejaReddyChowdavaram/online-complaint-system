import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import UserNavbar from "./UserNavbar";
import { Menu } from "lucide-react";

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-light-bg dark:bg-[#0B1120] text-light-text dark:text-dark-text overflow-hidden transition-all duration-300">

      {/* 📱 MOBILE OPEN TRIGGER (Visible only when sidebar is closed) */}
      {!isSidebarOpen && (
        <div className="lg:hidden fixed top-3 left-4 z-[1200]">
          <button
            onClick={toggleSidebar}
            className="w-10 h-10 rounded-xl bg-slate-900 shadow-lg text-white flex items-center justify-center transition-all active:scale-95"
          >
            <Menu size={22} />
          </button>
        </div>
      )}

      {/* 🚀 TOP NAVBAR (Fixed) */}
      <div className={`fixed top-0 left-0 w-full z-[1000] bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md border-b border-light-border dark:border-dark-border shadow-sm transition-all duration-300 ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-16'}`}>
        <UserNavbar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>

      {/* 📦 BOTTOM CONTAINER (Sidebar + Content) */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* MOBILE OVERLAY (Full Screen Backdrop) */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] lg:hidden transition-opacity duration-300"
            onClick={toggleSidebar}
          />
        )}

        {/* SIDEBAR (Responsive behavior) */}
        <aside className={`fixed lg:relative top-0 left-0 h-screen bg-[#0f172a] dark:bg-dark-card border-r border-light-border dark:border-dark-border z-[1100] transition-all duration-300 ease-in-out ${
          isSidebarOpen 
            ? "translate-x-0 w-64 shadow-2xl lg:shadow-none" 
            : "lg:w-16 -translate-x-full lg:translate-x-0"
        }`}>
          <UserSidebar isSidebarOpen={isSidebarOpen} onToggle={toggleSidebar} onClose={() => setIsSidebarOpen(false)} />
        </aside>

        {/* MAIN CONTENT Area */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-[#0B1120] overflow-auto transition-all duration-300 pt-20 lg:pt-24`}>
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
};

export default UserDashboard;