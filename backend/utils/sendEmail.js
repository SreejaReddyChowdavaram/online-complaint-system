import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  // Check env variables
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("❌ SMTP config missing");
    return { success: false, error: "Email config missing" };
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
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    console.log("📡 Sending email to:", to);

    await transporter.sendMail({
      from: `"Online Civic Complaint System" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent");

    return { success: true };

  } catch (error) {
    console.error("❌ Email error:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};

export default sendEmail;