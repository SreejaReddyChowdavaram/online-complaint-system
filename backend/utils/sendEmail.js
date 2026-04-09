import nodemailer from "nodemailer";

/**
 * Reusable email utility using Gmail SMTP
 * This replaces Resend to allow sending OTPs to all users for free.
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 */
const sendEmail = async (to, subject, html) => {
  // 1. Create a transporter with Gmail configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // ✅ Use App Password
    },
  });

  // 2. Configure mail options
  const mailOptions = {
    from: `"Online Civic Complaint System" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    html: html,
  };

  try {
    // 3. Send email and wait for result
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP Email sent successfully: ${info.messageId}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ SMTP Email Error (${to}):`, error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default sendEmail;