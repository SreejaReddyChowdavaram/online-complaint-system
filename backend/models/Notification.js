import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  role: {
    type: String,
    enum: ["Admin", "Officer", "Citizen"],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  targetId: {
    type: String,
    required: false
  },
  type: {
    type: String,
    enum: ["info", "success", "warning", "ESCALATION"],
    default: "info"
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
