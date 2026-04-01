import jwt from "jsonwebtoken";
import dbConnect from "./db.js";
import User from "../models/User.js";

/**
 * Middleware wrapper for Vercel Serverless Functions
 * @param {Function} handler - The API handler to wrap
 * @param {Array} roles - Optional roles required for the route
 */
export const withAuth = (handler, roles = []) => {
  return async (req, res) => {
    try {
      await dbConnect();
      
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized. No token." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found." });
      }

      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `User role '${req.user.role}' is not authorized to access this route`,
        });
      }

      return handler(req, res);
    } catch (error) {
      console.error("AUTH MIDDLEWARE ERROR:", error);
      return res.status(401).json({ success: false, message: "Not authorized. Invalid token." });
    }
  };
};
