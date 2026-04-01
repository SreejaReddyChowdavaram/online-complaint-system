import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("⚡ [PROD] Using cached MongoDB connection");
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is not defined");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });

    // ✅ FIXED LINE
    isConnected = db.connections[0].readyState === 1;

    console.log(`✅ MongoDB Connected: ${db.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB error:", error.message);
    throw error;
  }
};

export default connectDB;