// Load environment variables and normalize names before importing other modules
import "./config/loadEnv.js";

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/database.js";
import app from "./app.js";   
import http from "http";
import { initSocket } from "./utils/socketLogic.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/ai.js";   // ⭐ AI route
import { initEscalationCron } from "./services/escalationService.js";

/* ---------------- GET __dirname (ESM FIX) ---------------- */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- START SERVER ---------------- */

const startServer = async () => {
  try {

    await connectDB();
    initEscalationCron();

    const PORT = process.env.PORT || 5000;

    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use. Try another port or stop the existing process.`);
      } else {
        console.error("❌ Server start error:", err);
      }
      process.exit(1);
    });


    process.on("unhandledRejection", (err) => {
      console.error("❌ Unhandled Rejection:", err);
      server.close(() => process.exit(1));
    });

  } catch (err) {
    console.error("❌ Failed to start server due to MongoDB error:", err);
    process.exit(1);
  }
};

startServer();