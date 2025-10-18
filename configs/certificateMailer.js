const nodemailer = require("nodemailer");
require("dotenv").config();

// Reuse OTP mailer settings if desired; fall back to env config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER || "jishnuanil255@gmail.com",
    pass: process.env.MAIL_PASS || "ipod enmx brqn sqgp",
  },
});

function sendCertificateExpiryReminder(email, certificateName, expiryDate) {
  const expiry = new Date(expiryDate);
  const mailOptions = {
    from: "Certificate Reminder",
    to: email,
    subject: `Reminder: ${certificateName} expires on ${expiry.toDateString()}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #d9534f;">Certificate Expiry Reminder</h2>
        <p>Dear User,</p>
        <p>This is a reminder that the certificate <strong>${certificateName}</strong> will expire on <strong>${expiry.toDateString()}</strong>.</p>
        <p>Please take necessary action to renew it before it expires.</p>
        <br>
        <p>Best Regards,</p>
        <p><strong>FTS ERP</strong></p>
      </div>
    `,
  };

  return new Promise((resolve) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending certificate reminder email:", error);
        resolve({ ok: false, error: error.message });
      } else {
        console.log("Certificate reminder email sent:", info.response);
        resolve({ ok: true });
      }
    });
  });
}

module.exports = { sendCertificateExpiryReminder };


