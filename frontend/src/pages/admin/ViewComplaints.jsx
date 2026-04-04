import React, { useState, useEffect } from "react";
import api, { BASE_URL } from "../../services/api";
import { useTranslation } from "react-i18next";
import { 
  ClipboardList, 
  Globe, 
  Search, 
  X, 
  AlertCircle, 
  Calendar,
  Camera,
  MessageSquare,
  Inbox
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import ComplaintCard from "../../components/ComplaintCard";
import WelcomeHeader from "../../components/WelcomeHeader";
import LocationSection from "../../components/LocationSection";
import CommentSection from "../../components/CommentSection";
import { getDisplayCategory } from "../../utils/complaintUtils";
import "../user/ViewComplaints.css";

function ViewComplaints() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  /* ---------------- FETCH DATA ---------------- */
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/complaints");
      
      const statusPriority = { "Assigned": 1, "Pending": 2, "In Progress": 3, "Resolved": 4 };
      const sorted = (res.data || []).sort((a,b) => {
        const pA = statusPriority[a.status] || 99;
        const pB = statusPriority[b.status] || 99;
        if (pA !== pB) return pA - pB;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setComplaints(sorted);
    } catch (error) {
      console.error("Error fetching admin complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = complaints;
    if (statusFilter !== "all") {
      result = result.filter(c => c.status.toLowerCase() === statusFilter.toLowerCase());
    }
    if (searchQuery) {
      result = result.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c._id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredComplaints(result);
  }, [searchQuery, statusFilter, complaints]);

  const getUploadUrl = (path) => {
    if (!path) return "";
    if (String(path).startsWith("http")) return path; // Cloudinary URL
    const cleaned = String(path)
      .replace(/\\/g, "/")
      .replace(/^\/+/g, "")
      .replace(/^uploads\//, "");
    return `${BASE_URL}/uploads/${cleaned}`;
  };

  if (loading) return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>{t("complaints.loading")}</p>
    </div>
  );

  return (
    <div className="complaints-page">
      {/* ================= WELCOME GREETING ================= */}
      <WelcomeHeader userName={user?.name || "Admin"} role="Admin" />

      {/* ──── Header & Filters ──── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <h2 className="section-title mb-0">
          <Globe size={22} className="icon-blue" />
          {t("complaints.all_complaints")}
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder={t("complaints.search_placeholder")}
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all w-64 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select 
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 outline-none cursor-pointer shadow-sm hover:border-blue-500 transition-all font-sans"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">{t("complaints.status_all")}</option>
            <option value="pending">{t("complaints.status_pending")}</option>
            <option value="assigned">{t("complaints.status_assigned")}</option>
            <option value="in progress">{t("complaints.status_progress")}</option>
            <option value="resolved">{t("complaints.status_resolved")}</option>
          </select>
        </div>
      </div>

      {/* ──── Complaints Grid ──── */}
      <div className="complaints-grid">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint._id}
              complaint={complaint}
              onCardClick={(comp) => setSelectedComplaint(comp)}
              onCommentClick={(comp) => setSelectedComplaint(comp)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900/50 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800 w-full col-span-full">
            <Inbox size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t("complaints.no_complaints_found")}</h3>
          </div>
        )}
      </div>

      {/* ──── Unified Modal Component ──── */}
      <AnimatePresence>
        {selectedComplaint && (
          <div className="modal-overlay" onClick={() => setSelectedComplaint(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="modal" 
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                className="modal-close-icon"
                onClick={() => setSelectedComplaint(null)}
              >
                <X size={20} />
              </button>

              <div className="modal-body scrollbar-thin">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">
                  {selectedComplaint.title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t("complaints.modal_category")}</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{getDisplayCategory(selectedComplaint.category)}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t("complaints.date_submitted")}</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{new Date(selectedComplaint.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <LocationSection 
                  address={selectedComplaint.location?.address} 
                  lat={selectedComplaint.location?.lat} 
                  lng={selectedComplaint.location?.lng} 
                />

                <div className="mt-6 mb-8">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t("complaints.modal_description")}</p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    {selectedComplaint.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50 mb-8">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold">
                    {selectedComplaint.userId?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-0.5">{t("complaints.submitted_by")}</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedComplaint.userId?.name || "Unknown"}</p>
                  </div>
                </div>

                {/* Images Section */}
                {selectedComplaint.images?.length > 0 && (
                  <div className="modal-images mb-8">
                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                      <Camera size={14} /> {t("complaints.modal_citizen_images")}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedComplaint.images.map((img, i) => (
                        <div key={i} className="aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                          <img 
                            src={getUploadUrl(img)} 
                            alt="Citizen evidence"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments Section */}
                <div className="comment-box border-t border-slate-100 dark:border-slate-800 pt-8">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-blue-600 dark:text-blue-400 mb-6">
                    <MessageSquare size={20} /> {t("complaints.modal_comments_title")}
                  </h3>
                  <CommentSection complaintId={selectedComplaint._id} isReadOnly={true} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ViewComplaints;
