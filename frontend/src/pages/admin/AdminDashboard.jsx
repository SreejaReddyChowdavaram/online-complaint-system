import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  Users,
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
      className="admin-dashboard-v2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* ─── Header & Greeting ─── */}
      <WelcomeHeader userName={currentUser?.name || "Admin"} role="Admin" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-2">
        <div className="header-content">
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium">
            Real-time insights and system administration at your fingertips.
          </p>
        </div>

        <div className="flex items-center gap-3">
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

      {/* Stats Grid - Standardized to 2 columns on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-10">
        {statsCards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center group hover:border-blue-500/30 transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform ${
              card.id === 'total' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' :
              card.id === 'pending' ? 'bg-amber-50 text-amber-500 dark:bg-amber-900/20' :
              card.id === 'assigned' ? 'bg-cyan-50 text-cyan-500 dark:bg-cyan-900/20' :
              card.id === 'inProgress' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20' :
              'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20'
            }`}>
              {card.icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{card.title}</span>
            <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">
              {card.value}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr,340px] gap-8">
        
        {/* ─── Main Section (Left) ─── */}
        <div className="space-y-8">
          {/* Recent Complaints Table */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center">
                  <ClipboardList size={22} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Recent Activity</h2>
              </div>
            </div>
            
            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-6 sm:px-0">
                <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                  <thead>
                    <tr>
                      <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">ID</th>
                      <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">Subject</th>
                      <th className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                      <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">Owner</th>
                      <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    {data.recentComplaints.map((c) => (
                      <tr key={c._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                        <td className="py-4 whitespace-nowrap">
                          <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md">
                            #{c._id.slice(-6).toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4 max-w-[200px]">
                          <span className="font-semibold text-slate-700 dark:text-slate-200 block truncate">
                            {c.title}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                            c.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800/50' :
                            c.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/50' :
                            'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/50'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center text-[10px] font-bold text-indigo-600">
                              {c.assignedTo?.name?.charAt(0) || '?'}
                            </div>
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                              {c.assignedTo?.name || "Unassigned"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-right whitespace-nowrap">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
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
        </div>

        {/* ─── Insights Panel (Right) ─── */}
        <aside className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6">User Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center rounded-xl">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Total Citizens</p>
                    <p className="text-[10px] text-slate-400 font-medium tracking-tight">Verified accounts</p>
                  </div>
                </div>
                <strong className="text-xl font-black text-slate-800 dark:text-white">{data.userMetrics.totalUsers}</strong>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center rounded-xl">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Active Officers</p>
                    <p className="text-[10px] text-slate-400 font-medium tracking-tight">Departmental staff</p>
                  </div>
                </div>
                <strong className="text-xl font-black text-slate-800 dark:text-white">{data.userMetrics.totalOfficers}</strong>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}

export default AdminDashboard;
