import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

const testConnection = async () => {
  console.log("🚀 Starting SMTP Connection Test...");
  console.log(`📧 User: ${process.env.EMAIL_USER}`);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    family: 4, // Force IPv4
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
