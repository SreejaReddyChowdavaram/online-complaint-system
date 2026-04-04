import React, { useState, useEffect } from "react";
import api, { BASE_URL } from "../../services/api";
import { useTranslation } from "react-i18next";
import { 
  Pin, 
  Globe, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Camera, 
  CheckCircle,
  X 
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getDisplayCategory } from "../../utils/complaintUtils";
import ComplaintCard from "../../components/ComplaintCard";
import WelcomeHeader from "../../components/WelcomeHeader";
import LocationSection from "../../components/LocationSection";
import "../user/ViewComplaints.css"; // Reuse the same styles

function AssignedComplaints() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [assigned, setAssigned] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [selected, setSelected] = useState(null);
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const assignedRes = await api.get("/officer/assigned");
      const allRes = await api.get("/complaints");

      setAssigned(assignedRes.data);

      const statusPriority = { "Assigned": 1, "Pending": 2, "In Progress": 3, "Resolved": 4 };
      const sortedAll = (allRes.data || []).sort((a,b) => {
        const pA = statusPriority[a.status] || 99;
        const pB = statusPriority[b.status] || 99;
        if (pA !== pB) return pA - pB;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setAllComplaints(sortedAll);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (complaintId) => {
    try {
      const res = await api.get(`/complaints/comments/${complaintId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Fetch comments error:", err);
    }
  };

  const handleUpdate = async () => {
    if (!status) return;
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("status", status);
      if (image) formData.append("resolutionImage", image);

      await api.put(
        `/officer/update/${selected._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(t("complaints.update_success") || "Updated Successfully");
      setSelected(null);
      fetchData();
    } catch (error) {
      console.error("Update error:", error);
      alert(t("complaints.update_failed") || "Update Failed");
    } finally {
      setUpdating(false);
    }
  };

  const isAssigned = (complaintId) => {
    return assigned.some((a) => a._id === complaintId);
  };

  const getStatusClasses = (status) => {
    if (status === "Pending")
      return { badge: "status pending", text: t("complaints.status_pending") };
    if (status === "In Progress")
      return { badge: "status in-progress", text: t("complaints.status_progress") };
    if (status === "Resolved")
      return { badge: "status resolved", text: t("complaints.status_resolved") };
    return { badge: "status", text: status };
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>{t("complaints.loading")}</p>
      </div>
    );
  }

  return (
    <div className="complaints-page">
      {/* ================= WELCOME GREETING ================= */}
      <WelcomeHeader userName={user?.name || "Officer"} role={user?.role} />

      {/* ================= ASSIGNED ================= */}
      <h2 className="section-title">
        <Pin size={22} className="icon-blue" />
        {t("complaints.assigned_complaints")}
      </h2>

      <div className="complaints-grid">
        {assigned.length === 0 ? (
          <p className="no-data">{t("complaints.no_assigned")}</p>
        ) : (
          assigned.map((c) => (
            <ComplaintCard
              key={c._id}
              complaint={c}
              hideStats={true}
              onCardClick={(comp) => {
                setSelected(comp);
                setStatus(comp.status);
                fetchComments(comp._id);
              }}
            />
          ))
        )}
      </div>

      {/* ================= ALL COMPLAINTS ================= */}
      <h2 className="section-title">
        <Globe size={22} className="icon-blue" />
        {t("complaints.all_complaints")}
      </h2>

      <div className="complaints-grid">
        {allComplaints.map((c) => (
          <ComplaintCard
            key={c._id}
            complaint={c}
            onCardClick={(comp) => {
              setSelected(comp);
              setStatus(comp.status);
              fetchComments(comp._id);
            }}
            onCommentClick={(comp) => {
              setSelected(comp);
              fetchComments(comp._id);
            }}
          />
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            
            {/* ──── Close Icon (Top-Right) ──── */}
            <button 
              className="modal-close-icon"
              onClick={() => setSelected(null)}
              title={t("complaints.modal_close_btn")}
            >
              <X size={20} />
            </button>

            <div className="modal-body scrollbar-thin">
              <h2>{selected.title}</h2>

              <p><strong>{t("complaints.modal_category")}:</strong> {getDisplayCategory(selected.category)}</p>
              
              <LocationSection 
                address={selected.location?.address} 
                lat={selected.location?.lat} 
                lng={selected.location?.lng} 
              />

              <p className="description-text"><strong>{t("complaints.modal_description")}:</strong> {selected.description}</p>

              <div className="metadata-row">
                <p><strong>{t("complaints.submitted_by")}:</strong> {selected.userId?.name}</p>
                <p><strong>{t("complaints.date_submitted")}:</strong> {new Date(selected.createdAt).toLocaleDateString()}</p>
              </div>

              <p><strong>{t("complaints.modal_status")}:</strong> {getStatusClasses(selected.status).text}</p>

              {/* Citizen Images */}
              {selected.images?.length > 0 && (
                <div className="modal-images">
                  <h4><Camera size={18} /> {t("complaints.modal_citizen_images")}</h4>
                  <div className="image-grid">
                    {selected.images.map((img, i) => (
                      <img
                        key={i}
                        src={`${BASE_URL}/uploads/${img}`}
                        alt="complaint"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Officer Resolution Image */}
              {selected.resolutionImage && (
                <div className="modal-images">
                  <h4><CheckCircle size={18} /> {t("complaints.modal_officer_proof")}</h4>
                  <img
                    src={`${BASE_URL}/uploads/${selected.resolutionImage.replace(/\\/g, "/").replace(/^\/+/, "").replace(/^uploads\//, "")}`}
                    alt="resolution"
                  />
                </div>
              )}

              {/* Update Section for Assigned Officer */}
              {isAssigned(selected._id) && (
                <div className="officer-actions-card">
                  <h3 className="actions-title">{t("complaints.update_status_title") || "Update Progress"}</h3>
                  
                  <div className="form-group">
                    <label>{t("complaints.modal_status")}</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Pending">{t("complaints.status_pending")}</option>
                      <option value="In Progress">{t("complaints.status_progress")}</option>
                      <option value="Resolved">{t("complaints.status_resolved")}</option>
                    </select>
                  </div>

                  <div className="form-group mt-4">
                    <label>{t("complaints.resolution_proof_label")}</label>
                    <input
                      type="file"
                      onChange={(e) => setImage(e.target.files[0])}
                      className="file-input"
                    />
                  </div>

                  <button 
                    onClick={handleUpdate} 
                    className="submit-btn mt-6"
                    disabled={updating}
                  >
                    {updating ? "..." : (t("complaints.update_btn") || "Update Complaint")}
                  </button>
                </div>
              )}

              {/* Comments Section */}
              <div className="comment-box">
                <h3><MessageSquare size={20} /> {t("complaints.modal_comments_title")}</h3>
                {comments.length === 0 ? (
                  <p>{t("complaints.modal_no_comments")}</p>
                ) : (
                  comments.map((com) => (
                    <div key={com._id} className="p-3.5 rounded-2xl mb-3 relative max-w-[90%] self-start bg-slate-100 dark:bg-slate-800 border border-light-border dark:border-dark-border transition-all duration-300">
                      <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">{com.userId?.name || "User"}</div>
                      <div className="text-sm text-light-text dark:text-dark-text pb-4">{com.message}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 absolute bottom-1.5 right-3 italic">
                        {new Date(com.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignedComplaints;
