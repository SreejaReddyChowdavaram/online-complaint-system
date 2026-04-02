import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 overflow-hidden transition-all duration-300 font-sans">

      {/* 🚀 TOP NAVBAR */}
      <AdminNavbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* 📦 BOTTOM CONTAINER (Sidebar + Content) */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* 🌓 MOBILE SIDEBAR OVERLAY */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* 📦 SIDEBAR */}
        <aside 
          className={`fixed inset-y-0 left-0 bg-[#0f172a] dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
        </aside>

        {/* 🖥️ MAIN CONTENT Area */}
        <main className="flex-1 p-4 md:p-8 bg-slate-50 dark:bg-[#0B1120] overflow-y-auto custom-scrollbar relative">
          <div className="max-w-7xl mx-auto space-y-8">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
}
