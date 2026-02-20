import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";

/* ---------------- GET __dirname (ESM FIX) ---------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- MONGO URI CHECK ---------------- */
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGODB_URI is not set in .env");
  process.exit(1);
}

/* ---------------- START SERVER ---------------- */
const startServer = async () => {
  try {
    // ✅ Removed deprecated options (MongoDB v4+ doesn't need them)
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }

  /* 🔥 VERY IMPORTANT: SERVE UPLOADS */

  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );

  process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Rejection:", err);
    server.close(() => process.exit(1));
  });
};

startServer();
