import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useTranslation } from "react-i18next";
import CommentSection from "../../components/CommentSection";
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
import ComplaintCard from "../../components/ComplaintCard";
import WelcomeHeader from "../../components/WelcomeHeader";
import LocationSection from "../../components/LocationSection";

function AssignedComplaints() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [assigned, setAssigned] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");
  const [image, setImage] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const assignedRes = await api.get("/officer/assigned");
      const allRes = await api.get("/complaints");

      setAssigned(assignedRes.data);
      setAllComplaints(allRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("status", status);
      if (image) formData.append("resolutionImage", image);

      await api.put(
        `/officer/update/${selected._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(t("complaints.update_success") || "Updated Successfully");
      setSelected(null);
      fetchData();
    } catch (error) {
      console.error("Update error:", error);
      alert(t("complaints.update_failed") || "Update Failed");
    }
  };

  const getCardStyle = (status) => {
    if (status === "Pending")
      return { 
        backgroundColor: "rgba(245, 158, 11, 0.1)", 
        borderLeft: "6px solid #f59e0b", 
        color: "var(--text-primary)",
        text: t("complaints.status_pending") 
      };

    if (status === "In Progress")
      return { 
        backgroundColor: "rgba(37, 99, 235, 0.1)", 
        borderLeft: "6px solid #2563eb", 
        color: "var(--text-primary)",
        text: t("complaints.status_progress") 
      };

    if (status === "Resolved")
      return { 
        backgroundColor: "rgba(34, 197, 94, 0.1)", 
        borderLeft: "6px solid #22c55e", 
        color: "var(--text-primary)",
        text: t("complaints.status_resolved") 
      };

    return { text: status };
  };

  const isAssigned = (complaintId) => {
    return assigned.some((a) => a._id === complaintId);
  };

  return (
    <div className="p-1">
      {/* ================= WELCOME GREETING ================= */}
      <WelcomeHeader userName={user?.name || "Officer"} role={user?.role} />

      {/* ================= ASSIGNED ================= */}
      <h2 style={{ display: "flex", alignItems: "center", gap: "10px", color: "#166534", marginBottom: "20px" }}>
        <Pin size={22} className="text-green-600" />
        {t("complaints.assigned_complaints")}
      </h2>

      <div className="complaints-grid">
        {assigned.length === 0 ? (
          <p>{t("complaints.no_assigned")}</p>
        ) : (
          assigned.map((c) => (
            <ComplaintCard
              key={c._id}
              complaint={c}
              hideStats={true}
              onCardClick={(comp) => {
                setSelected(comp);
                setStatus(comp.status);
              }}
            />
          ))
        )}
      </div>

      {/* ================= ALL ================= */}
      <h2 className="section-title" style={{ marginBottom: "20px", color: "#166534", display: "flex", alignItems: "center", gap: "10px" }}>
        <Globe size={22} className="text-green-600" />
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
            }}
            onCommentClick={(comp) => {
              setSelected(comp);
              setStatus(comp.status);
            }}
          />
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div style={styles.overlay} onClick={() => setSelected(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            
            {/* ──── Sticky Close Icon (Top-Right) ──── */}
            <button 
              onClick={() => setSelected(null)}
              style={styles.closeIconBtn}
              title={t("complaints.modal_close_btn")}
            >
              <X size={20} />
            </button>

            <div style={styles.modalBody}>
              <h2 style={{ paddingRight: "40px", marginBottom: "20px" }}>{selected.title}</h2>

              <p><strong>{t("complaints.modal_category")}:</strong> {t(`complaints.categories.${selected.category}`)}</p>
              
              {/* Professional Location Section with Live Map */}
              <LocationSection 
                address={selected.location?.address} 
                lat={selected.location?.lat} 
                lng={selected.location?.lng} 
              />

              <p style={{ marginTop: "20px" }}><strong>{t("complaints.modal_description")}:</strong> {selected.description}</p>

              <p>
                <strong>{t("complaints.submitted_by")}:</strong>{" "}
                {selected.userId?.name} ({selected.userId?.email})
              </p>

              <p>
                <strong>{t("complaints.date_submitted")}:</strong>{" "}
                {new Date(selected.createdAt).toLocaleString()}
              </p>


              {/* Citizen Images */}
              {selected.images?.length > 0 && (
                <div style={{ marginTop: "15px" }}>
                  <strong style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Camera size={18} /> {t("complaints.modal_citizen_images")}
                  </strong>

                  {selected.images.map((img, i) => (
                    <img
                      key={i}
                      src={`/uploads/${img}`}
                      alt="complaint"
                      style={styles.image}
                    />
                  ))}
                </div>
              )}
              {selected.resolutionImage && (
                <div style={{ marginTop: "15px" }}>
                  <strong style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle size={18} /> {t("complaints.modal_officer_proof")}
                  </strong>

                  {(() => {
                    const cleanPath = selected.resolutionImage
                      .replace(/\\/g, "/")
                      .replace(/^\/+/, "")
                      .replace(/^uploads\//, "");

                    const finalUrl = `/uploads/${cleanPath}`;

                    return (
                      <img
                        src={finalUrl}
                        alt="resolution"
                        style={styles.image}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    );
                  })()}
                </div>
              )}
              {/* Show update section ONLY if assigned */}
              {isAssigned(selected._id) && (
                <div style={{ marginTop: "25px", padding: "20px", background: "var(--bg-content)", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
                  <label style={{ fontWeight: "800", fontSize: "12px", textTransform: "uppercase", color: "var(--text-secondary)", display: "block", marginBottom: "10px" }}>
                    {t("complaints.modal_status")}
                  </label>
                  <select
                    style={{ width: "100%", padding: "10px", borderRadius: "10px", background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Pending">{t("complaints.status_pending")}</option>
                    <option value="In Progress">{t("complaints.status_progress")}</option>
                    <option value="Resolved">{t("complaints.status_resolved")}</option>
                  </select>

                  <br /><br />

                  <label style={{ fontWeight: "800", fontSize: "12px", textTransform: "uppercase", color: "var(--text-secondary)", display: "block", marginBottom: "10px" }}>
                    {t("complaints.resolution_proof_label")}
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    style={{ fontSize: "13px" }}
                  />

                  <br /><br />

                  <button onClick={handleUpdate} style={styles.updateBtn}>
                    {t("complaints.update_btn")}
                  </button>
                </div>
              )}

              <hr style={{ margin: "25px 0", border: "0", borderTop: "1px solid var(--border-color)" }} />

              <div style={{ marginTop: "20px", display: "flex", gap: "10px", marginBottom: "15px" }}>
                <button
                  disabled
                  style={{
                    backgroundColor: "var(--bg-content)",
                    color: "var(--text-primary)",
                    padding: "8px 16px",
                    borderRadius: "10px",
                    border: "1px solid var(--border-color)",
                    cursor: "default",
                    opacity: 0.8,
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <ThumbsUp size={14} /> {selected.upvotes || 0}
                </button>

                <button
                  disabled
                  style={{
                    backgroundColor: "var(--bg-content)",
                    color: "var(--text-primary)",
                    padding: "8px 16px",
                    borderRadius: "10px",
                    border: "1px solid var(--border-color)",
                    cursor: "default",
                    opacity: 0.8,
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <ThumbsDown size={14} /> {selected.downvotes || 0}
                </button>
              </div>

              <CommentSection complaintId={selected._id} isReadOnly={true} />
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.7)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "var(--bg-card)",
    color: "var(--text-primary)",
    borderRadius: "24px",
    width: "750px",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden", 
    textAlign: "left",
    border: "1px solid var(--border-color)",
    position: "relative",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  modalBody: {
    padding: "40px",
    overflowY: "auto",
    flex: 1,
  },
  closeIconBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    background: "var(--bg-content)",
    color: "var(--text-secondary)",
    cursor: "pointer",
    transition: "all 0.2s ease",
    zIndex: 100,
  },
  image: {
    width: "100%",
    maxHeight: "200px",
    objectFit: "contain",
    borderRadius: "12px",
    marginTop: "12px",
    display: "block",
    background: "var(--bg-body)",
    padding: "8px",
  },
  updateBtn: {
    padding: "12px 24px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
  },
};

export default AssignedComplaints;
