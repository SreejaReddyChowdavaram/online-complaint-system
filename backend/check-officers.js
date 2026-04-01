import "./config/loadEnv.js";
import connectDB from "./config/database.js";
import User from "./models/User.js";

const checkUsers = async () => {
  await connectDB();
  const officers = await User.find({ role: "Officer" });
  console.log("Officers in DB:", officers.map(u => ({ id: u._id, name: u.name, dept: u.department })));
  process.exit(0);
};

checkUsers();
