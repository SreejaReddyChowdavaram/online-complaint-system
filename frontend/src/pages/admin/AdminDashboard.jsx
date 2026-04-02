import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Calendar,
  User,
  Users,
  Star,
  ShieldAlert
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import WelcomeHeader from "../../components/WelcomeHeader";
import "./AdminDashboard.css";


function AdminDashboard() {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [data, setData] = useState({
    stats: { total: 0, pending: 0, assigned: 0, inProgress: 0, resolved: 0 },
    userMetrics: { totalUsers: 0, totalOfficers: 0 },
    recentComplaints: [],
    topOfficers: [],
    alerts: { overduePending: 0, criticalIssues: [] }
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/dashboard-data");
      setData(res.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get("/dashboard-stats");
      console.log("--- DASHBOARD STATS API FETCH ---", res.data);
      // Update only the stats part of the data
      setData(prev => ({
        ...prev,
        stats: {
           total: res.data.total,
           pending: res.data.pending,
           assigned: res.data.assigned,
           inProgress: res.data.inProgress,
           resolved: res.data.resolved
        }
      }));
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching dynamic stats:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh stats every 5 seconds
    const statsInterval = setInterval(fetchDashboardStats, 5000);
    
    // Refresh full dashboard data every 5 minutes
    const dataInterval = setInterval(fetchDashboardData, 300000);
    
    return () => {
      clearInterval(statsInterval);
      clearInterval(dataInterval);
    };
  }, []);

  const calculatePercentage = (value, total) => {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  };

  const statsCards = [
    {
      id: "total",
      title: t("complaints.total_complaints"),
      value: data.stats.total,
      icon: <ClipboardList size={22} />,
      color: "card-blue",
      progress: 100,
      trend: "+2 today",
    },
    {
      id: "pending",
      title: t("complaints.status_pending"),
      value: data.stats.pending,
      icon: <Clock size={22} />,
      color: "card-orange",
      progress: calculatePercentage(data.stats.pending, data.stats.total),
      trend: "Awaiting review",
    },
    {
      id: "assigned",
      title: "Assigned",
      value: data.stats.assigned,
      icon: <User size={22} />,
      color: "card-cyan",
      progress: calculatePercentage(data.stats.assigned, data.stats.total),
      trend: "Allocated to officer",
    },
    {
      id: "inProgress",
      title: t("complaints.status_progress"),
      value: data.stats.inProgress,
      icon: <AlertCircle size={22} />,
      color: "card-purple",
      progress: calculatePercentage(data.stats.inProgress, data.stats.total),
      trend: "In action",
    },
    {
      id: "resolved",
      title: t("complaints.status_resolved"),
      value: data.stats.resolved,
      icon: <CheckCircle2 size={22} />,
      color: "card-green",
      progress: calculatePercentage(data.stats.resolved, data.stats.total),
      trend: "Success rate",
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-loader-container">
        <div className="modern-spinner"></div>
        <p>Initializing Secure Dashboard...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="admin-dashboard-v2 p-8 bg-[#f8fafc] dark:bg-[#0b1120] min-h-screen transition-all duration-500"
    >
      {/* ─── Header & Greeting ─── */}
      <div className="dash-v2-header flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="header-greeting">
          <WelcomeHeader userName={currentUser?.name || "Admin"} role="admin" />
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium -mt-6 ml-1">
            Real-time insights and system administration at your fingertips.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
            <Calendar size={14} className="text-blue-500" />
            <span className="text-xs font-bold text-slate-500 tracking-wide uppercase">
              {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
          />
        </div>
      </div>

      <div className="dashboard-grid-layout grid grid-cols-1 xl:grid-cols-[1fr,340px] gap-8">
        
        {/* ─── Main Section (Left) ─── */}
        <div className="main-stats-section space-y-8">

          {/* Stats Grid */}
          <div className="stats-cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {statsCards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`stat-card-v2 group ${card.color} border-l-[6px] relative overflow-hidden`}
                whileHover={{ y: -8 }}
              >
                {/* Visual Glass Effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-[0.03] rounded-full -mr-16 -mt-16 group-hover:opacity-[0.06] transition-opacity" />
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                    {card.title}
                  </h3>
                </div>

                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-3xl font-black text-slate-800 dark:text-white leading-none">
                      {card.value}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Complaints Table */}
          <div className="recent-complaints-box neumorphic-card">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl">
                  <ClipboardList size={22} />
                </div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Recent Complaints</h2>
              </div>
              <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/40 transition-all">
                View All Activity
              </button>
            </div>
            
            <div className="overflow-x-auto border border-slate-50 dark:border-slate-800 rounded-[24px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/20">
                    <th className="p-5 text-left text-[11px] font-black uppercase tracking-widest text-slate-400">Complaint ID</th>
                    <th className="p-5 text-left text-[11px] font-black uppercase tracking-widest text-slate-400">Subject</th>
                    <th className="p-5 text-left text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Lifecycle</th>
                    <th className="p-5 text-left text-[11px] font-black uppercase tracking-widest text-slate-400">Owner</th>
                    <th className="p-5 text-left text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {data.recentComplaints.map((c) => (
                    <tr key={c._id} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all relative">
                      <td className="p-5 align-middle">
                        <span className="font-mono text-xs font-black text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
                          #{c._id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="p-5 align-middle">
                        <span className="font-extrabold text-slate-700 dark:text-slate-200 block truncate max-w-[180px]">
                          {c.title}
                        </span>
                      </td>
                      <td className="p-5 align-middle text-center">
                        <span className={`status-pill status-${c.status.toLowerCase().replace(" ", "-")} text-[10px] font-black py-1.5 px-3 rounded-xl inline-block border`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-5 align-middle">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400">
                            {c.assignedTo?.name?.charAt(0) || <User size={12} />}
                          </div>
                          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                            {c.assignedTo?.name || "Unassigned"}
                          </span>
                        </div>
                      </td>
                      <td className="p-5 align-middle text-right shrink-0">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 italic">
                          {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ─── Insights Panel (Right) ─── */}
        <aside className="insights-panel space-y-6">
          
          {/* Platform Health Score */}
          <div className="neumorphic-card bg-gradient-to-br from-blue-600 to-indigo-700 border-none p-6 text-white overflow-hidden relative">
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-100 mb-6 flex justify-between items-center">
              System Health
              <ShieldAlert size={14} />
            </h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-black mb-1">98%</p>
                <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest opacity-80">Platform Efficiency</p>
              </div>
              <div className="h-12 w-24">
                {/* Sparkline Placeholder */}
                <div className="flex items-end gap-1 h-full">
                  {[20, 35, 25, 45, 60, 40, 50].map((h, i) => (
                    <div key={i} className="flex-1 bg-white/30 rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="neumorphic-card">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">User Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                    <Users size={18} />
                  </div>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Total Citizens</span>
                </div>
                <strong className="text-lg font-black text-slate-800 dark:text-white">{data.userMetrics.totalUsers}</strong>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
                    <ShieldAlert size={18} />
                  </div>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Active Officers</span>
                </div>
                <strong className="text-lg font-black text-slate-800 dark:text-white">{data.userMetrics.totalOfficers}</strong>
              </div>
            </div>
          </div>

          {/* System Alerts */}
          <div className="neumorphic-card border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Logs</h3>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse delay-75" />
              </div>
            </div>
            <div className="space-y-3">
              {data.alerts.criticalIssues.map((alert, i) => (
                <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100/50 dark:border-red-900/20" key={i}>
                  <AlertCircle size={14} className="text-red-500 mt-0.5" />
                  <span className="text-[11px] font-bold text-red-600 dark:text-red-400 leading-snug">{alert}</span>
                </div>
              ))}
              {data.alerts.criticalIssues.length === 0 && (
                <div className="flex flex-col items-center py-6">
                  <div className="p-3 bg-green-50 dark:bg-green-900/10 text-green-500 rounded-full mb-3">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-500">All Nodes Healthy</p>
                </div>
              )}
            </div>
          </div>

        </aside>
      </div>
    </motion.div>
  );
}

export default AdminDashboard;
