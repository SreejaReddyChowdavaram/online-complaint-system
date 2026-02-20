
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function ViewaComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  /* ---------------- FETCH COMPLAINTS ---------------- */
  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/complaints`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  /* ---------------- STATUS COLORS ---------------- */
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return {
          backgroundColor: "#fff3cd",
          borderLeft: "6px solid #ffc107",
        };
      case "In Progress":
        return {
          backgroundColor: "#cce5ff",
          borderLeft: "6px solid #007bff",
        };
      case "Resolved":
        return {
          backgroundColor: "#d4edda",
          borderLeft: "6px solid #28a745",
        };
      default:
        return {};
    }
  };

  if (loading) return <p>Loading complaints...</p>;

  return (
    <div style={{ padding: "25px" }}>
      <h1>All Complaints</h1>

      {/* ---------------- CARDS ---------------- */}
      <div style={styles.grid}>
        {complaints.map((complaint) => (
          <div
            key={complaint._id}
            style={{
              ...styles.card,
              ...getStatusStyle(complaint.status),
            }}
            onClick={() => setSelectedComplaint(complaint)}
          >
            <h3>{complaint.title}</h3>
            <p><strong>Category:</strong> {complaint.category}</p>
            <div style={styles.statusBadge}>{complaint.status}</div>
            <p style={styles.date}>
              {new Date(complaint.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* ---------------- MODAL ---------------- */}
      {selectedComplaint && (
        <div style={styles.overlay} onClick={() => setSelectedComplaint(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

            <h2>{selectedComplaint.title}</h2>

            <p><strong>Category:</strong> {selectedComplaint.category}</p>
            <p><strong>Description:</strong> {selectedComplaint.description}</p>
            <p><strong>Status:</strong> {selectedComplaint.status}</p>

            <p>
              <strong>Submitted By:</strong>{" "}
              {selectedComplaint.userId?.name} (
              {selectedComplaint.userId?.email})
            </p>

            <p>
              <strong>Date Submitted:</strong>{" "}
              {new Date(selectedComplaint.createdAt).toLocaleString()}
            </p>

            {/* ---------------- CITIZEN IMAGES ---------------- */}
          {selectedComplaint.images &&
  selectedComplaint.images.length > 0 && (
    <div style={{ marginTop: "20px" }}>
      <strong>📸 Citizen Uploaded Images:</strong>

      <div style={styles.imageContainer}>
        {selectedComplaint.images.map((img, index) => (
          <img
            key={index}
      src={`http://localhost:5000/uploads/${selectedComplaint.images[0].replace("uploads/", "").replace("services/uploads/", "")}`}
            alt="citizen"
            style={styles.image}
          />
        ))}
      </div>
    </div>
  )}

            {/* ---------------- OFFICER RESOLUTION IMAGE ---------------- */}
            {selectedComplaint.resolutionImage && (
              <div style={{ marginTop: "20px" }}>
                <strong>✅ Officer Resolution Proof:</strong>

                <div style={styles.imageContainer}>
                  <img
                    src={`http://localhost:5000/uploads/${selectedComplaint.resolutionImage}`}
                    alt="resolution"
                    style={styles.image}
                  />
                </div>
              </div>
            )}

            <button
              style={styles.closeBtn}
              onClick={() => setSelectedComplaint(null)}
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },

  card: {
    padding: "20px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "0.2s",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  statusBadge: {
    marginTop: "10px",
    padding: "5px 10px",
    borderRadius: "20px",
    display: "inline-block",
    fontSize: "13px",
    fontWeight: "600",
  },

  date: {
    marginTop: "8px",
    fontSize: "12px",
    color: "#555",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  modal: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "700px",
    maxHeight: "85vh",
    overflowY: "auto",
  },

  imageContainer: {
    display: "flex",
    gap: "15px",
    marginTop: "10px",
    flexWrap: "wrap",
  },

  image: {
    width: "200px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },

  closeBtn: {
    marginTop: "20px",
    padding: "10px 20px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default ViewaComplaints;
