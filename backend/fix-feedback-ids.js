import "./config/loadEnv.js";
import mongoose from "mongoose";
import Feedback from "./models/Feedback.js";
import User from "./models/User.js";
import connectDB from "./config/database.js";

const fixFeedback = async () => {
  try {
    await connectDB();
    console.log("🔍 Looking for feedback with missing officerId...");

    const feedbacks = await Feedback.find({ officerId: { $exists: false } });
    console.log(`📝 Found ${feedbacks.length} records to fix.`);

    let fixedCount = 0;
    for (const f of feedbacks) {
      if (f.officerName && f.officerName !== "N/A") {
        const officer = await User.findOne({ 
          name: { $regex: new RegExp(`^${f.officerName}$`, "i") }, 
          role: "Officer" 
        });

        if (officer) {
          f.officerId = officer._id;
          await f.save();
          fixedCount++;
          console.log(`✅ Linked feedback ${f._id} to Officer ${officer.name}`);
        } else {
          console.log(`⚠️ Could not find officer for name: ${f.officerName}`);
        }
      }
    }

    console.log(`\n🎉 Data correction complete. Fixed ${fixedCount} records.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error fixing feedback:", err);
    process.exit(1);
  }
};

fixFeedback();
