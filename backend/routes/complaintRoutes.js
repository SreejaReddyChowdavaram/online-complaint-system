import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import Complaint from "../models/Complaint.js";

const router = express.Router();

/* ===============================
   POST COMPLAINT
================================ */
router.post(
  "/post",
  protect,
  upload.array("files", 5),
  async (req, res) => {
    try {
      const {
        title,
        category,
        description,
        latitude,
        longitude,
      } = req.body;

      if (
        !title ||
        !category ||
        !description ||
        !latitude ||
        !longitude
      ) {
        return res.status(400).json({
          message: "Missing required fields",
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          message: "No files uploaded",
        });
      }

      const images = req.files.map(
        (file) => `/uploads/${file.filename}`
      );

      const complaint = await Complaint.create({
        title,
        category,
        description,
        location: {
          lat: Number(latitude),
          lng: Number(longitude),
        },
        images,
        userId: req.user.id,
      });

      res.status(201).json({
        message: "Complaint submitted successfully",
        complaint,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: err.message,
      });
    }
  }
);


/* ===============================
   GET USER COMPLAINTS
================================ */
router.get("/user", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* ===============================
   GET ALL COMPLAINTS
================================ */
router.get("/", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
