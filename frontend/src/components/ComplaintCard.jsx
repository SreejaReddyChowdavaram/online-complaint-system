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

  const getStatusConfig = (status) => {
    const normalized = status?.toLowerCase() || "";
    if (normalized.includes("resolved")) return { badge: "bg-emerald-50 text-emerald-600 border-emerald-100", label: t("complaints.status_resolved") };
    if (normalized.includes("progress")) return { badge: "bg-blue-50 text-blue-600 border-blue-100", label: t("complaints.status_progress") };
    if (normalized.includes("assigned")) return { badge: "bg-purple-50 text-purple-600 border-purple-100", label: "Assigned" };
    return { badge: "bg-orange-50 text-orange-600 border-orange-100", label: t("complaints.status_pending") };
  };

  const statusConfig = getStatusConfig(complaint?.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ duration: 0.2 }}
      className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-md hover:shadow-lg cursor-pointer flex flex-col h-full transition-all duration-300 relative overflow-hidden"
      onClick={() => onCardClick && onCardClick(complaint)}
    >
      {/* 🚀 Status Badge (Top-Right) */}
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${statusConfig.badge}`}>
        {statusConfig.label}
      </div>

      {/* 🏷️ Category (Subtle) */}
      <div className="mb-2">
        <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 dark:text-slate-500 uppercase">
          {complaint?.category || "General"}
        </span>
      </div>

      {/* 📝 Title (Bold, Large) */}
      <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-3 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {complaint?.title || "Untitled Issue"}
      </h3>

      {/* 📄 Description (Line-Clamp-2) */}
      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-6 flex-1">
        {complaint?.description || "No additional details provided."}
      </p>

      {/* 📅 Footer: Date & Stats */}
      <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-50 dark:border-slate-800/50">
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 italic">
          <Calendar size={13} className="opacity-70" />
          <span>
            {complaint?.createdAt ? new Date(complaint.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}
          </span>
        </div>

        {/* Action Symbols (Minimal) */}
        {!hideStats && (
          <div className="flex items-center gap-3 text-slate-400">
             <div className="flex items-center gap-1 group/item">
                <ThumbsUp size={14} className="group-hover/item:text-blue-500 transition-colors" />
                <span className="text-[10px] font-black">{complaint?.upvotes || 0}</span>
             </div>
             <div className="flex items-center gap-1 group/item">
                <MessageSquare size={14} className="group-hover/item:text-indigo-500 transition-colors" />
                <span className="text-[10px] font-black">{complaint?.commentCount || 0}</span>
             </div>
          </div>
        )}
      </div>

    </motion.div>
  );
};


export default ComplaintCard;