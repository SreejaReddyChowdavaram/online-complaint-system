import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Star, CheckCircle, FileText, X } from "lucide-react";
import "./FeedbackForm.css";

const FeedbackForm = ({ complaint, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [type, setType] = useState("Positive");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [checking, setChecking] = useState(true);

  const getTranslatedCategory = (category) => {
    if (!category) return "N/A";
    const translated = t(`complaints.categories.${category}`);
    if (!translated || translated === `complaints.categories.${category}`) {
      return category.replace(/([A-Z])/g, ' $1').trim();
    }
    return translated;
  };

  useEffect(() => {
    checkExisting();
  }, [complaint._id]);

  const checkExisting = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/feedback/check/${complaint._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.exists) {
        setExistingFeedback(res.data.feedback);
        setRating(res.data.feedback.rating);
        setType(res.data.feedback.type);
        setMessage(res.data.feedback.message);
      }
    } catch (err) {
      console.error("Check feedback error:", err);
    } finally {
      setChecking(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError(t("complaints.feedback.rating_error"));
      return;
    }

    if (!message.trim()) {
      setError(t("complaints.feedback.message_empty_error"));
      return;
    }

    setLoading(true);

    const feedbackData = {
      complaintId: complaint._id,
      officerName: complaint.assignedTo?.name || "N/A",
      officerId: complaint.assignedTo?._id || complaint.assignedTo, // Handle populated or ID
      department: complaint.assignedTo?.department || complaint.category || "N/A",
      rating,
      type,
      message,
      sentiment: type, 
      escalated: rating <= 2,
      date: new Date().toISOString()
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/feedback", feedbackData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      onSuccess(t("complaints.feedback.submit_success"));
      onClose();
    } catch (err) {
      console.error("Feedback error:", err);
      setError(err.response?.data?.message || "Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-form-card" onClick={(e) => e.stopPropagation()}>
        <div className="feedback-form-header">
          <h2 className="flex items-center gap-3">
            <FileText size={22} className="text-blue-600 dark:text-blue-400" />
            {t("complaints.feedback.submit_title")}
          </h2>
          <button className="close-x" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form-body">
          {existingFeedback && (
            <div className="already-submitted-notice flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-3 rounded-xl mb-6">
              <CheckCircle size={18} className="text-emerald-500" />
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-sm">{t("complaints.feedback.already_submitted")}</span>
            </div>
          )}

          <div className="feedback-context-bar">
            <div className="context-item">
              <label>{t("complaints.feedback.complaint_id")}</label>
              <span>#{complaint._id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="context-item">
              <label>{t("complaints.feedback.officer")}</label>
              <span>{complaint.assignedTo?.name || "N/A"}</span>
            </div>
            <div className="context-item">
              <label>{t("complaints.feedback.department")}</label>
              <span>{getTranslatedCategory(complaint.assignedTo?.department || complaint.category)}</span>
            </div>
          </div>

          <div className="form-group">
            <label>{t("complaints.feedback.rating")} {existingFeedback ? "" : <span className="req">*</span>}</label>
            <div className={`star-rating ${existingFeedback ? 'readonly' : ''}`}>
              {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                  <button
                    type="button"
                    key={index}
                    className={`${ratingValue <= (hover || rating) ? "on" : "off"} ${existingFeedback ? 'cursor-default' : 'cursor-pointer'} border-none bg-none p-1 transition-transform hover:scale-110`}
                    onClick={() => !existingFeedback && setRating(ratingValue)}
                    onMouseEnter={() => !existingFeedback && setHover(ratingValue)}
                    onMouseLeave={() => !existingFeedback && setHover(rating)}
                  >
                    <Star 
                      size={32} 
                      fill={ratingValue <= (hover || rating) ? "#f59e0b" : "none"} 
                      className={ratingValue <= (hover || rating) ? "text-amber-500" : "text-slate-300 dark:text-slate-600"} 
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label>{t("complaints.feedback.type")}</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              disabled={!!existingFeedback}
            >
              <option value="Positive">{t("complaints.feedback.positive")}</option>
              <option value="Neutral">{t("complaints.feedback.neutral")}</option>
              <option value="Negative">{t("complaints.feedback.negative")}</option>
            </select>
          </div>

          <div className="form-group">
            <label>{t("complaints.feedback.message")} {existingFeedback ? "" : <span className="req">*</span>}</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("complaints.feedback.placeholder_experience")}
              rows="4"
              required
              readOnly={!!existingFeedback}
            ></textarea>
          </div>

          {existingFeedback && (
            <div className="submission-date">
              {t("complaints.feedback.submitted_on")}: {new Date(existingFeedback.submittedAt).toLocaleDateString()}
            </div>
          )}

          {error && <p className="form-error">{error}</p>}

          {!existingFeedback && (
            <button type="submit" className="submit-feedback-btn" disabled={loading}>
              {loading ? t("complaints.feedback.submitting") : t("complaints.feedback.submit_btn")}
            </button>
          )}
        </form>

      </div>
    </div>
  );
};

export default FeedbackForm;
