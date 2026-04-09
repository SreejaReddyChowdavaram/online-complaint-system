import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 15000, // Increased to 15s
    greetingTimeout: 15000,
    socketTimeout: 30000,
    dnsTimeout: 10000,
    family: 4, // 🚀 FORCE IPv4 to fix ENETUNREACH
    tls: {
      rejectUnauthorized: false,
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