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
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    dnsTimeout: 10000,
    tls: {
      rejectUnauthorized: false
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