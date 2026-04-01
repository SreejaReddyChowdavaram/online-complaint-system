import meHandler from "../api-handlers/_users/me.js";
import profileHandler from "../api-handlers/_users/profile.js";
import changePasswordHandler from "../api-handlers/_users/change-password.js";

export default async function handler(req, res) {
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
  const parts = pathname.split("/").filter(Boolean);
  const action = parts[2] || "";

  switch (action) {
    case "me":
      return meHandler(req, res);
    case "profile":
      return profileHandler(req, res);
    case "change-password":
      return changePasswordHandler(req, res);
    default:
      return res.status(404).json({ message: `User endpoint '${action}' not found` });
  }
}
