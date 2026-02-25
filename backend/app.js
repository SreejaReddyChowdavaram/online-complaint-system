import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import officerRoutes from "./routes/officerRoutes.js";
const app = express();

/* ------------------- PATH FIX FOR ES MODULE ------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ------------------- CORS ------------------- */
app.use(cors());
/* ------------------- BODY PARSER ------------------- */
app.use(express.json());

/* ------------------- SERVE UPLOADS CORRECTLY ------------------- */
app.use("/uploads", express.static("uploads"));

/* ------------------- ROUTES ------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/officer", officerRoutes);
/* ------------------- TEST ROUTE ------------------- */
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

export default app;
