import connectDB from "../backend/config/database.js";
import app from "../backend/app.js";
import serverless from "serverless-http";

// Wrap express app with serverless-http
const serverlessHandler = serverless(app);

/**
 * ⚡ DEFINITIVE VERCEL SERVERLESS HANDLER
 */
export default async (req, res) => {
  try {
    // 1. Ensure Database is connected (Cached internally)
    await connectDB();

    // 2. Delegate to serverless-http
    return await serverlessHandler(req, res);
  } catch (error) {
    console.error("🚨 [FATAL HANDLER ERROR]:", error);
    
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "A fatal error occurred in the serverless handler.",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal Server Error"
      });
    }
  }
};

