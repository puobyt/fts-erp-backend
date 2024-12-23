const express = require("express");
let adminController = {};
const adminService = require("../../services/adminServices/adminService");
const finishedGoods = require("../../models/finishedGoods");

adminController.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login credentials::", email, password);

    const result = await adminService.signIn(email, password);

    console.log("token after generated", result.token);

    res.status(result.status).json({
      message: result.message,
      adminToken: result.adminToken,
      adminData:result.adminData
    });
  } catch (err) {
    console.error("Error occurred in login data", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

adminController.signUp = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const result = await adminService.signUp(userName, email, password);

    res.status(result.status).json({
      message: result.message,
      success: result.success,
    });
  } catch (err) {
    console.error("Error occurred in sign up data", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

adminController.verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;
    console.log("otp,email:", otp, email);
    const result = await adminService.verifyOtp(otp, email);

    console.log("token after generated", result.token);

    res.status(result.status).json({
      message: result.message,
      userToken: result.token,
      success: result.success,
    });
  } catch (err) {
    console.error("Error occurred in login data", err);
    res.status(500).json({ message: "Internal server error" });
  }
};



adminController.fetchPDFData = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('id for current stock',id);
    const result = await adminService.fetchPDFData(id);

    res.status(result.status).json({
      message: result.message,
      userToken: result.token,
      success: result.success,
    });
  } catch (error) {
    console.error("Error fetching pdf data in admin controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

adminController.tracebilitySearch = async (req, res) => {
  try {
    const { code } = req.query;

    const result = await adminService.tracebilitySearch(code);

    res.status(result.status).json({
      message: result.message,
      materials: result.materials,
      success:result.success,
      
    });

  } catch (error) {
    console.error("Error tracebility search data in admin controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

adminController.tracebilityFinishedGoodsSearch = async (req, res) => {
  try {
    const { code } = req.query;

    const result = await adminService.tracebilityFinishedGoodsSearch(code);

    res.status(result.status).json({
      message: result.message,
      materials: result.materials,
      success:result.success,
      
    });

  } catch (error) {
    console.error("Error tracebility search data in admin controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

adminController.tracebilityProductionSearch =  async (req, res) => {
  const { materialCode } = req.query; 

  try {
    
    const result = await adminService.tracebilityProductionSearch(materialCode);

    res.status(result.status).json({
      message: result.message,
      productionData: result.productionData,
      success:result.success,
      
    });

  } catch (error) {
    console.error("Error tracebility search production data in admin controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


adminController.tracebilityPackingAndShipping =  async (req, res) => {
  const { processCode } = req.query; 

  try {
    
    const result = await adminService.tracebilityPackingAndShipping(processCode);

    res.status(result.status).json({
      message: result.message,
      shippingData: result.shippingData,
      success:result.success,
      
    });

  } catch (error) {
    console.error("Error tracebility search packing and shipping data in admin controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = adminController;
