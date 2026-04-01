import indexHandler from "./_complaints/index.js";
import userHandler from "./_complaints/user.js";
import idHandler from "./_complaints/[id].js";
import commentHandler from "./_complaints/comment.js";
import commentsHandler from "./_complaints/comments.js";
import upvoteHandler from "./_complaints/upvote.js";
import downvoteHandler from "./_complaints/downvote.js";

export default async function handler(req, res) {
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
  const parts = pathname.split("/").filter(Boolean);
  const action = parts[2] || ""; // e.g. /api/complaints/xyz -> action = xyz

  if (!action) {
    return indexHandler(req, res);
  }

  switch (action) {
    case "user":
      return userHandler(req, res);
    case "comment":
      return commentHandler(req, res);
    case "comments":
      return commentsHandler(req, res);
    case "upvote":
      return upvoteHandler(req, res);
    case "downvote":
      return downvoteHandler(req, res);
    default:
      // Treat as [id]
      req.query = { ...req.query, id: action };
      return idHandler(req, res);
  }
}
