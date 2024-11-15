
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jishnuanil255@gmail.com",
    pass: "ytdi bmwq kals piha",
  },
}); 

 function sendMail(email, text) {
  const mailOptions = {
    from: "Admin Authentication",
    to: email,
    subject: "Your OTP for verification",
    text: text,
  };

  transporter.sendMail(
    mailOptions,
    (error,info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent successfully:", info.response);
      }
    }
  );
}

module.exports = sendMail

