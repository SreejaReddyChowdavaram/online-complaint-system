import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useTranslation } from "react-i18next";
import { 
  AlertTriangle, 
  Star, 
  Flag,
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./AdminFeedback.css";
import FeedbackCharts from "../../components/FeedbackCharts";

const AdminFeedback = () => {
  const { t } = useTranslation();
  const [feedback, setFeedback] = useState([]);
  const [officerStats, setOfficerStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDept, setFilterDept] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [filterDept]);

  const fetchAnalytics = async () => {
    try {
      const url = filterDept ? `/feedback/all?department=${filterDept}` : "/feedback/all";
      const res = await api.get(url);
      setFeedback(res.data.feedback);
      setOfficerStats(res.data.officerStats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-feedback-container">
      <header className="admin-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <BarChart3 size={28} className="text-blue-500" />
          <div>
            <h1 className="text-slate-800 dark:text-white">{t("complaints.analytics.title")}</h1>
            <p className="text-slate-500 dark:text-slate-400">{t("complaints.analytics.sub")}</p>
          </div>
        </div>
        <div className="filters">
          <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
            <option value="">{t("complaints.analytics.all_depts")}</option>
            <option value="Electricity">{t("complaints.categories.Electricity")}</option>
            <option value="Water">{t("complaints.categories.Water")}</option>
            <option value="Roads">{t("complaints.categories.Roads")}</option>
            <option value="Drainage">{t("complaints.categories.Drainage")}</option>
            <option value="Garbage">{t("complaints.categories.Garbage")}</option>
            <option value="Noise">{t("complaints.categories.Noise")}</option>
          </select>
        </div>
      </header>

      {/* ESCALATION ALERT */}
      {feedback.some(f => f.escalated) && (
        <div className="escalation-alert-banner">
          <AlertTriangle size={24} color="#dc2626" />
          <div className="alert-content">
            <strong>{t("complaints.analytics.action_required")}</strong> {t("complaints.analytics.low_rating_alert")}
          </div>
        </div>
      )}

      {/* VISUAL ANALYTICS */}
      <FeedbackCharts data={feedback} />

      <div className="analytics-layout">
        {/* TOP OFFICERS LIST */}
        <section className="top-officers">
          <h2>{t("complaints.analytics.rankings")}</h2>
          <div className="officer-table-wrapper">
            <table className="officer-table">
              <thead>
                <tr>
                  <th>{t("complaints.analytics.officer_col")}</th>
                  <th>{t("complaints.analytics.dept_col")}</th>
                  <th>{t("complaints.analytics.avg_rating")}</th>
                  <th>{t("complaints.analytics.total_reviews")}</th>
                </tr>
              </thead>
              <tbody>
                {officerStats.map((off) => (
                  <tr key={off._id}>
                    <td><strong>{off.name || t("complaints.analytics.unknown")}</strong></td>
                    <td>{off.dept || t("complaints.analytics.no_dept")}</td>
                    <td>
                      <span className="rating-badge">
                        {off.avgRating.toFixed(1)} 
                        <Star size={14} fill="#f59e0b" color="#f59e0b" style={{display: "inline", marginLeft: "4px"}} />
                      </span>
                    </td>
                    <td>{off.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* RECENT FEEDBACK TRENDS */}
        <section className="recent-feedback">
          <div className="section-header">
            <h2>{t("complaints.analytics.trends")}</h2>
            <button 
              className="view-all-btn"
              onClick={() => setIsModalOpen(true)}
            >
              See All
            </button>
          </div>
          <div className="trend-list">
            {feedback.slice(0, 4).map((f) => (
              <div key={f._id} className={`trend-item ${f.escalated ? 'escalated' : ''}`}>
                <div className="trend-header">
                  <strong>
                    {(f.officerId?.name || f.officerName)} 
                    {f.escalated && <Flag size={14} color="#dc2626" style={{display: "inline", marginLeft: "6px"}} />}
                  </strong>
                  <div className="trend-tags">
                    <span className={`tag ${f.type.toLowerCase()}`}>{t(`complaints.feedback.${f.type.toLowerCase()}`)}</span>
                  </div>
                </div>
                <p className="trend-msg">{f.message}</p>
                <div className="trend-footer">
                  <span>{t(`complaints.categories.${f.officerId?.department || f.department}`)} • {new Date(f.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      {/* ALL FEEDBACKS MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <h3>All Complaints & Feedbacks</h3>
                  <p>Comprehensive historical trend report</p>
                </div>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
              </div>
              <div className="modal-body custom-scrollbar">
                <div className="trend-list">
                  {feedback.map((f) => (
                    <div key={f._id} className={`trend-item ${f.escalated ? 'escalated' : ''}`}>
                      <div className="trend-header">
                        <strong>
                          {(f.officerId?.name || f.officerName)} 
                          {f.escalated && <Flag size={14} color="#dc2626" style={{display: "inline", marginLeft: "6px"}} />}
                        </strong>
                        <div className="trend-tags">
                          <span className={`tag ${f.type.toLowerCase()}`}>{t(`complaints.feedback.${f.type.toLowerCase()}`)}</span>
                        </div>
                      </div>
                      <p className="trend-msg">{f.message}</p>
                      <div className="trend-footer">
                        <span>{t(`complaints.categories.${f.officerId?.department || f.department}`)} • {new Date(f.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminFeedback;
