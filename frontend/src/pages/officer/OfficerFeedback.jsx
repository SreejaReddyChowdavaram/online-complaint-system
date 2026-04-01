import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { 
  BarChart3, 
  Star, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle, 
  Inbox,
  LayoutDashboard
} from "lucide-react";
import "./OfficerFeedback.css";
import FeedbackCharts from "../../components/FeedbackCharts";

const OfficerFeedback = () => {
  const { t } = useTranslation();
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
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/feedback/my-feedback", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data) {
        console.log("Fetched Feedback Data:", res.data);
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
    console.log("Applying filters to:", allFeedback.length, "items");
    // Filters are only for Time now as Department is fixed for Officer
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
      <div className="feedback-status-container">
        <div className="loading-spinner"></div>
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
    <div className="feedback-container">
      <header className="feedback-header">
        <div className="header-content">
          <h1 style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <BarChart3 size={28} className="icon-blue" />
            {t("complaints.analytics.insights_title") || "Officer Performance Feedback"}
          </h1>
          <p>{t("complaints.analytics.insights_sub") || "Insights into service quality and citizen satisfaction"}</p>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label>Time Period</label>
            <select className="filter-select" value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
              <option value="All">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="1m">Last Month</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>
      </header>

      {/* STATS CARDS */}
      <div className="stats-grid">
        <div className="stat-card rating-card">
          <div className="stat-icon"><Star size={24} fill="#f59e0b" color="#f59e0b" /></div>
          <div className="stat-info">
            <span className="stat-label">Average Rating</span>
            <div className="stat-value">{safeAvgRating.toFixed(1)} <Star size={14} fill="#f59e0b" color="#f59e0b" style={{display: "inline", marginBottom: "4px"}} /></div>
          </div>
        </div>
        <div className="stat-card feedback-card-stat">
          <div className="stat-icon"><MessageSquare size={24} color="#2563eb" /></div>
          <div className="stat-info">
            <span className="stat-label">Total Feedback</span>
            <div className="stat-value">{stats?.totalCount || 0}</div>
          </div>
        </div>
        <div className="stat-card satisfaction-card">
          <div className="stat-icon"><TrendingUp size={24} color="#16a34a" /></div>
          <div className="stat-info">
            <span className="stat-label">Satisfaction Rate</span>
            <div className="stat-value" style={{ color: (stats?.positivePercent || 0) > 70 ? '#16a34a' : (stats?.positivePercent || 0) < 40 ? '#dc2626' : '#111827' }}>
              {stats?.positivePercent || 0}%
            </div>
          </div>
        </div>
      </div>

      {/* VISUAL ANALYTICS */}
      <div className="charts-section">
        <FeedbackCharts data={filteredFeedback} />
      </div>

      {/* FEEDBACK LIST */}
      <div className="feedback-list-section">
        <div className="section-header">
          <h2>Citizen Reviews</h2>
          <span className="count-pill">{filteredFeedback.length} entries</span>
        </div>
        
        {filteredFeedback.length === 0 ? (
          <div className="no-data-card">
            <Inbox size={48} color="#94a3b8" />
            <p>No feedback entries found matching your filters.</p>
          </div>
        ) : (
          <div className="feedback-list">
            {filteredFeedback.map((item) => (
              <div key={item?._id} className="feedback-item">
                <div className="item-header">
                  <div className="rating-row">
                    <span className={`sentiment-badge ${item?.type?.toLowerCase() || 'neutral'}`}>
                      {item?.type || "Review"}
                    </span>
                    <div className="star-display">
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
                  <span className="date-stamp">
                    {item?.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : "Date N/A"}
                  </span>
                </div>
                <p className="item-message">{item?.message || "No comment provided."}</p>
                <div className="item-footer">
                  <span className="dept-tag">
                    {t(`complaints.categories.${item?.officerId?.department || item?.department || 'General'}`)}
                  </span>
                  {item?.complaintId && typeof item.complaintId === 'string' && (
                    <span className="cid-ref">REF: #{item.complaintId.slice(-8).toUpperCase()}</span>
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
