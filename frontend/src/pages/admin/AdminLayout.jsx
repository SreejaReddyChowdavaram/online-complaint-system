import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={`flex flex-col h-screen bg-light-bg dark:bg-[#0B1120] text-light-text dark:text-dark-text overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'sidebar-is-open' : ''}`}>

      {/* 🚀 TOP NAVBAR (Fixed) */}
      <div className="fixed top-0 left-0 w-full z-[1100] bg-white dark:bg-[#0B1120] border-b border-light-border dark:border-dark-border shadow-sm">
        <AdminNavbar />
      </div>

      {/* 📱 MOBILE SIDEBAR TOGGLE (Compact) */}
      <div className="lg:hidden sticky top-14 z-[900] px-4 py-2 mt-14 bg-transparent">
        <button
          onClick={toggleSidebar}
          className="w-10 h-10 rounded-[10px] bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.25)] active:scale-95 transition-all"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* 📦 BOTTOM CONTAINER (Sidebar + Content) */}
      <div className="flex flex-1 overflow-hidden relative pt-0 lg:pt-16">
        
        {/* MOBILE OVERLAY (Full Screen Backdrop) */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] lg:hidden transition-opacity duration-300"
            onClick={toggleSidebar}
          />
        )}

        {/* SIDEBAR (Drawer Overlays Content) */}
        <aside className={`fixed lg:relative lg:translate-x-0 top-0 left-0 w-64 h-full bg-[#0f172a] dark:bg-dark-card border-r border-light-border dark:border-dark-border z-[1000] lg:z-30 transition-transform duration-300 ease-in-out overflow-y-auto ${
          isSidebarOpen ? "translate-x-0 shadow-2xl lg:shadow-none" : "-translate-x-full"
        }`}>
          <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
        </aside>

        {/* MAIN CONTENT Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-[#0B1120] overflow-auto transition-all duration-300">
          <div className="max-w-[1600px] mx-auto pt-4 sm:pt-0">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;
