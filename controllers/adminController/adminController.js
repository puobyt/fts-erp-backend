const express = require("express");
let adminController = {};
const adminService = require("../../services/adminServices/adminService");

adminController.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login credentials::", email, password);

    const result = await adminService.signIn(email, password);

    console.log("token after generated", result.token);

    res.status(result.status).json({
      message: result.message,
      adminToken: result.adminToken,
    });
  } catch (err) {
    console.error("Error occurred in login data", err);
    res.status(500).json({ message: "Internal server error" });
  }
};





adminController.signUp = async (req, res) => {
  try {
    const { userName,email,password  } = req.body;


    const result = await adminService.signUp(userName, email,password);


    res.status(result.status).json({
      message: result.message,
      success:result.success,
    });
  } catch (err) {
    console.error("Error occurred in sign up data", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

adminController.verifyOtp = async (req, res) => {
  try {
    const { otp,email} = req.body;
console.log('otp,email:',otp,email);
    const result = await adminService.verifyOtp(otp,email);

    console.log("token after generated", result.token);

    res.status(result.status).json({
      message: result.message,
      userToken: result.token,
      success:result.success
    });
  } catch (err) {
    console.error("Error occurred in login data", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = adminController;
