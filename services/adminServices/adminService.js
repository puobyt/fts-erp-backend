const {Admin} = require("../../models/admin");
const { GenerateTokenAdmin } = require("../../configs/adminAuth");
const bcrypt = require("bcrypt");
const otpGenerator = require("../../configs/otpGenerator");
const sendMail = require("../../configs/otpMailer");
const {PendingAdmin} = require("../../models/admin");
let adminService = {};

adminService.signIn = async (email, password) => {
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return { status: 400, message: "Admin not found ", adminToken: "" };
    }
    if (admin.email != email) {
      return { status: 400, message: "Admin not found ", adminToken: "" };
    }
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return { status: 400, message: "Inavlid password" };
    }

    const adminToken = await GenerateTokenAdmin(email);
    if (!adminToken) {
      console.log("no admin token get in admin sign in service");
    }
    return { status: 200, message: "Login successful", adminToken: adminToken };
  } catch (err) {
    console.error(
      "Error occured in login admin in sign in controller",
      err.message
    );
    res
      .status(500)
      .json({ info: "An error login admin in sign in controller " });
  }
};

adminService.signUp = async (userName, email, password) => {
  try {
    const adminEmail = await Admin.findOne({ email });
    if (adminEmail) {
      return { status: 409, message: "Email already exists " };
    }
    const adminUserName = await Admin.findOne({ userName });
    if (adminUserName) {
      return { status: 409, message: "Username already exists " };
    }
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const OTP = otpGenerator(6);
    const text = `Your OTP is:${OTP}. Please use this code to verify your identity.`;
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    sendMail(email, OTP);
    console.log("sendMail executed");

    const pendingAdmin = new PendingAdmin({
      userName,
      email,
      password: hashedPassword,
      OTP,
      otpExpiresAt,
    });

    await pendingAdmin.save();

    return { status: 201, success: true };
  } catch (err) {
    console.error(
      "Error occured in sign up admin in sign in admin service",
      err.message
    );
    res.status(500).json({ info: "An error sign up admin in admin service " });
  }
};

adminService.verifyOtp = async (otp,email) => {

  const pendingAdmin =  await PendingAdmin.findOne({ email,OTP:otp });
  if (!pendingAdmin) {
    console.log("not verified");
    return { status: 400, message: " OTP is invalid" ,success:false };
  }

  if (new Date() > pendingAdmin.otpExpiresAt) {
    await PendingAdmin.deleteMany({ email });
    return { status: 400, message: "OTP expired" };
  }
const newAdmin = new Admin({
  fullname: pendingAdmin.userName,
  email: pendingAdmin.email,
  password: pendingAdmin.password,
})

await newAdmin.save();
await PendingAdmin.deleteMany({ email });
  return { status: 201, success: true,userToken:'' ,message: "Sign up successfull" };
};

module.exports = adminService;
