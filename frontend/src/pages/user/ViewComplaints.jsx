import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const ViewComplaints = () => {
  const [myComplaints, setMyComplaints] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myRes = await axios.get(
          `${API_URL}/complaints/user`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const allRes = await axios.get(
          `${API_URL}/complaints`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMyComplaints(myRes.data);
        setAllComplaints(allRes.data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const getCardStyle = (status) => {
    switch (status) {
      case "Pending":
        return { backgroundColor: "#fff3cd", borderLeft: "6px solid #ffc107" };
      case "In Progress":
        return { backgroundColor: "#cce5ff", borderLeft: "6px solid #007bff" };
      case "Resolved":
        return { backgroundColor: "#d4edda", borderLeft: "6px solid #28a745" };
      default:
        return {};
    }
  };

  if (loading) return <p>Loading complaints...</p>;

  return (
    <div style={{ padding: "25px" }}>

      {/* ================= MY COMPLAINTS ================= */}
      <h2>📄 My Complaints</h2>

      {myComplaints.length === 0 ? (
        <p style={{ marginBottom: "30px" }}>
          No complaints submitted yet.
        </p>
      ) : (
        <div style={styles.grid}>
          {myComplaints.map((c) => (
            <div
              key={c._id}
              style={{ ...styles.card, ...getCardStyle(c.status) }}
              onClick={() => setSelectedComplaint(c)}
            >
              <h3>{c.title}</h3>
              <p>{c.category}</p>
              <p><strong>Status:</strong> {c.status}</p>
              <p style={{ fontSize: "13px", color: "#555" }}>
                {new Date(c.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ================= ALL COMPLAINTS ================= */}
      <h2 style={{ marginTop: "50px" }}>🌍 All Complaints</h2>

      {allComplaints.length === 0 ? (
        <p>No complaints available.</p>
      ) : (
        <div style={styles.grid}>
          {allComplaints.map((c) => (
            <div
              key={c._id}
              style={{ ...styles.card, ...getCardStyle(c.status) }}
              onClick={() => setSelectedComplaint(c)}
            >
              <h3>{c.title}</h3>
              <p>{c.category}</p>
              <p><strong>Status:</strong> {c.status}</p>
              <p style={{ fontSize: "13px", color: "#555" }}>
                {new Date(c.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {selectedComplaint && (
        <div style={styles.overlay} onClick={() => setSelectedComplaint(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

            <h2>{selectedComplaint.title}</h2>
            <p><strong>Category:</strong> {selectedComplaint.category}</p>
            <p><strong>Description:</strong> {selectedComplaint.description}</p>
            <p><strong>Status:</strong> {selectedComplaint.status}</p>
            <p>
              <strong>Date Submitted:</strong>{" "}
              {new Date(selectedComplaint.createdAt).toLocaleString()}
            </p>

            {/* Images */}
          {selectedComplaint.images &&
  selectedComplaint.images.length > 0 && (
    <div style={{ marginTop: "20px", textAlign: "left" }}>
      <strong>📸 Citizen Images</strong>
      {selectedComplaint.images.map((img, index) => (
        <img
          key={index}
          src={`http://localhost:5000${img}`}
          alt="complaint"
          style={styles.image}
        />
      ))}
    </div>
  )}

            {selectedComplaint.resolutionImage && (
              <div style={{ marginTop: "20px", textAlign: "left" }}>
                <strong>✅ Officer Proof</strong>
                <img
                  src={`http://localhost:5000/uploads/${selectedComplaint.resolutionImage}`}
                  alt="resolution"
                  style={styles.image}
                />
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
};

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
    transition: "0.2s",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
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
    width: "250px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
    marginTop: "10px",
    display: "block",
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

export default ViewComplaints;
