import { useTranslation } from 'react-i18next';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Star,
  Zap,
  Droplets,
  TrafficCone,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  Calendar,
  Trash2,
  Volume2,
  Wind
} from 'lucide-react';
import { motion } from 'framer-motion';
import './ComplaintCard.css';

const ComplaintCard = ({
  complaint,
  onCardClick,
  onUpvote,
  onDownvote,
  onCommentClick,
  onRateClick,
  userRole,
  currentUserId,
  hideStats = false,
}) => {
  const { t } = useTranslation();

  const formatStatus = (status) => {
    if (!status) return "Unknown";
    const normalized = status.toLowerCase();

    if (normalized.includes("in progress") || normalized.includes("in_progress")) return "In Progress";
    if (normalized.includes("resolved")) return "Resolved";
    if (normalized.includes("pending")) return "Pending";

    return status;
  };

  const getCategoryIcon = (category) => {
    const normalized = category?.toLowerCase() || "";
    if (normalized.includes("electricity") || normalized.includes("power") || normalized.includes("light")) return <Zap size={16} className="text-amber-500" />;
    if (normalized.includes("water") || normalized.includes("drainage") || normalized.includes("sewage")) return <Droplets size={16} className="text-blue-500" />;
    if (normalized.includes("road") || normalized.includes("traffic") || normalized.includes("street")) return <TrafficCone size={16} className="text-orange-500" />;
    if (normalized.includes("sanitation") || normalized.includes("garbage") || normalized.includes("waste") || normalized.includes("trash")) return <Trash2 size={16} className="text-teal-500" />;
    if (normalized.includes("noise") || normalized.includes("sound") || normalized.includes("other")) return <Volume2 size={16} className="text-indigo-500" />;
    if (normalized.includes("pollution") || normalized.includes("air") || normalized.includes("wind") || normalized.includes("smoke")) return <Wind size={16} className="text-sky-400" />;
    if (normalized.includes("safety") || normalized.includes("crime") || normalized.includes("security")) return <ShieldAlert size={16} className="text-red-500" />;
    if (normalized.includes("health") || normalized.includes("medical") || normalized.includes("hospital")) return <AlertCircle size={16} className="text-emerald-500" />;
    return <HelpCircle size={16} className="text-slate-400" />;
  };

  const getTranslatedCategory = (category) => {
    if (!category) return "N/A";
    
    // Normalize mapping for i18n keys
    const categoryKeyMap = {
      "road": "Roads",
      "water": "Water",
      "electricity": "Electricity",
      "sanitation": "Garbage",
      "garbage": "Garbage",
      "health": "Drainage",
      "noise": "Noise",
      "other": "Noise"
    };

    const normalizedLower = category.toLowerCase();
    const key = categoryKeyMap[normalizedLower] || Object.keys(categoryKeyMap).find(k => normalizedLower.includes(k)) || category;
    
    const translated = t(`complaints.categories.${key}`);
    if (!translated || translated === `complaints.categories.${key}`) {
      return category.replace(/([A-Z])/g, ' $1').trim();
    }
    return translated;
  };

  const getStatusConfig = (status) => {
    const normalized = status?.toLowerCase() || "";
    
    // Modern status styles (Pill based)
    if (normalized.includes("resolved")) {
      return {
        cardBorder: "border-l-[6px] border-l-[#10b981]",
        badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        label: t("complaints.status_resolved")
      };
    }
    if (normalized.includes("progress")) {
      return {
        cardBorder: "border-l-[6px] border-l-[#2563eb]",
        badge: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        label: t("complaints.status_progress")
      };
    }
    if (normalized.includes("pending")) {
      return {
        cardBorder: "border-l-[6px] border-l-[#f59e0b]",
        badge: "bg-orange-500/10 text-orange-600 border-orange-500/20",
        label: t("complaints.status_pending")
      };
    }

    return {
      cardBorder: "border-l-[6px] border-l-slate-300",
      badge: "bg-slate-500/10 text-slate-600 border-slate-500/20",
      label: status
    };
  };

  const statusConfig = getStatusConfig(complaint?.status);

  const userUpvoted = complaint?.votes?.some(
    (v) => (v.user?.toString() === currentUserId?.toString()) && v.voteType === "upvote"
  );

  const userDownvoted = complaint?.votes?.some(
    (v) => (v.user?.toString() === currentUserId?.toString()) && v.voteType === "downvote"
  );

  const isOverdue = complaint?.status !== "Resolved" && 
                    complaint?.assignedAt && 
                    (new Date() - new Date(complaint.assignedAt)) > (24 * 60 * 60 * 1000);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className={`relative group bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-slate-100 dark:border-slate-800 saas-shadow hover:saas-shadow-hover cursor-pointer overflow-hidden ${statusConfig.cardBorder} ${isOverdue ? 'ring-2 ring-red-500 ring-offset-2 dark:ring-offset-slate-900' : ''}`}
      onClick={() => onCardClick && onCardClick(complaint)}
    >
      {/* Overdue Alert Strip */}
      {isOverdue && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 animate-pulse" />
      )}
      {/* ──── Header ──── */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              {getCategoryIcon(complaint?.category)}
            </div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              {getTranslatedCategory(complaint?.category)}
            </span>
          </div>
          <h2 className="text-lg font-extrabold leading-tight text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {complaint?.title || "Untitled"}
          </h2>
        </div>
        <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusConfig.badge}`}>
          {statusConfig.label}
        </div>
      </div>

      {/* ──── Body ──── */}
      <div className="mb-6">
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {complaint?.description || "No description provided."}
        </p>
        <div className="flex items-center gap-3 mt-4 text-[12px] text-slate-400 dark:text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="opacity-70" />
            <span>
              {complaint?.createdAt ? new Date(complaint.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Date N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* ──── Footer ──── */}
      {!hideStats && (
        <div className="flex items-center justify-between pt-5 mt-auto border-t border-slate-50 dark:border-slate-800/50" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-4">
            {/* LIKES (Outline style as per user request) */}
            <div className="flex items-center gap-1">
              <motion.button
                whileTap={{ scale: 1.15 }}
                className={`p-1.5 rounded-lg transition-colors ${userUpvoted ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}`}
                onClick={() => onUpvote && onUpvote(complaint?._id)}
                title="Like"
              >
                <ThumbsUp size={18} fill="none" strokeWidth={2.5} />
              </motion.button>
              <span className={`text-xs font-bold ${userUpvoted ? "text-blue-600" : "text-slate-400"}`}>
                {complaint?.upvotes || 0}
              </span>
            </div>

            {/* DISLIKES (Outline style) */}
            <div className="flex items-center gap-1">
              <motion.button
                whileTap={{ scale: 1.15 }}
                className={`p-1.5 rounded-lg transition-colors ${userDownvoted ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}`}
                onClick={() => onDownvote && onDownvote(complaint?._id)}
                title="Dislike"
              >
                <ThumbsDown size={18} fill="none" strokeWidth={2.5} />
              </motion.button>
              <span className={`text-xs font-bold ${userDownvoted ? "text-blue-600" : "text-slate-400"}`}>
                {complaint?.downvotes || 0}
              </span>
            </div>

            {/* COMMENTS */}
            <div className="flex items-center gap-1">
              <button
                className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                onClick={() => onCommentClick && onCommentClick(complaint)}
                title="Comments"
              >
                <MessageSquare size={18} strokeWidth={2.5} />
              </button>
              <span className="text-xs font-bold text-slate-400">
                {complaint?.commentCount || 0}
              </span>
            </div>
          </div>

          {onRateClick && complaint?.status === "Resolved" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-[0.97]"
              onClick={() => onRateClick(complaint)}
            >
              <Star size={14} fill="white" /> {t("complaints.rate_feedback")}
            </motion.button>
          )}
        </div>
      )}

    </motion.div>
  );
};

export default ComplaintCard;