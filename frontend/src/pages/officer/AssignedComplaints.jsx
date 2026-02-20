import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function AssignedComplaints() {
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
      const assignedRes = await axios.get(
        `${API_URL}/officer/assigned`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const allRes = await axios.get(
        `${API_URL}/complaints`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

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

      await axios.put(
        `${API_URL}/officer/update/${selected._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Updated Successfully");
      setSelected(null);
      fetchData();
    } catch (error) {
      console.error("Update error:", error);
      alert("Update Failed");
    }
  };

  const getCardStyle = (status) => {
    if (status === "Pending")
      return { background: "#fff3cd", borderLeft: "6px solid #ffc107" };

    if (status === "In Progress")
      return { background: "#cce5ff", borderLeft: "6px solid #007bff" };

    if (status === "Resolved")
      return { background: "#d4edda", borderLeft: "6px solid #28a745" };

    return {};
  };

  const isAssigned = (complaintId) => {
    return assigned.some((a) => a._id === complaintId);
  };

  return (
    <div style={{ padding: "25px" }}>

      {/* ================= ASSIGNED ================= */}
      <h2>📌 Assigned Complaints</h2>

      <div style={styles.grid}>
        {assigned.length === 0 ? (
          <p>No assigned complaints.</p>
        ) : (
          assigned.map((c) => (
            <div
              key={c._id}
              style={{ ...styles.card, ...getCardStyle(c.status) }}
              onClick={() => {
                setSelected(c);
                setStatus(c.status);
              }}
            >
              <h3>{c.title}</h3>
              <p>{c.category}</p>
              <p><strong>Status:</strong> {c.status}</p>
              <p style={{ fontSize: "13px" }}>
                {new Date(c.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* ================= ALL ================= */}
      <h2 style={{ marginTop: "50px" }}>🌍 All Complaints</h2>

      <div style={styles.grid}>
        {allComplaints.map((c) => (
          <div
            key={c._id}
            style={{ ...styles.card, ...getCardStyle(c.status) }}
            onClick={() => {
              setSelected(c);
              setStatus(c.status);
            }}
          >
            <h3>{c.title}</h3>
            <p>{c.category}</p>
            <p><strong>Status:</strong> {c.status}</p>
            <p style={{ fontSize: "13px" }}>
              {new Date(c.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div style={styles.overlay} onClick={() => setSelected(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

            <h2>{selected.title}</h2>

            <p><strong>Category:</strong> {selected.category}</p>
            <p><strong>Description:</strong> {selected.description}</p>

            <p>
              <strong>Submitted By:</strong>{" "}
              {selected.userId?.name} ({selected.userId?.email})
            </p>

            <p>
              <strong>Date Submitted:</strong>{" "}
              {new Date(selected.createdAt).toLocaleString()}
            </p>

            {/* Citizen Images */}
            {selected.images?.length > 0 && (
              <div style={{ marginTop: "15px" }}>
                <strong>📸 Citizen Images</strong>
                {selected.images.map((img, i) => (
                  <img
                    key={i}
                    src={`http://localhost:5000${img}`}
                    alt="complaint"
                    style={styles.image}
                  />
                ))}
              </div>
            )}

            {/* Resolution Proof */}
            {selected.resolutionImage && (
              <div style={{ marginTop: "15px" }}>
                <strong>✅ Resolution Proof</strong>
                <img
                  src={`http://localhost:5000/uploads/${selected.resolutionImage}`}
                  alt="resolution"
                  style={styles.image}
                />
              </div>
            )}

            {/* Show update section ONLY if assigned */}
            {isAssigned(selected._id) && (
              <>
                <br />
                <label>Status:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>

                <br /><br />

                <label>Upload Resolution Proof:</label>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />

                <br /><br />

                <button onClick={handleUpdate} style={styles.updateBtn}>
                  Update
                </button>
              </>
            )}

            <button
              onClick={() => setSelected(null)}
              style={styles.closeBtn}
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

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
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "700px",
    maxHeight: "80vh",
    overflowY: "auto",
    textAlign: "left",
  },
  image: {
    width: "220px",
    height: "140px",
    objectFit: "cover",
    borderRadius: "8px",
    marginTop: "10px",
    display: "block",
  },
  updateBtn: {
    padding: "8px 16px",
    marginRight: "10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  closeBtn: {
    padding: "8px 16px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default AssignedComplaints;
