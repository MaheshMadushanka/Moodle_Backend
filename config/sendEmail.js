import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const getTransporter = () => {
  const user = process.env.USER_EMAIL;
  const pass = process.env.USER_PASS;

  if (!user || !pass) {
    throw new Error(
      "Email credentials are missing. Set USER_EMAIL and USER_PASS in .env",
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
};

const sendEmail = async (email, message, subject) => {
  try {
    const transporter = getTransporter();
    const mailOptions = {
      from: `"VTC" <${process.env.USER_EMAIL}>`,
      to: email,
      subject: subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", email);
  } catch (error) {
    console.error("Email send error:", error);
    const code = error?.code ? ` (${error.code})` : "";
    const details = error?.message ? `: ${error.message}` : "";
    throw new Error(`Failed to send email${code}${details}`);
  }
};

export default sendEmail;