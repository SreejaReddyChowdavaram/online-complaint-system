import mongoose from "mongoose";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const reset = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    const user = await User.findOneAndUpdate(
      { email: "admin1@gmail.com" },
      { password: hashedPassword, role: "Admin" },
      { new: true }
    );

    if (user) {
      console.log("Password reset for admin1@gmail.com. Role confirmed as Admin.");
    } else {
      console.log("User admin1@gmail.com not found.");
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

reset();
