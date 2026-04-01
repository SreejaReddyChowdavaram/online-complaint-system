import indexHandler from "./_notifications/index.js";
import markReadHandler from "./_notifications/mark-read.js";

export default async function handler(req, res) {
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
  const parts = pathname.split("/").filter(Boolean);
  const action = parts[2] || "";

  if (!action) {
    return indexHandler(req, res);
  }

  switch (action) {
    case "mark-read":
      return markReadHandler(req, res);
    default:
      return res.status(404).json({ message: `Notification endpoint '${action}' not found` });
  }
}
