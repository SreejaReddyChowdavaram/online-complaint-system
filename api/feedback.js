import feedbackHandler from "../api-handlers/_feedback/index.js";
import allFeedbackHandler from "../api-handlers/_feedback/all.js";

export default async function handler(req, res) {
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
  const action = pathname.split("/").filter(Boolean).pop();

  if (action === "all") {
    return allFeedbackHandler(req, res);
  }

  // Default to index handler for /api/feedback (which handles POST)
  return feedbackHandler(req, res);
}
