import Complaint from "../models/Complaint.js";
import multer from "multer";
import fs from "fs";
import path from "path";

/* =====================================================
   📦 MULTER CONFIG (Upload to /uploads folder)
===================================================== */

const uploadPath = "uploads";

// Create uploads folder if not exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });

/* =====================================================
   👮 GET ASSIGNED COMPLAINTS
===================================================== */

export const getAssignedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      assignedTo: req.user._id,
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error("GET ASSIGNED ERROR:", error);
    res.status(500).json({ message: "Error fetching assigned complaints" });
  }
};

/* =====================================================
   🔥 UPDATE STATUS + RESOLUTION IMAGE (FINAL FIXED)
===================================================== */

export const updateComplaint = async (req, res) => {
  try {
    console.log("Updating complaint:", req.params.id);
    console.log("Status:", req.body.status);
    console.log("File:", req.file);

    const updateData = {
      status: req.body.status,
    };

    // If officer uploaded proof image
    if (req.file) {
      updateData.resolutionImage = req.file.filename;
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({
      message: "Complaint updated successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: "Update failed" });
  }
};
