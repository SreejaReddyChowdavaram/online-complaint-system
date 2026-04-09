import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    const response = await resend.emails.send({
      from: "Online Civic Complaint System <onboarding@resend.dev>",
      to: to,
      subject: subject,
      html: html, // ✅ IMPORTANT FIX
    });

    console.log("✅ Email sent:", response);

    return { success: true };
  } catch (error) {
    console.error("❌ Email Error:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

export default sendEmail;