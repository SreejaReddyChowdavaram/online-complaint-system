import dbConnect from "../../lib/db.js";
import Complaint from "../../models/Complaint.js";
import { withAuth } from "../../lib/authMiddleware.js";
import { parseMultipartForm } from "../../lib/formParser.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method !== "POST" && req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  try {
    await dbConnect();
    
    // Parse form data (for potential resolution image)
    const { fields, files } = await parseMultipartForm(req);
    const { status } = fields;

    const updateData = { status };

    // Handle resolution image if provided
    if (files.file) {
      // Note: Vercel storage is ephemeral. Use Cloudinary for persistence.
      updateData.resolutionImage = files.file.newFilename || files.file.name;
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    return res.status(200).json({
      message: "Complaint updated successfully",
      complaint: updatedComplaint,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default withAuth(handler, ["Officer"]);
