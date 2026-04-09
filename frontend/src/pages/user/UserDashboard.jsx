import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import UserNavbar from "./UserNavbar";
import { Menu } from "lucide-react";

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-light-bg dark:bg-[#0B1120] text-light-text dark:text-dark-text overflow-hidden transition-all duration-300 relative">
 
      {/* 🚀 TOP NAVBAR (Fixed & Separated) */}
      <UserNavbar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* 📱 MOBILE OPEN TRIGGER (Below Navbar) */}
      {!isSidebarOpen && (
        <div className="lg:hidden fixed top-[72px] left-4 z-[1000]">
          <button
            onClick={toggleSidebar}
            className="w-10 h-10 rounded-xl bg-slate-900 shadow-lg text-white flex items-center justify-center transition-all active:scale-95 border border-white/10"
          >
            <Menu size={22} />
          </button>
        </div>
      )}

      {/* 📦 CONTENT WRAPPER (Below Navbar) */}
      <div className="flex flex-1 overflow-hidden relative mt-14 sm:mt-16">
        
        {/* MOBILE OVERLAY (Drawer Backdrop) */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] lg:hidden transition-opacity duration-300 mt-14 sm:mt-16"
            onClick={toggleSidebar}
          />
        )}

        {/* SIDEBAR (Starts below Navbar) */}
        <aside className={`fixed lg:relative h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] bg-[#0f172a] dark:bg-dark-card border-r border-light-border dark:border-dark-border z-[1000] transition-all duration-300 ease-in-out ${
          isSidebarOpen 
            ? "translate-x-0 w-64 shadow-2xl lg:shadow-none" 
            : "lg:w-16 -translate-x-full lg:translate-x-0"
        }`}>
          <UserSidebar isSidebarOpen={isSidebarOpen} onToggle={toggleSidebar} onClose={() => setIsSidebarOpen(false)} />
        </aside>

        {/* MAIN CONTENT Area */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-[#0B1120] overflow-auto transition-all duration-300`}>
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;