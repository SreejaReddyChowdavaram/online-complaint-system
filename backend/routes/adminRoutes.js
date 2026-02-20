import express from "express";

import {
  getDashboardStats,
  getAllComplaints,
  assignComplaint,
  getAllOfficers
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", getDashboardStats);
router.get("/complaints", getAllComplaints);
router.get("/officers", getAllOfficers);
router.post("/assign", assignComplaint);

export default router;
