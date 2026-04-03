import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useTranslation } from "react-i18next";
import { 
  BarChart3, 
  Star, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle, 
  Inbox
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import WelcomeHeader from "../../components/WelcomeHeader";
import FeedbackCharts from "../../components/FeedbackCharts";
import "./OfficerFeedback.css";

const OfficerFeedback = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [allFeedback, setAllFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [stats, setStats] = useState({
    totalCount: 0,
    avgRating: 0,
    positivePercent: 0,
    negativePercent: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [timeFilter, setTimeFilter] = useState("All");

  useEffect(() => {
    fetchFeedback();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [timeFilter, allFeedback]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/feedback/my-feedback");
      
      if (res.data) {
        setAllFeedback(res.data.feedback || []);
      }
    } catch (err) {
      console.error("Fetch Feedback Error:", err);
      setError("Failed to load feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let results = [...allFeedback];

    // Time Filter
    if (timeFilter !== "All") {
      const now = new Date();
      results = results.filter(f => {
        const date = new Date(f.submittedAt);
        if (timeFilter === "7d") return (now - date) <= 7 * 24 * 60 * 60 * 1000;
        if (timeFilter === "1m") return (now - date) <= 30 * 24 * 60 * 60 * 1000;
        if (timeFilter === "1y") return (now - date) <= 365 * 24 * 60 * 60 * 1000;
        return true;
      });
    }

    setFilteredFeedback(results);

    // Re-calculate Stats
    if (results.length > 0) {
      const avg = results.reduce((acc, curr) => acc + curr.rating, 0) / results.length;
      const positiveCount = results.filter(f => f.type === "Positive").length;
      const negativeCount = results.filter(f => f.type === "Negative").length;

      setStats({
        totalCount: results.length,
        avgRating: avg,
        positivePercent: Math.round((positiveCount / results.length) * 100),
        negativePercent: Math.round((negativeCount / results.length) * 100)
      });
    } else {
      setStats({ totalCount: 0, avgRating: 0, positivePercent: 0, negativePercent: 0 });
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>{t("complaints.loading") || "Loading Insights..."}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feedback-status-container">
        <AlertTriangle size={48} color="#dc2626" />
        <p className="error-text">{String(error)}</p>
        <button onClick={fetchFeedback} className="retry-btn">Try Again</button>
      </div>
    );
  }

  const safeAvgRating = Number(stats?.avgRating) || 0;

  return (
    <div className="feedback-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ================= WELCOME GREETING ================= */}
      <WelcomeHeader userName={user?.name || "Officer"} role={user?.role} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 mt-2">
        <div className="header-content">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <BarChart3 size={28} className="text-blue-600 dark:text-blue-400" />
            {t("complaints.analytics.insights_title") || "Performance Insights"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium mt-1">
            {t("complaints.analytics.insights_sub") || "Analyze your service quality and citizen satisfaction"}
          </p>
        </div>

        <div className="filter-group w-full md:w-auto">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block px-1">Time Period</label>
          <select 
            className="w-full md:w-48 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="All">All Time</option>
            <option value="7d">Last 7 Days</option>
            <option value="1m">Last Month</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-5 group hover:border-blue-500/30 transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
            <Star size={28} fill="currentColor" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Average Rating</span>
            <div className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-1.5 mt-0.5">
              {safeAvgRating.toFixed(1)}
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-5 group hover:border-blue-500/30 transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <MessageSquare size={28} fill="none" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Total Feedback</span>
            <div className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">
              {stats?.totalCount || 0}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-5 group hover:border-blue-500/30 transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
            <TrendingUp size={28} />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Satisfaction Rate</span>
            <div className="text-2xl font-black mt-0.5" style={{ color: (stats?.positivePercent || 0) > 70 ? '#10b981' : (stats?.positivePercent || 0) < 40 ? '#ef4444' : 'inherit' }}>
              {stats?.positivePercent || 0}%
            </div>
          </div>
        </div>
      </div>

      {/* VISUAL ANALYTICS */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 mb-10">
        <FeedbackCharts data={filteredFeedback} />
      </div>

      {/* FEEDBACK LIST */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Citizen Reviews</h2>
          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800/50">
            {filteredFeedback.length} entries
          </span>
        </div>
        
        {filteredFeedback.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Inbox size={64} className="mb-4 opacity-20" />
            <p className="font-bold">No feedback entries found</p>
            <p className="text-sm opacity-60">Try adjusting your time filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFeedback.map((item) => (
              <div key={item?._id} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-blue-500/20 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest self-start ${
                      item?.type === 'Positive' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      item?.type === 'Negative' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400'
                    }`}>
                      {item?.type || "Review"}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          fill={(i < (item?.rating || 0)) ? "#f59e0b" : "none"} 
                          color={(i < (item?.rating || 0)) ? "#f59e0b" : "#cbd5e1"} 
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    {item?.submittedAt ? new Date(item.submittedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : "N/A"}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 italic">"{item?.message || "No comment provided."}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700/50">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                    {t(`complaints.categories.${item?.officerId?.department || item?.department || 'General'}`)}
                  </span>
                  {item?.complaintId && (
                    <span className="text-[9px] font-mono text-slate-400 uppercase">REF: #{item.complaintId.slice(-8)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerFeedback;
