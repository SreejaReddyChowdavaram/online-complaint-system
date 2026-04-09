import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Must be false for Port 587 (STARTTLS)
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    logger: true, // Enable logging to see progress in Vercel console
    debug: true,  // Enable debug output
    family: 4     // Force IPv4 to avoid ENETUNREACH
  });

  const mailOptions = {
    from: `"Jan Suvidha Support" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    text: text
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;