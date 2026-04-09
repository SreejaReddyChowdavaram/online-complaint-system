import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 30000,
    family: 4, // Still force IPv4
    tls: {
      rejectUnauthorized: false, // Helps with some hosting providers
      minVersion: 'TLSv1.2'
    }
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