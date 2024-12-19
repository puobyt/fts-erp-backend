const { Admin } = require("../../models/admin");
const { GenerateTokenAdmin } = require("../../configs/adminAuth");
const bcrypt = require("bcrypt");
const otpGenerator = require("../../configs/otpGenerator");
const PurchaseOrderCreation = require("../../models/purchaseOrderCreation");
const ProductionOrderCreationOutput = require("../../models/productionOrderCreationOutput");
const FinishedGoods = require("../../models/finishedGoods");
const CurrentStock = require("../../models/currentStock");
const VendorManagement = require("../../models/vendorManagement");
const sendMail = require("../../configs/otpMailer");
const { PendingAdmin } = require("../../models/admin");
let adminService = {};
const allowedEmails = ["puobyt@gmail.com", "bobydavist@gmail.com","jishnuanil055@gmail.com"];
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
    const adminData = { email: admin.email, userName: admin.userName };
    return { status: 200, message: "Login successful", adminToken: adminToken,adminData:adminData };
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
    if (!allowedEmails.includes(email)) {
      return {
        status: 403,
        message: "You are not authorized to sign-up ",
      };
    }

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

adminService.verifyOtp = async (otp, email) => {
  const pendingAdmin = await PendingAdmin.findOne({ email, OTP: otp });
  if (!pendingAdmin) {
    console.log("not verified");
    return { status: 400, message: " OTP is invalid", success: false };
  }

  if (new Date() > pendingAdmin.otpExpiresAt) {
    await PendingAdmin.deleteMany({ email });
    return { status: 400, message: "OTP expired" };
  }
  const newAdmin = new Admin({
    userName: pendingAdmin.userName,
    email: pendingAdmin.email,
    password: pendingAdmin.password,
  });

  await newAdmin.save();
  await PendingAdmin.deleteMany({ email });
  return {
    status: 201,
    success: true,
    userToken: "",
    message: "Sign up successfull",
  };
};

    
adminService.fetchPDFData = async (id) => {
  try {

    const currentStock = await CurrentStock.findById(id);
    if (!currentStock) {
      return { status: 404, message: "Current stock not found" };
    }

    const vendor = await VendorManagement.findOne({ nameOfTheFirm: currentStock.vendorName });
    if (!vendor) {
      return { status: 404, message: "Vendor details not found" };

    }

    // const storage = await ProductionOrderCreationOutput.findOne({ storageLocation: currentStock.storageLocation });
    // if (!storage) {
    //   return res.status(404).json({ error: "Storage details not found" });
    // }

// const production = await 
    const pdfData = {
      vendor: {
        contactName: vendor.contactPersonName, 
        contactPersonDetails:vendor.contactPersonDetails,
        address: vendor.address,    
      },
      storage: {
        id: storage.storageId,
        location: storage.locationName, // Adjust based on schema
        capacity: storage.capacity,    // Adjust based on schema
      },
    };

    res.status(200).json(pdfData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


adminService.tracebilitySearch = async (materialCode) => {
  try {


    const materials = await CurrentStock.find({ materialCode }); 

    if (materials.length === 0) {
      console.log('No materials found for search');
      return { status: 404, message: "Material code not found", success: false };
    }


    return { status: 200, message: "Raw materials found", materials: materials,success:true };
  } catch (err) {
    console.error(
      "Error occured in tracebility search in admin service",
      err.message
    );
    res.status(500).json({ info: "An error tracebility search in admin service " });
  }
};


adminService.tracebilityFinishedGoodsSearch = async (finishedGoodsName) => {
  try {

    const finishedGoods = await FinishedGoods.findOne({ finishedGoodsName });

    if (!finishedGoods) {
      return { status: 404, message: "Finished goods not found", success: false };
    }

    const materialCodes = finishedGoods.materials.map((item) => item.materialCode);

    const materials = await CurrentStock.find({ materialCode: { $in: materialCodes } });

    if (materials.length === 0) {
      console.log('No finished goods found for search');
      return { status: 404, message: "Finished goods materials not found", success: false };
    }


    return { status: 200, message: "Finished Goods found", materials: materials,success:true };
  } catch (err) {
    console.error(
      "Error occured in tracebility search in admin service",
      err.message
    );
    res.status(500).json({ info: "An error tracebility search in admin service " });
  }
};

module.exports = adminService;
