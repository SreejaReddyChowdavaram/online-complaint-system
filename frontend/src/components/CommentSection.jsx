import React, { useState } from "react";
import axios from "axios";

const CommentSection = ({ complaintId, refresh }) => {
  const [text, setText] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    if (!text.trim()) return;

    await axios.post(
      `/api/complaints/comment/${complaintId}`,
      { text },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setText("");
    refresh(); // 🔥 IMPORTANT
  };

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write comment..."
      />
      <button onClick={handleSubmit}>Post</button>
    </div>
  );
};

export default CommentSection;