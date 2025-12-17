// Send a simple test email using current .env SMTP settings
const nodemailer = require('nodemailer');
try { require('dotenv').config(); } catch {}

(async () => {
  try {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!host || !port || !user || !pass) {
      throw new Error('Missing SMTP_* env vars. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM.');
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      auth: { user, pass },
    });

    const to = process.env.TEST_EMAIL_TO || user;
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || user,
      to,
      subject: 'Test email from Webdev2 project',
      html: '<p>✅ SMTP is configured. This is a test email.</p>',
    });

    console.log('Message sent:', info.messageId);
    const preview = nodemailer.getTestMessageUrl && nodemailer.getTestMessageUrl(info);
    if (preview) console.log('Ethereal preview URL:', preview);
  } catch (err) {
    console.error('Failed to send test email');
    console.error(err);
    process.exit(1);
  }
})();
