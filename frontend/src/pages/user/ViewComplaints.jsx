import { useEffect, useState } from "react";
import axios from "axios";
import "./ViewComplaints.css";

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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const getStatusClasses = (status) => {
    if (status === "Pending")
      return {
        badge: "status pending",
        card: "complaint-card card-pending",
      };

    if (status === "In Progress")
      return {
        badge: "status in-progress",
        card: "complaint-card card-progress",
      };

    if (status === "Resolved")
      return {
        badge: "status resolved",
        card: "complaint-card card-resolved",
      };

    return {
      badge: "status",
      card: "complaint-card",
    };
  };

if (loading) {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Loading complaints...</p>
    </div>
  );
}
  return (
    <div className="complaints-page">

      {/* ================= MY COMPLAINTS ================= */}
      <h2 className="section-title">📄 My Complaints</h2>

      {myComplaints.length === 0 ? (
        <p className="empty-text">No complaints submitted yet.</p>
      ) : (
        <div className="complaints-grid">
          {myComplaints.map((c) => {
            const classes = getStatusClasses(c.status);

            return (
              <div
                key={c._id}
                className={classes.card}
                onClick={() => setSelectedComplaint(c)}
              >
                <div className="card-header">
                  <div className="complaint-title">{c.title}</div>
                  <span className={classes.badge}>
                    {c.status}
                  </span>
                </div>

                <div className="complaint-category">
                  {c.category}
                </div>

                <div className="complaint-date">
                  {new Date(c.createdAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= ALL COMPLAINTS ================= */}
      <h2 className="section-title">🌍 All Complaints</h2>

      {allComplaints.length === 0 ? (
        <p className="empty-text">No complaints available.</p>
      ) : (
        <div className="complaints-grid">
          {allComplaints.map((c) => {
            const classes = getStatusClasses(c.status);

            return (
              <div
                key={c._id}
                className={classes.card}
                onClick={() => setSelectedComplaint(c)}
              >
                <div className="card-header">
                  <div className="complaint-title">{c.title}</div>
                  <span className={classes.badge}>
                    {c.status}
                  </span>
                </div>

                <div className="complaint-category">
                  {c.category}
                </div>

                <div className="complaint-date">
                  {new Date(c.createdAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {selectedComplaint && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedComplaint(null)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedComplaint.title}</h2>

            <p><strong>Category:</strong> {selectedComplaint.category}</p>
            <p><strong>Description:</strong> {selectedComplaint.description}</p>
            <p><strong>Status:</strong> {selectedComplaint.status}</p>
            <p>
              <strong>Date Submitted:</strong>{" "}
              {new Date(selectedComplaint.createdAt).toLocaleString()}
            </p>

            {selectedComplaint.images?.length > 0 && (
              <div className="modal-images">
                <strong>📸 Citizen Images</strong>
                {selectedComplaint.images.map((img, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000${img}`}
                    alt="complaint"
                  />
                ))}
              </div>
            )}

            {selectedComplaint.resolutionImage && (
              <div className="modal-images">
                <strong>✅ Officer Proof</strong>
                <img
                  src={`http://localhost:5000/uploads/${selectedComplaint.resolutionImage}`}
                  alt="resolution"
                />
              </div>
            )}

            <button
              className="close-btn"
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

export default ViewComplaints;