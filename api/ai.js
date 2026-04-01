import aiHandler from "./_ai/index.js";

export default async function handler(req, res) {
  // AI routing is simple as it's usually just one /api/ai endpoint
  return aiHandler(req, res);
}
