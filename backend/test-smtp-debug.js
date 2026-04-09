import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

const testConnection = async () => {
  console.log("🚀 Starting SMTP Connection Test...");
  console.log(`📧 User: ${process.env.EMAIL_USER}`);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    family: 4,
    logger: true,
    debug: true
  });

  try {
    console.log("⏳ Verifying connection...");
    await transporter.verify();
    console.log("✅ SUCCESS: SMTP connection established!");
  } catch (error) {
    console.error("❌ FAILED: SMTP connection error:", error.message);
    if (error.code === 'ENETUNREACH') {
      console.error("💡 Hint: Still hitting ENETUNREACH. This often means the environment strictly blocks port 465. Consider trying port 587.");
    }
  }
};

testConnection();
