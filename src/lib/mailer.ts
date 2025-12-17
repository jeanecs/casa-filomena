import nodemailer from "nodemailer";

const port = Number(process.env.SMTP_PORT || 587);
const secure = String(process.env.SMTP_SECURE || "").toLowerCase() === "true" || port === 465;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function sendBookingEmail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
}