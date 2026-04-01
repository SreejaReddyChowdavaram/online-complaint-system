import aiHandler from "../api-handlers/_ai/chat.js";

export default async function handler(req, res) {
  // AI routing is simple as it's usually just one /api/ai endpoint
  return aiHandler(req, res);
}
