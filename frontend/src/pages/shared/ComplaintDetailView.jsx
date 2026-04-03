import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { BASE_URL } from "../../services/api";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  User, 
  Shield, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";

import LocationSection from "../../components/LocationSection";
import { getCategoryLabel } from "../../utils/complaintUtils";
import ImageWithFallback from "../../components/ImageWithFallback";

const ComplaintDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const { data } = await api.get(`/complaints/${id}`);
        setComplaint(data);
      } catch (err) {
        console.error("Error fetching complaint:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Complaint Not Found</h2>
          <p className="text-gray-500 mb-6">The complaint you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-amber-100 text-amber-700 border-amber-200 uppercase";
      case "In Progress": return "bg-blue-100 text-blue-700 border-blue-200 uppercase";
      case "Resolved": return "bg-emerald-100 text-emerald-700 border-emerald-200 uppercase";
      default: return "bg-gray-100 text-gray-700 border-gray-200 uppercase";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-4 md:p-6 pb-24"
    >
      {/* Back Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Complaint Details</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ref ID: {complaint._id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border ${getStatusColor(complaint.status)}`}>
                {complaint.status}
              </span>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <ThumbsUp size={16} className="text-blue-500" />
                  {complaint.upvotes || 0}
                </div>
                <div className="flex items-center gap-1.5">
                  <ThumbsDown size={16} className="text-red-500" />
                  {complaint.downvotes || 0}
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare size={16} className="text-gray-400" />
                  {complaint.commentCount || 0}
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4 dark:text-white">{complaint.title}</h2>
            
            {/* Meta Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 mb-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-slate-500">
                  <AlertCircle size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Category</p>
                  <p className="text-sm font-semibold">{getCategoryLabel(complaint.category, t)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-slate-500">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Submitted On</p>
                  <p className="text-sm font-semibold">
                    {new Date(complaint.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Smart Location Section with Map */}
            <LocationSection 
              address={complaint.location?.address} 
              lat={complaint.location?.lat} 
              lng={complaint.location?.lng} 
            />

            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Description</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {complaint.description}
              </p>
            </div>
          </div>

          {/* Media Galley */}
          {complaint.images && complaint.images.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-md font-bold mb-4 flex items-center gap-2">
                Attached Media <span className="text-xs font-normal text-gray-400">({complaint.images.length} items)</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {complaint.images.map((img, i) => (
                  <div key={i} className="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <ImageWithFallback 
                      src={img} 
                      alt={`Complaint media ${i+1}`}
                      className="w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* User Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-[10px] text-gray-400 uppercase font-bold mb-4 tracking-widest">Submitted By</h3>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
                {complaint.userId?.name?.charAt(0) || "U"}
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-white leading-none whitespace-nowrap">
                  {complaint.userId?.name || "Anonymous User"}
                </p>
                <p className="text-xs text-gray-500 mt-1">Verified Citizen</p>
              </div>
            </div>
          </div>

          {/* Officer Assignment */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden relative">
            {complaint.status === "Pending" && (
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Clock size={80} />
              </div>
            )}
            <h3 className="text-[10px] text-gray-400 uppercase font-bold mb-4 tracking-widest">Assigned Specialist</h3>
            
            {complaint.assignedTo ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
                    {complaint.assignedTo.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white leading-none">
                      {complaint.assignedTo.name}
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase mt-1">
                      {complaint.assignedTo.department || "Officer"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-50">
                  <Shield size={14} className="text-emerald-600" />
                  Authorized Official
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-full w-fit mx-auto mb-3 text-slate-400">
                  <User size={24} />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Awaiting Assignment</p>
                <p className="text-[10px] text-gray-400 mt-1 italic">Assigning nearest officer...</p>
              </div>
            )}
          </div>

          {/* Final Resolution Info (If Resolved) */}
          {complaint.status === "Resolved" && (
            <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/20 shadow-sm relative overflow-hidden">
              <CheckCircle2 size={60} className="absolute -bottom-4 -right-4 text-emerald-500 opacity-10" />
              <h3 className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold mb-4 tracking-widest">Resolution Outcome</h3>
              <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium leading-relaxed">
                This complaint was successfully marked as resolved by the assigned official.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ComplaintDetailView;
