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

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/dashboard-data");
      setData(res.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get("/dashboard-stats");
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
    } catch (error) {
      console.error("Error fetching dynamic stats:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const statsInterval = setInterval(fetchDashboardStats, 10000);
    const dataInterval = setInterval(fetchDashboardData, 300000);
    return () => {
      clearInterval(statsInterval);
      clearInterval(dataInterval);
    };
  }, []);

  const statsCards = [
    {
      id: "total",
      title: t("complaints.total_complaints"),
      value: data.stats.total,
      icon: <ClipboardList size={22} />,
      color: "bg-blue-500",
      lightColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "pending",
      title: t("complaints.status_pending"),
      value: data.stats.pending,
      icon: <Clock size={22} />,
      color: "bg-orange-500",
      lightColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400",
    },
    {
      id: "assigned",
      title: "Assigned",
      value: data.stats.assigned,
      icon: <User size={22} />,
      color: "bg-purple-500",
      lightColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      id: "inProgress",
      title: t("complaints.status_progress"),
      value: data.stats.inProgress,
      icon: <AlertCircle size={22} />,
      color: "bg-indigo-500",
      lightColor: "bg-indigo-50 dark:bg-indigo-900/20",
      textColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      id: "resolved",
      title: t("complaints.status_resolved"),
      value: data.stats.resolved,
      icon: <CheckCircle2 size={22} />,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50 dark:bg-emerald-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-14 h-14 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Initializing System...</p>
      </div>
    );
  }

  return (
    <div className="main-container py-6 md:py-10 space-y-10">
      
      {/* ─── Header Section ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <WelcomeHeader userName={currentUser?.name || "Admin"} role="admin" />
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider opacity-60 ml-1">
             Real-time System Oversight & Governance
          </p>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Session</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
           </div>
           <div className="h-12 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block mx-2" />
           <div className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
              <span className="text-[11px] font-black uppercase tracking-tighter text-slate-600 dark:text-slate-300">Live Services</span>
           </div>
        </div>
      </div>

      {/* ─── Stats Cards Grid ─── */}
      <div className="stats-grid">
        {statsCards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="saas-card p-6 border-l-4 group relative overflow-hidden"
            style={{ borderLeftColor: `var(--${card.id}-color, currentColor)` }}
          >
             <div className="flex items-start justify-between mb-6">
                <div className={`p-3 rounded-2xl ${card.lightColor} ${card.textColor} transition-transform group-hover:scale-110 duration-300`}>
                   {card.icon}
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{card.title}</p>
                   <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{card.value}</h3>
                </div>
             </div>
             <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight italic">System Update Live</span>
                <div className={`w-8 h-1 rounded-full ${card.color} opacity-20`} />
             </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Main Content Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recent Activity (Column 8/12) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="saas-card overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-500/20">
                     <ClipboardList size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Recent Complaints</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Latest system interactions</p>
                  </div>
               </div>
               <button className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all active:scale-95 border border-slate-200 dark:border-slate-700">
                  Global Activity
               </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Reference</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Subject</th>
                    <th className="px-8 py-5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.recentComplaints.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-8 py-6">
                        <span className="font-mono text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                          #{c._id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]" title={c.title}>
                          {c.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">By {c.userId?.name || "Citizen"}</p>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                          c.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                          c.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                          {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase italic mt-0.5 opacity-60">Verified</p>
                      </td>
                    </tr>
                  ))}
                  {data.recentComplaints.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-8 py-12 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">
                        No recent activity recorded
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* System Insights (Column 4/12) */}
        <div className="lg:col-span-4 space-y-8">
           <div className="saas-card p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
              
              <h3 className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-8 flex items-center gap-2">
                 <ShieldAlert size={14} className="text-red-500" /> Administrative Metrics
              </h3>

              <div className="space-y-6">
                <div className="p-6 bg-white/5 backdrop-blur-md rounded-[32px] border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all duration-300">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
                         <Users size={20} />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-white/60">Total Citizens</p>
                         <p className="text-2xl font-black tracking-tight">{data.userMetrics.totalUsers}</p>
                      </div>
                   </div>
                   <div className="text-emerald-400 text-xs font-black">+14%</div>
                </div>

                <div className="p-6 bg-white/5 backdrop-blur-md rounded-[32px] border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all duration-300">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform">
                         <ShieldAlert size={20} />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-white/60">Active Officers</p>
                         <p className="text-2xl font-black tracking-tight">{data.userMetrics.totalOfficers}</p>
                      </div>
                   </div>
                   <div className="text-blue-400 text-xs font-black">Live</div>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-white/10 flex items-center justify-between">
                 <div>
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest leading-none">Security Status</p>
                    <p className="text-sm font-black text-emerald-400 mt-1 uppercase tracking-tighter">Fully Protected</p>
                 </div>
                 <div className="h-10 w-10 flex items-center justify-center bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    <ShieldAlert size={18} className="text-emerald-500" />
                 </div>
              </div>
           </div>

           {/* Quick Actions / Tips */}
           <div className="saas-card p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 bg-transparent flex flex-col items-center text-center">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 mb-4 shadow-inner">
                 <AlertCircle size={28} />
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">Automated Governance</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-[200px]">
                The AI system is currently optimizing complaint allocation based on officer availability.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}


export default AdminDashboard;
