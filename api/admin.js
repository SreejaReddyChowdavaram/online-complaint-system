import dashboardHandler from "./_admin/dashboard.js";
import usersHandler from "./_admin/users.js";

export default async function handler(req, res) {
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
  const parts = pathname.split("/").filter(Boolean);
  const action = parts[2] || "";

  switch (action) {
    case "dashboard":
      return dashboardHandler(req, res);
    case "users":
      return usersHandler(req, res);
    default:
      return res.status(404).json({ message: `Admin endpoint '${action}' not found` });
  }
}
