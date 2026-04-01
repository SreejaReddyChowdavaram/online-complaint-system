import dashboardHandler from "../api-handlers/_admin/dashboard.js";
import usersHandler from "../api-handlers/_admin/users.js";
import complaintsHandler from "../api-handlers/_complaints/index.js";

export default async function handler(req, res) {
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
  const action = pathname.split("/").filter(Boolean).pop();

  switch (action) {
    case "dashboard":
    case "dashboard-data": // 🔹 Support for both common frontend calls
      return dashboardHandler(req, res);
    case "users":
      return usersHandler(req, res);
    case "complaints": // 🔹 Added route for full complaints list
      return complaintsHandler(req, res);
    default:
      return res.status(404).json({ message: `Admin endpoint '${action}' not found` });
  }
}
