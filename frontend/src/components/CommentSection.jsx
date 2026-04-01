import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const CommentSection = ({ complaintId, isReadOnly = false }) => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/complaints/comments/${complaintId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [complaintId]);

  const handleSubmit = async () => {
    if (!text.trim() || isReadOnly) return;

    try {
      await axios.post(
        `/api/complaints/comment/${complaintId}`,
        { text },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setText("");
      fetchComments(); // Refresh list immediately
    } catch (err) {
      alert("Failed to post comment");
    }
  };

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>{t("complaints.comments_count")} ({comments.length})</h4>

      {/* INPUT */}
      {!isReadOnly && (
        <div style={styles.inputGroup}>
          <input
            style={styles.input}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("complaints.modal_add_comment")}
          />
          <button style={styles.btn} onClick={handleSubmit}>
            {t("complaints.modal_post_btn")}
          </button>
        </div>
      )}

      {/* LIST */}
      <div style={styles.list}>
        {loading ? (
          <p>{t("complaints.loading")}</p>
        ) : comments.length > 0 ? (
          comments.map((c) => (
            <div key={c._id} style={styles.commentItem}>
              <div style={styles.commentUser}>{c.userId?.name || "User"}</div>
              <p style={styles.msg}>{c.message}</p>
              <div style={styles.date}>
                {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        ) : (
          <p style={styles.empty}>{t("complaints.modal_no_comments")}.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: "15px",
    paddingTop: "15px",
    borderTop: "1px solid var(--border-color)",
  },
  title: {
    marginBottom: "10px",
    fontSize: "14px",
    color: "var(--text-primary)",
  },
  inputGroup: {
    display: "flex",
    gap: "8px",
    marginBottom: "15px",
  },
  input: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: "20px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-content)",
    color: "var(--text-primary)",
    fontSize: "13px",
  },
  btn: {
    padding: "8px 16px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "13px",
  },
  list: {
    maxHeight: "300px",
    overflowY: "auto",
  },
  commentItem: {
    marginBottom: "12px",
    padding: "8px 12px 18px 12px",
    backgroundColor: "var(--bg-body)",
    color: "var(--text-primary)",
    borderRadius: "12px",
    position: "relative",
    maxWidth: "85%",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    border: "1px solid var(--border-color)",
  },
  commentUser: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: "2px",
  },
  date: {
    position: "absolute",
    bottom: "4px",
    right: "8px",
    fontSize: "10px",
    color: "var(--text-secondary)",
  },
  msg: {
    fontSize: "13px",
    color: 'var(--text-primary)',
    margin: 0,
  },
  empty: {
    fontSize: "13px",
    color: "#999",
    textAlign: "center",
  },
};

export default CommentSection;