import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  // 1. Pre-flight Check
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("❌ SMTP Configuration Missing: SMTP_USER or SMTP_PASS is not set in environment variables.");
    return { success: false, error: "Email configuration missing on server." };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // 2. Add timeouts to avoid hanging requests
      connectionTimeout: 10000, // 10s
      greetingTimeout: 10000,   // 10s
      socketTimeout: 10000,     // 10s
    });

    console.log(`📡 Attempting to send email to: ${to}...`);

    await transporter.sendMail({
      from: `"Online Civic Complaint System" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent successfully to: ${to}`);
    return { success: true };

  } catch (error) {
    console.error(`❌ Email error for ${to}:`, error.message);
    return { success: false, error: error.message || "Failed to deliver email" };
  }
};

export default sendEmail;