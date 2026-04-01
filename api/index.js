import connectDB from "../backend/config/database.js";
import app from "../backend/app.js";
import serverless from "serverless-http";

const handler = serverless(app);

export default async (req, res) => {
  await connectDB(); // ✅ keep

  return handler(req, res);
};