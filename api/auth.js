import loginHandler from "./_auth/login.js";
import registerHandler from "./_auth/register.js";
import adminLoginHandler from "./_auth/admin-login.js";
import googleHandler from "./_auth/google.js";
import resetPasswordHandler from "./_auth/reset-password.js";
import sendOtpHandler from "./_auth/send-otp.js";
import verifyOtpHandler from "./_auth/verify-otp.js";

export default async function handler(req, res) {
  // Extract path from URL (e.g., /api/auth/login -> login)
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
  const action = pathname.split("/").filter(Boolean).pop();

  switch (action) {
    case "login":
      return loginHandler(req, res);
    case "register":
      return registerHandler(req, res);
    case "admin-login":
      return adminLoginHandler(req, res);
    case "google":
      return googleHandler(req, res);
    case "reset-password":
      return resetPasswordHandler(req, res);
    case "send-otp":
      return sendOtpHandler(req, res);
    case "verify-otp":
      return verifyOtpHandler(req, res);
    default:
      return res.status(404).json({ 
        success: false, 
        message: `Authentication endpoint '${action}' not found at ${pathname}` 
      });
  }
}
