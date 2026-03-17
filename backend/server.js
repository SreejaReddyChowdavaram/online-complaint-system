// Load environment variables and normalize names before importing other modules
import "./config/loadEnv.js";

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/database.js";
import app from "./app.js";   // use app from app.js

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/ai.js";   // ⭐ AI route

/* ---------------- GET __dirname (ESM FIX) ---------------- */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- START SERVER ---------------- */

const startServer = async () => {
  try {

    await connectDB();

    /* ROUTES */

    app.use("/api/user", userRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/ai", aiRoutes);   // ⭐ Gemini AI route

    const PORT = process.env.PORT || 5000;

    const server = app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );

    process.on("unhandledRejection", (err) => {
      console.error("❌ Unhandled Rejection:", err);
      server.close(() => process.exit(1));
    });

  } catch (err) {
    console.error("❌ Failed to start server due to MongoDB error:", err);
  }
};

startServer();