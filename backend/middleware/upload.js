import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "jan_suvidha", // Folder in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }], // Sensible limits
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;
