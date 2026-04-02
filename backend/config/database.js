import mongoose from "mongoose";

/** 
 * Global is used here to maintain a cached connection across hot reloads
 * in development and globally in serverless environments like Vercel.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  if (cached.conn) {
    console.log("⚡ [PROD] Using cached MongoDB connection");
    return cached.conn;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is not defined");
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", e.message);
    throw e;
  }

  return cached.conn;
};

export default connectDB;