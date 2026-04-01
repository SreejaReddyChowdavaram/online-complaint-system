import mongoose from "mongoose";

/**
 * Global variable to cache the MongoDB connection.
 * In Vercel, this persists across multiple invocations of the same lambda.
 */
let isConnected = false;

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("⚡ [PROD] Using cached MongoDB connection");
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is not defined in environment variables");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false, // Disable buffering to fail fast in serverless
    });

    isConnected = db.connections[0].readyState;
    console.log(`✅ [PROD] MongoDB Connected: ${db.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
};

export default connectDB;
