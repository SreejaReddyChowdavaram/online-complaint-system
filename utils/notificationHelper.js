import Notification from "../models/Notification.js";
import { sendSocketNotification } from "./socketLogic.js";

/**
 * Centralized helper to send notifications via DB and Socket
 */
export const sendNotification = async ({ userId, role, message, type = "info", targetId = null }) => {
  try {
    // 1. Save to Database
    const notification = await Notification.create({
      userId,
      role,
      message,
      type,
      targetId
    });

    // 2. Emit via Socket.io if user is online
    sendSocketNotification(userId, {
      _id: notification._id,
      message,
      type,
      targetId,
      isRead: false,
      createdAt: notification.createdAt
    });

    return notification;
  } catch (err) {
    console.error("Error in sendNotification:", err);
    throw err;
  }
};
