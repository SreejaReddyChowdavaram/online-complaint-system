import feedbackHandler from "../api-handlers/_feedback/index.js";

export default async function handler(req, res) {
  // Feedback routing is simple as it's usually just /api/feedback
  return feedbackHandler(req, res);
}
