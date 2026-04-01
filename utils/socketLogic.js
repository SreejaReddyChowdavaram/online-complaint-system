import { Server } from "socket.io";

let io;
const userSocketMap = new Map(); // userId -> socketId

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("⚡ New Socket Connection:", socket.id);

    // Register user
    socket.on("register", (userId) => {
      if (userId) {
        userSocketMap.set(userId, socket.id);
        console.log(`👤 User ${userId} registered with socket ${socket.id}`);
      }
    });

    socket.on("disconnect", () => {
      // Find and remove userId from map
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          console.log(`👋 User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    console.warn("⚠️ Socket.io not initialized (Expected in serverless environment)");
    return null;
  }
  return io;
};

export const sendSocketNotification = (userId, data) => {
  if (!io) {
    return false;
  }
  const socketId = userSocketMap.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit("notification", data);
    return true;
  }
  return false;
};

