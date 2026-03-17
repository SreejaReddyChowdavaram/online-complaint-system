import { useEffect, useState } from "react";
import axios from "axios";
import "./ViewComplaints.css";

const API_URL = "http://localhost:5000/api";

const ViewComplaints = () => {

  const [myComplaints, setMyComplaints] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  /* ================= FETCH COMPLAINTS ================= */

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



  /* ================= UPVOTE ================= */

  const handleUpvote = async (id) => {

    try {

      const res = await axios.post(
        `${API_URL}/complaints/upvote/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAllComplaints((prev) =>
        prev.map((c) =>
          c._id === id
            ? { ...c, upvotes: res.data.upvotes, downvotes: res.data.downvotes, votes: res.data.votes }
            : c
        )
      );

    } catch (err) {

      console.log(err);

    }

  };



  /* ================= DOWNVOTE ================= */

  const handleDownvote = async (id) => {

    try {

      const res = await axios.post(
        `${API_URL}/complaints/downvote/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAllComplaints((prev) =>
        prev.map((c) =>
          c._id === id
            ? { ...c, upvotes: res.data.upvotes, downvotes: res.data.downvotes, votes: res.data.votes }
            : c
        )
      );

    } catch (err) {

      console.log(err);

    }

  };


/* ================= FETCH COMMENTS ================= */

const fetchComments = async (complaintId) => {

  try {

    const res = await axios.get(
      `${API_URL}/comments/${complaintId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setComments(res.data);

  } catch (err) {

    console.log(err);

  }

};


/* ================= ADD COMMENT ================= */

const addComment = async (complaintId) => {

  if (!newComment.trim()) return;

  try {

    const res = await axios.post(
      `${API_URL}/comments/${complaintId}`,
      { message: newComment },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setComments((prev) => [...prev, res.data.comment]);

    setNewComment("");

  } catch (err) {

    console.error("Comment error:", err.response?.data || err);

  }

};



  /* ================= STATUS STYLE ================= */

  const getStatusClasses = (status) => {

    if (status === "Pending")
      return { badge: "status pending", card: "complaint-card card-pending" };

    if (status === "In Progress")
      return { badge: "status in-progress", card: "complaint-card card-progress" };

    if (status === "Resolved")
      return { badge: "status resolved", card: "complaint-card card-resolved" };

    return { badge: "status", card: "complaint-card" };

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

      <div className="complaints-grid">

        {myComplaints.map((c) => {

          const classes = getStatusClasses(c.status);

          return (

            <div
              key={c._id}
              className={classes.card}
              onClick={() => {
                setSelectedComplaint(c);
                fetchComments(c._id);
              }}
            >

              <div className="card-header">
                <div className="complaint-title">{c.title}</div>
                <span className={classes.badge}>{c.status}</span>
              </div>

              <div className="complaint-category">{c.category}</div>

              <div className="complaint-date">
                {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
              </div>

            </div>

          );

        })}

      </div>



      {/* ================= ALL COMPLAINTS ================= */}

      <h2 className="section-title">🌍 All Complaints</h2>

      <div className="complaints-grid">

        {allComplaints.map((c) => {

          const classes = getStatusClasses(c.status);

          const userUpvoted = c.votes?.some(
            (v) => v.user === userId && v.voteType === "upvote"
          );

          const userDownvoted = c.votes?.some(
            (v) => v.user === userId && v.voteType === "downvote"
          );

          return (

            <div
              key={c._id}
              className={classes.card}
              onClick={() => {
                setSelectedComplaint(c);
                fetchComments(c._id);
              }}
            >

              <div className="card-header">

                <div className="complaint-title">{c.title}</div>

                <span className={classes.badge}>{c.status}</span>

              </div>

              <div className="complaint-category">{c.category}</div>

              <div className="complaint-date">
                {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
              </div>


              {/* ===== VOTING ===== */}

              <div className="vote-section">

                <button
                  className={`vote-btn ${userUpvoted ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpvote(c._id);
                  }}
                >
                  👍 {c.upvotes || 0}
                </button>

                <button
                  className={`vote-btn ${userDownvoted ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownvote(c._id);
                  }}
                >
                  👎 {c.downvotes || 0}
                </button>

                <button
                  className="comment-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedComplaint(c);
                    fetchComments(c._id);
                  }}
                >
                  💬 Comment
                </button>

              </div>

            </div>

          );

        })}

      </div>



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



            {/* ===== CITIZEN IMAGES ===== */}

            {selectedComplaint.images?.length > 0 && (

              <div className="modal-images">

                <h4>📸 Citizen Uploaded Images</h4>

                <div className="image-grid">

                  {selectedComplaint.images.map((img, index) => (

                    <img
                      key={index}
                      src={`http://localhost:5000${img}`}
                      alt="complaint"
                    />

                  ))}

                </div>

              </div>

            )}



            {/* ===== OFFICER RESOLUTION IMAGE ===== */}

            {selectedComplaint.resolutionImage && (

              <div className="modal-images">

                <h4>✅ Officer Resolution Proof</h4>

                <img
                  src={`http://localhost:5000/uploads/${selectedComplaint.resolutionImage}`}
                  alt="resolution"
                />

              </div>

            )}



            {/* ===== COMMENTS ===== */}

            <div className="comment-box">

              <h3>💬 Comments</h3>

              {comments.length === 0 ? (
                <p>No comments yet</p>
              ) : (
                comments.map((com) => (
                  <div key={com._id} className="comment-item">
                    <b>{com.userId?.name || "User"}:</b> {com.message}
                  </div>
                ))
              )}

              <div className="comment-input">

                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />

                <button
                  onClick={() =>
                    addComment(selectedComplaint._id)
                  }
                >
                  Post
                </button>

              </div>

            </div>


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