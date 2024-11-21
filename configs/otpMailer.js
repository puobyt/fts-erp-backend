const nodemailer = require("nodemailer");
require("dotenv").config();
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "jishnuanil255@gmail.com",
//     pass: "ytdi bmwq kals piha",
//   },
// });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: 'jishnuanil255@gmail.com', 
    pass: 'jvbp ugow zkll hjpg', 
  },
  tls: {
    rejectUnauthorized: false,
  },
});

function sendMail(email, otp) {
  const mailOptions = {
    from: "Admin Authentication",
    to: email,
    subject: "Your One-Time Password (OTP) for Verification",
    html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #4CAF50;">Verification Code</h2>
            <p>Dear User,</p>
            <p>Thank you for using our service. Your One-Time Password (OTP) for verification is:</p>
            <div style="margin: 20px 0; padding: 10px; font-size: 20px; font-weight: bold; color: #ffffff; background-color: #4CAF50; border-radius: 5px; text-align: center;">
              ${otp}
            </div>
            <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
            <p>If you did not request this verification, please contact our support team immediately.</p>
            <br>
            <p>Best Regards,</p>
            <p><strong>Admin Authentication Team</strong></p>
          </div>
        `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
}

module.exports = sendMail;
