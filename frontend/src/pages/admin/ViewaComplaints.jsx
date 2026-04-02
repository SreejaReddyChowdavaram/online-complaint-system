import React from "react";
import api, { BASE_URL } from "../../services/api";
import { useTranslation } from "react-i18next";
import CommentSection from "../../components/CommentSection";
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Camera, 
  CheckCircle,
  Inbox,
  Filter,
  Search,
  X,
  AlertCircle,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ComplaintCard from "../../components/ComplaintCard";
import LocationSection from "../../components/LocationSection";

function ViewaComplaints() {
  const { t } = useTranslation();
  const [complaints, setComplaints] = React.useState([]);
  const [filteredComplaints, setFilteredComplaints] = React.useState([]);
  const [selectedComplaint, setSelectedComplaint] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  /* ---------------- FETCH DATA ---------------- */
  const fetchData = async () => {
    try {
      setLoading(true);
      const statusPriority = { "Assigned": 1, "Pending": 2, "In Progress": 3, "Resolved": 4 };
      const sorted = (res.data || []).sort((a,b) => {
        const pA = statusPriority[a.status] || 99;
        const pB = statusPriority[b.status] || 99;
        if (pA !== pB) return pA - pB;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setComplaints(sorted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
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

// Removed handleAssign as assignment is now automated

  const getUploadUrl = (path) => {
    if (!path) return "";
    const cleaned = String(path)
      .replace(/\\/g, "/")
      .replace(/^\/+/g, "")
      .replace(/^uploads\//, "");

    return `${BASE_URL}/uploads/${cleaned}`;
  };

  /* ---------------- STATUS COLORS ---------------- */
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return {
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          borderLeft: "6px solid #f59e0b",
          color: "var(--text-primary)",
        };
      case "In Progress":
        return {
          backgroundColor: "rgba(37, 99, 235, 0.1)",
          borderLeft: "6px solid #2563eb",
          color: "var(--text-primary)",
        };
      case "Resolved":
        return {
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          borderLeft: "6px solid #22c55e",
          color: "var(--text-primary)",
        };
      default:
        return { color: "var(--text-primary)" };
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-vh-80 text-slate-400 gap-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="font-bold tracking-widest uppercase text-xs">{t("complaints.loading")}</p>
    </div>
  );

  return (
    <div className="p-8 max-w-[1400px] mx-auto bg-[#f8fafc] dark:bg-[#0b1120] min-h-screen transition-all duration-500">
      
      {/* ──── Header & Filters ──── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">
            {t("complaints.all_complaints_title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            {t("complaints.admin_subtitle")}
          </p>
        </div>

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
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 outline-none cursor-pointer shadow-sm hover:border-blue-500 transition-all"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">{t("complaints.status_all")}</option>
            <option value="pending">{t("complaints.status_pending")}</option>
            <option value="in progress">{t("complaints.status_progress")}</option>
            <option value="resolved">{t("complaints.status_resolved")}</option>
          </select>
        </div>
      </div>

      {/* ──── Complaints Grid / Empty State ──── */}
      <AnimatePresence mode="popLayout">
        {filteredComplaints.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint._id}
                complaint={complaint}
                onCardClick={(comp) => setSelectedComplaint(comp)}
                onCommentClick={(comp) => setSelectedComplaint(comp)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900/50 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800"
          >
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6 group transition-all duration-500">
              <Inbox size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">{t("complaints.no_complaints_found")}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-center max-w-xs">
              {t("complaints.no_complaints_matching")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ──── Modern Modal Component ──── */}
      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setSelectedComplaint(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10 sticky top-0">
                <div className="flex-1 pr-4">
                  <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
                    {selectedComplaint?.title || "Complaint Detail"}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    Reference ID: {selectedComplaint?._id?.slice(-8)?.toUpperCase() || "UNKNOWN"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                    selectedComplaint?.status === 'Pending' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                    selectedComplaint?.status === 'In Progress' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                    'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                  }`}>
                    {selectedComplaint?.status || "Status N/A"}
                  </div>

                  {/* High Priority Escalation Badge */}
                  {selectedComplaint?.status !== "Resolved" && 
                   selectedComplaint?.assignedAt && 
                   (new Date() - new Date(selectedComplaint.assignedAt)) > (24 * 60 * 60 * 1000) && (
                    <div className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-600 text-white shadow-lg shadow-red-500/30 animate-pulse border border-red-700">
                      🚨 Escalated / Overdue
                    </div>
                  )}
                  <button 
                    onClick={() => setSelectedComplaint(null)}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-white dark:bg-slate-900">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  
                  {/* LEFT COLUMN: Main Information (3/5) */}
                  <div className="lg:col-span-3 space-y-6">
                    {/* Meta Info Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t("complaints.modal_category")}</p>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                             {/* Category Icon logic can be here, using generic icon for now */}
                             <AlertCircle size={14} className="text-blue-500" />
                          </div>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{t(`complaints.categories.${selectedComplaint?.category || 'General'}`)}</p>
                        </div>
                      </div>
                      <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t("complaints.date_submitted")}</p>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                          <Calendar size={14} className="text-slate-400" />
                          {selectedComplaint?.createdAt ? new Date(selectedComplaint.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'long', day: 'numeric'
                          }) : "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Description Section */}
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">{t("complaints.modal_description")}</h4>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-line">
                        {selectedComplaint?.description || "No description provided."}
                      </p>
                    </div>

                    {/* Images Section */}
                    {selectedComplaint?.images?.length > 0 && (
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                          <Camera size={14} /> {t("complaints.modal_citizen_images")}
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {selectedComplaint.images.map((img, index) => (
                            <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white group hover:z-10">
                              <motion.img
                                whileHover={{ scale: 1.1 }}
                                src={getUploadUrl(img)}
                                alt="Citizen evidence"
                                className="w-full h-full object-cover transition-all duration-300"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RIGHT COLUMN: User & Map (2/5) */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Submitted By Section */}
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">{t("complaints.submitted_by")}</p>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                          {selectedComplaint?.userId?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate" title={selectedComplaint?.userId?.name || "User"}>
                            {selectedComplaint?.userId?.name || "Unknown User"}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{selectedComplaint?.userId?.email || "No Email"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Highly Professional Location Section */}
                    <LocationSection 
                      address={selectedComplaint?.location?.address} 
                      lat={selectedComplaint?.location?.lat} 
                      lng={selectedComplaint?.location?.lng} 
                    />

                    {/* Transparency Section (Optional bit of context) */}
                    <div className="p-4 bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter text-center">
                        This view is restricted to Administrators. Data is encrypted for privacy.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comments Area (Full Width at Bottom) */}
                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                  <CommentSection complaintId={selectedComplaint?._id} isReadOnly={true} />
                </div>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
}

export default ViewaComplaints;
