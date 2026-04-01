import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import officerRoutes from "./routes/officerRoutes.js";
import aiRoutes from "./routes/ai.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { getDashboardStats } from "./controllers/adminController.js";

const app = express();

/* ---------------- PATH FIX FOR ES MODULE ---------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- CORS ---------------- */
app.use(cors({
  origin: [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
  credentials: true
}));

/* ---------------- BODY PARSER ---------------- */
app.use(express.json());

/* ---------------- SERVE UPLOADS ---------------- */
app.use("/uploads", express.static("uploads"));

/* ---------------- ROUTES ---------------- */
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/officer", officerRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);
app.get("/api/dashboard-stats", getDashboardStats);
/* ---------------- HEALTH CHECK ---------------- */
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

export default app;