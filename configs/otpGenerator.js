const otpGenerator = (length) => {
    let otp = "";
    const digits = "0123456789";  // A string of digits from 0 to 9
  
    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * digits.length);  
      otp += digits[index];  
    }
    return otp;
};
  
module.exports = otpGenerator;
