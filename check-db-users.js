import mongoose from "mongoose";
import User from "./backend/models/User.js";
import dotenv from "dotenv";

dotenv.config({ path: "./backend/.env" });

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const users = await User.find({ email: /admin/i });
    console.log("Admin-like users found:", users.map(u => ({ email: u.email, role: u.role })));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

check();
