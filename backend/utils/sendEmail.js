import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text, retryCount = 1) => {
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
    dnsTimeout: 10000,
    family: 4
  });

  // Verify SMTP Connection
  try {
    await transporter.verify();
    console.log("✅ SMTP Ready");
  } catch (error) {
    console.error("❌ SMTP Error:", error.message);
  }

  const mailOptions = {
    from: `"Jan Suvidha" <${process.env.EMAIL}>`,
    to: to,
    subject: subject,
    text: text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Email Failed: ${error.message}`);
    if (retryCount > 0) {
      console.log(`🔄 Retrying... (${retryCount} left)`);
      return await sendEmail(to, subject, text, retryCount - 1);
    }
    return { success: false, error: error.message };
  }
};

export default sendEmail;