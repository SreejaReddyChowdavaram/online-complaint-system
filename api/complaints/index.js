import Complaint from "../../models/Complaint.js";
import Comment from "../../models/Comment.js";
import User from "../../models/User.js";
import { withAuth } from "../../lib/authMiddleware.js";
import { parseMultipartForm } from "../../lib/formParser.js";
import { autoAssignOfficer } from "../../utils/assignmentHelper.js";
import { sendNotification } from "../../utils/notificationHelper.js";

export const config = {
  api: {
    bodyParser: false, // Disabling bodyParser for multipart Parsing
  },
};

const handler = async (req, res) => {
  try {
    if (req.method === "GET") {
      const complaints = await Complaint.find()
        .populate("assignedTo", "name department email")
        .sort({ createdAt: -1 });

      const complaintsWithCounts = await Promise.all(
        complaints.map(async (c) => {
          const count = await Comment.countDocuments({ complaintId: c._id });
          return { ...c.toObject(), commentCount: count };
        })
      );

      return res.status(200).json(complaintsWithCounts);
    } 

    if (req.method === "POST") {
      const { fields, files } = await parseMultipartForm(req);
      const { title, category, description, address, latitude, longitude } = fields;

      if (!title || !category || !description || !latitude || !longitude) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // 📝 NOTE: Vercel does not support persistent local storage like 'uploads/'.
      // For images to work on Vercel, use Cloudinary or Vercel Blob.
      // This logic provides the structure for filename extraction.
      const images = [];
      if (files.files) {
         const fileList = Array.isArray(files.files) ? files.files : [files.files];
         fileList.forEach(file => {
           images.push(file.newFilename || file.name);
         });
      }

      const complaint = await Complaint.create({
        title,
        category,
        description,
        location: {
          address,
          lat: Number(latitude),
          lng: Number(longitude),
        },
        images,
        userId: req.user._id,
      });

      const assignedOfficer = await autoAssignOfficer(complaint);

      // Notify Admins
      try {
        const admins = await User.find({ role: "Admin" });
        await Promise.all(admins.map(admin => 
          sendNotification({
            userId: admin._id,
            role: "Admin",
            message: "📩 New complaint submitted",
            type: "info",
            targetId: complaint._id
          })
        ));
      } catch (err) {
        console.error("Notification Error:", err);
      }

      return res.status(201).json({
        success: true,
        message: assignedOfficer 
          ? `Complaint assigned to ${assignedOfficer.name}` 
          : "Complaint submitted successfully (Pending Review)",
        complaint,
      });
    }

    return res.status(405).json({ message: "Method not allowed" });

  } catch (error) {
    console.error("COMPLAINTS HANDLER ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default withAuth(handler);
