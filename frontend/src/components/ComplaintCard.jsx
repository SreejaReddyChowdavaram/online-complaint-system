import React, { useState } from "react";
import axios from "axios";
import CommentSection from "./CommentSection";

const ComplaintCard = ({ complaint, refresh }) => {
  const [showComments, setShowComments] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // ✅ Find current user's vote
  const userVote = complaint.votes?.find(
    (v) =>
      v.user === userId ||
      v.user?._id === userId
  );

  const isUpvoted = userVote?.voteType === "upvote";
  const isDownvoted = userVote?.voteType === "downvote";

  // ✅ UPVOTE
  const handleUpvote = async () => {
    try {
      await axios.post(
        `/api/complaints/upvote/${complaint._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      refresh(); // 🔥 refresh data
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // ✅ DOWNVOTE
  const handleDownvote = async () => {
    try {
      await axios.post(
        `/api/complaints/downvote/${complaint._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      refresh();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "8px",
      }}
    >
      <h3>{complaint.title}</h3>
      <p>{complaint.description}</p>

      {/* IMAGE */}
      {complaint.images && complaint.images.length > 0 && (
        <img
          src={`http://localhost:5000${complaint.images[0]}`}
          alt="complaint"
          width="200"
          style={{ marginTop: "10px" }}
        />
      )}

      {/* VOTES */}
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={handleUpvote}
          style={{
            backgroundColor: isUpvoted ? "green" : "white",
            color: isUpvoted ? "white" : "black",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          👍 {complaint.upvotes}
        </button>

        <button
          onClick={handleDownvote}
          style={{
            backgroundColor: isDownvoted ? "red" : "white",
            color: isDownvoted ? "white" : "black",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginLeft: "10px",
            cursor: "pointer",
          }}
        >
          👎 {complaint.downvotes}
        </button>

        <button
          style={{
            marginLeft: "10px",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
          onClick={() => setShowComments(!showComments)}
        >
          💬 Comments ({complaint.comments?.length || 0})
        </button>
      </div>

      {/* COMMENTS */}
      {showComments && (
        <CommentSection
          complaintId={complaint._id}
          refresh={refresh}
        />
      )}
    </div>
  );
};

export default ComplaintCard;