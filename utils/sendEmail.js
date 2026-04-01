import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
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