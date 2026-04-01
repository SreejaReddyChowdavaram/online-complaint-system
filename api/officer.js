import complaintsHandler from "../api-handlers/_officer/complaints.js";
import updateHandler from "../api-handlers/_officer/update-complaint.js";

export default async function handler(req, res) {
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
  const parts = pathname.split("/").filter(Boolean);
  const action = parts[2] || "";

  switch (action) {
    case "complaints":
      return complaintsHandler(req, res);
    case "update-complaint":
      return updateHandler(req, res);
    default:
      return res.status(404).json({ message: `Officer endpoint '${action}' not found` });
  }
}
