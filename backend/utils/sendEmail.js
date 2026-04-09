import { Resend } from "resend";

/**
 * Sends an email using Resend API.
 * This replaces Gmail SMTP to avoid production timeouts and connection blocks.
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Email body (text)
 */
const sendEmail = async (to, subject, text) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("❌ RESEND_API_KEY is missing in environment variables.");
    return { success: false, error: "Email configuration missing" };
  }

  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: "Jan Suvidha <onboarding@resend.dev>", // Use verified domain if available
      to: [to],
      subject: subject,
      text: text,
    });

    if (error) {
      console.error("❌ Resend API Error:", error.message);
      return { success: false, error: error.message };
    }

    console.log(`📧 Email sent successfully to ${to}`);
    return { success: true, id: data.id };
  } catch (error) {
    console.error("❌ Unexpected Email Error:", error.message);
    return { success: false, error: error.message };
  }
};

export default sendEmail;