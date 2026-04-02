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
import ComplaintGrid from "../../components/ComplaintGrid";

function ViewComplaints() {
  const { t } = useTranslation();
  const [complaints, setComplaints] = React.useState([]);
  const [filteredComplaints, setFilteredComplaints] = React.useState([]);
  const [selectedComplaint, setSelectedComplaint] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

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

  const getUploadUrl = (path) => {
    if (!path) return "";
    const cleaned = String(path)
      .replace(/\\/g, "/")
      .replace(/^\/+/g, "")
      .replace(/^uploads\//, "");

    return `${BASE_URL}/uploads/${cleaned}`;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="font-bold tracking-widest uppercase text-[10px]">{t("complaints.loading")}</p>
    </div>
  );

  return (
    <div className="main-container py-4 md:py-10">
      
      {/* ──── Header & Filters ──── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t("complaints.all_complaints_title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider opacity-60">
            {t("complaints.admin_subtitle")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 sm:w-64 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder={t("complaints.search_placeholder")}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm font-semibold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative">
             <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
             <select 
              className="w-full sm:w-auto pl-10 pr-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 outline-none cursor-pointer shadow-sm hover:border-blue-500 appearance-none transition-all"
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
      </div>

      {/* ──── Complaints Grid / Empty State ──── */}
      {filteredComplaints.length > 0 ? (
        <ComplaintGrid loading={loading}>
          {filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint._id}
              complaint={complaint}
              onCardClick={(comp) => setSelectedComplaint(comp)}
              onCommentClick={(comp) => setSelectedComplaint(comp)}
            />
          ))}
        </ComplaintGrid>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 md:py-32 bg-white dark:bg-slate-900/50 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[32px] flex items-center justify-center text-slate-300 dark:text-slate-600 mb-8 shadow-inner">
            <Inbox size={48} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-200 mb-3 tracking-tight">{t("complaints.no_complaints_found")}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm px-6 font-medium leading-relaxed">
            {t("complaints.no_complaints_matching")}
          </p>
        </motion.div>
      )}

      {/* ──── Responsive Modal Component ──── */}
      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedComplaint(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-5xl h-[95vh] sm:h-auto sm:max-h-[90vh] rounded-t-[40px] sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
            >
              {/* Modal Header */}
              <div className="px-6 md:px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10 sticky top-0 shrink-0">
                <div className="flex-1 pr-4 translate-y-1">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight line-clamp-1">
                    {selectedComplaint?.title || "Complaint Detail"}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5 overflow-x-auto no-scrollbar whitespace-nowrap">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      REF: {selectedComplaint?._id?.slice(-8)?.toUpperCase() || "UNKNOWN"}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      selectedComplaint?.status === 'Pending' ? 'text-orange-500' :
                      selectedComplaint?.status === 'In Progress' ? 'text-blue-500' :
                      selectedComplaint?.status === 'Assigned' ? 'text-purple-500' :
                      'text-emerald-500'
                    }`}>
                      {selectedComplaint?.status || "Status N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                   {/* Desktop Escalation Badge */}
                  {selectedComplaint?.status !== "Resolved" && 
                   selectedComplaint?.assignedAt && 
                   (new Date() - new Date(selectedComplaint.assignedAt)) > (24 * 60 * 60 * 1000) && (
                    <div className="hidden lg:flex px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-600 text-white shadow-lg shadow-red-500/30 border border-red-700 animate-pulse">
                      🚨 Overdue
                    </div>
                  )}
                  <button 
                    onClick={() => setSelectedComplaint(null)}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white active:scale-95 transition-all shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-white dark:bg-slate-900">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                  
                  {/* LEFT COLUMN: Main Information */}
                  <div className="lg:col-span-7 space-y-8">
                    {/* Meta Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-blue-500/30 transition-all">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{t("complaints.modal_category")}</p>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-blue-500">
                             <AlertCircle size={18} />
                          </div>
                          <p className="text-sm md:text-base font-bold text-slate-700 dark:text-slate-200">{t(`complaints.categories.${selectedComplaint?.category || 'General'}`)}</p>
                        </div>
                      </div>
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-emerald-500/30 transition-all">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{t("complaints.date_submitted")}</p>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-slate-400">
                             <Calendar size={18} />
                          </div>
                          <p className="text-sm md:text-base font-bold text-slate-700 dark:text-slate-200">
                            {selectedComplaint?.createdAt ? new Date(selectedComplaint.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric', month: 'short', day: 'numeric'
                            }) : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{t("complaints.modal_description")}</h4>
                      <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-inner">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base whitespace-pre-line font-medium opacity-90">
                          {selectedComplaint?.description || "No description provided."}
                        </p>
                      </div>
                    </div>

                    {/* Images */}
                    {selectedComplaint?.images?.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                          <Camera size={14} /> {t("complaints.modal_citizen_images")}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {selectedComplaint.images.map((img, index) => (
                            <div key={index} className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white shadow-sm group">
                              <motion.img
                                whileHover={{ scale: 1.05 }}
                                src={getUploadUrl(img)}
                                alt="Citizen evidence"
                                className="w-full h-full object-cover transition-all duration-500 cursor-zoom-in"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RIGHT COLUMN: Sidebar info */}
                  <div className="lg:col-span-5 space-y-8">
                    {/* User Profile */}
                    <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] text-white shadow-xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">{t("complaints.submitted_by")}</p>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-[24px] bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-black text-2xl shadow-lg border border-white/10 ring-4 ring-white/5">
                          {selectedComplaint?.userId?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-lg font-black text-white truncate tracking-tight">
                            {selectedComplaint?.userId?.name || "Unknown User"}
                          </p>
                          <p className="text-sm text-white/50 truncate font-bold">{selectedComplaint?.userId?.email || "No Email Address"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Highly Professional Location Section */}
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Incident Location</h4>
                       <div className="rounded-[32px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                          <LocationSection 
                            address={selectedComplaint?.location?.address} 
                            lat={selectedComplaint?.location?.lat} 
                            lng={selectedComplaint?.location?.lng} 
                          />
                       </div>
                    </div>

                    {/* Admin Meta Card */}
                    <div className="p-6 bg-blue-600/5 dark:bg-blue-500/5 rounded-[32px] border border-blue-500/10 border-dashed">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-500 text-white rounded-xl shrink-0">
                           <AlertCircle size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">Administrative Oversight</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            Security logs indicate this compliant was last modified by <strong>Officer System</strong>. Actions taken here are logged for audit transparency.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments Area */}
                <div className="mt-12 pt-12 border-t border-slate-100 dark:border-slate-800">
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


export default ViewComplaints;
