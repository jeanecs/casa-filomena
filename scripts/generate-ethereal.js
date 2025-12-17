// Generate Nodemailer Ethereal test account credentials and print .env lines
const nodemailer = require('nodemailer');
try { require('dotenv').config(); } catch {}

(async () => {
  try {
    const account = await nodemailer.createTestAccount();
    console.log('Ethereal SMTP details (paste into .env):\n');
    console.log(`SMTP_HOST=${account.smtp.host}`);
    console.log(`SMTP_PORT=${account.smtp.port}`);
    console.log(`SMTP_USER=${account.user}`);
    console.log(`SMTP_PASS=${account.pass}`);
    console.log(`MAIL_FROM="Villa Bookings <${account.user}>"`);
    console.log('\nWeb preview inbox:', account.web);
    console.log('Hint: use npm run mail:test after updating .env');
  } catch (err) {
    console.error('Failed to create Ethereal test account');
    console.error(err);
    process.exit(1);
  }
})();
