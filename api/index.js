import dotenv from "dotenv";
import connectDB from "../backend/config/database.js";
import app from "../backend/app.js";

// Load environment variables early
dotenv.config();

/**
 * PRODUCTION-READY SERVERLESS HANDLER
 * 
 * Vercel-specific entry point that handles:
 * 1. Database connection initialization/reuse.
 * 2. Express application routing.
 * 3. Graceful error handling for cold starts.
 */
const handler = async (req, res) => {
  try {
    // 1. Ensure Database is connected
    await connectDB();

    // 2. Pass request to Express app
    return app(req, res);
  } catch (error) {
    console.error("🚨 [FATAL HANDLER ERROR]:", error);
    
    // Ensure we always return a JSON response even if the app crashes
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "A fatal error occurred in the serverless handler.",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal Server Error"
      });
    }
  }
};

export default handler;

