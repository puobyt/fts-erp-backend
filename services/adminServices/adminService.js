const { Admin } = require("../../models/admin");
const { GenerateTokenAdmin } = require("../../configs/adminAuth");
const bcrypt = require("bcrypt");
const ProductionOrderCreation = require("../../models/productionOrderCreation");
const otpGenerator = require("../../configs/otpGenerator");
const PurchaseOrderCreation = require("../../models/purchaseOrderCreation");
const ProductionOrderCreationOutput = require("../../models/productionOrderCreationOutput");
const FinishedGoods = require("../../models/finishedGoods");
const CurrentStock = require("../../models/currentStock");
const VendorManagement = require("../../models/vendorManagement");
const QualityCheck = require("../../models/qualityCheck");
const sendMail = require("../../configs/otpMailer");
const InvoiceCreation = require("../../models/invoiceCreation");
const { PendingAdmin } = require("../../models/admin");
const qualityCheck = require("../../models/qualityCheck");
const processOrder = require("../../models/processOrder");
const invoiceCreation = require("../../models/invoiceCreation");
const finishedGoods = require("../../models/finishedGoods");

let adminService = {};
const allowedEmails = [
  "puobyt@gmail.com",
  "bobydavist@gmail.com",
  "jishnuanil055@gmail.com",
  "jishnuanil255@gmail.com",
];
adminService.signIn = async (email, password) => {
  try {
    const admin = await Admin.findOne({ email });
    if (!admin || admin.email !== email) {
      return { status: 400, message: "Admin not found", adminToken: "" };
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return { status: 400, message: "Invalid password" };
    }

    const adminToken = await GenerateTokenAdmin(email);
    if (!adminToken) {
      console.log("No admin token generated in admin sign in service");
    }

    const adminData = { email: admin.email, userName: admin.userName };

    return {
      status: 200,
      message: "Login successful",
      adminToken: adminToken,
      adminData: adminData,
    };
  } catch (err) {
    console.error("Error occurred in admin sign in service:", err.message);
    // 👇 Just throw the error — let controller handle res
    throw new Error("Something went wrong during admin login");
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

    const vendor = await VendorManagement.findOne({
      nameOfTheFirm: currentStock.vendorName,
    });
    if (!vendor) {
      return { status: 404, message: "Vendor details not found" };
    }

    const purchaseOrderCreation = await PurchaseOrderCreation.findOne({
      nameOfTheFirm: currentStock.vendorName
    });


    // const storage = await ProductionOrderCreationOutput.findOne({ storageLocation: currentStock.storageLocation });
    // if (!storage) {
    //   return res.status(404).json({ error: "Storage details not found" });
    // }

    // const production = await
    const pdfData = {
      vendor: {
        vendorId: purchaseOrderCreation.vendorId,
        vendorName: currentStock.vendorName,
        contactName: vendor.contactPersonName,
        contactPersonDetails: vendor.contactPersonDetails,
        address: vendor.address,
        location: currentStock.storageLocation
      },

    };

    return {
      status: 200,
      message: "Downloading",
      pdfData: pdfData,
      success: true,
    };

    res.status(200).json(pdfData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

adminService.tracebilitySearch = async (materialCode) => {
  try {
    const materials = await CurrentStock.find({
      $or: [
        { materialCode },
        { materialName: { $regex: new RegExp(`^${materialCode}$`, 'i') } }
      ]
    });
    const qcDetails = await qualityCheck.find({
      $or: [
        { materialCode }, 
        { materialName: { $regex: new RegExp(`^${materialCode}$`, 'i') } }
      ]
    })

    if (materials.length === 0) {
      console.log("No materials found for search");
      return {
        status: 404,
        message: "Material code not found",
        success: false,
      };
    }

    
      const production = await processOrder.find({
        'materialInput.materialCode': materials[0].materialCode
      });

      let shipping = []
      if(production.length>0){
        for(let i=0; i<production.length ; i++){
          let data = await invoiceCreation.findOne({
            itemName: production[i].productName
          });
          console.log('data',data)
          if (data) {
            var updatedData = data.toObject();

            console.log('updatedddddddd',data)
          
            const finishedGoodsData = await finishedGoods.findOne({
              finishedGoodsName: data.itemName
            });

            updatedData.quantityLeft = finishedGoodsData
              ? finishedGoodsData.quantityProduced
              : 0;
              console.log('updatedData',updatedData)
              shipping.push(updatedData)
          }

        }

      }
    

    return {
      status: 200,
      message: "Raw materials found",
      materials: materials,
      qcDetails: qcDetails,
      production: production,
      shipping: shipping,
      success: true,
    };
  } catch (err) {
    console.error(
      "Error occured in tracebility search in admin service",
      err.message
    );
    res
      .status(500)
      .json({ info: "An error tracebility search in admin service " });
  }
};

adminService.tracebilityFinishedGoodsSearch = async (finishedGoodsName) => {
  try {

    const finishedGoods = await FinishedGoods.findOne({ finishedGoodsName });

    if (!finishedGoods) {
      return {
        status: 404,
        message: "Finished goods not found",
        success: false,
      };
    }

    const materialCodes = finishedGoods.materials.map(
      (item) => item.materialCode
    );

    const materials = await CurrentStock.find({
      materialCode: { $in: materialCodes },
    });
    const qcDetails = await qualityCheck.find({
      materialCode: { $in: materialCodes }
    })

    if (materials.length === 0) {
      console.log("No finished goods found for search");
      return {
        status: 404,
        message: "Finished goods materials not found",
        success: false,
      };
    }

    return {
      status: 200,
      message: "Finished Goods found",
      materials: materials,
      qcDetails: qcDetails,
      success: true,
    };
  } catch (err) {
    console.error(
      "Error occured in tracebility search in admin service",
      err.message
    );
    res
      .status(500)
      .json({ info: "An error tracebility search in admin service " });
  }
};

adminService.tracebilityProductionSearch = async (materialCode) => {
  try {
    const production = await ProductionOrderCreation.find({
      materials: {
        $elemMatch: { materialCode: materialCode },
      },
    });

    const qcDetails = await QualityCheck.find({ materialCode });

    if (!production || production.length === 0 && !qcDetails || qcDetails.length === 0) {
      return {
        status: 404,
        message: "No production data found for the provided material code.",
        success: false,
      };
    }

    return {
      status: 200,
      message: "Production data found successfully!",
      productionData: production,
      qcDetails: qcDetails,
      success: true,
    };
  } catch (err) {
    console.error(
      "Error occurred in traceability search in admin service:",
      err.message
    );
    return {
      status: 500,
      message: "An error occurred while fetching production data.",
      success: false,
    };
  }
};

adminService.tracebilityPackingAndShipping = async (processOrder) => {
  try {

    const product = await ProductionOrderCreation.findOne({
      processOrder,
    }).select("productName");

    if (!product) {
      return {
        status: 404,
        message: "Product not found for the given process order.",
        success: false,
      };
    }

    const finishedGoods = await FinishedGoods.findOne({
      finishedGoodsName: product.productName,
    }).select("quantityProduced");

    const invoice = await InvoiceCreation.findOne({
      itemName: product.productName,
    })


    const productionOutput = await ProductionOrderCreationOutput.findOne({
      productName: product.productName,
    }).select("storageLocationforOutput");


    const shippingData = [{
      invoiceNumber: invoice?.invoiceNumber || "N/A", // Handle missing data
      invoiceDate: invoice?.invoiceDate || "N/A", // Added invoice date
      customerName: invoice?.customerName || "N/A",
      quantity: invoice?.quantity || "N/A",
      storage: productionOutput?.storageLocationforOutput || "N/A",
      fgReceived: finishedGoods?.quantityProduced || "N/A",
      balanceQuantity: "N/A", // Placeholder, calculate if needed
      dateOfFgInward: "N/A", // Placeholder, replace with actual logic
    }];

    return {
      status: 200,
      message: "Production data found successfully!",
      shippingData: shippingData,
      success: true,
    };
  } catch (err) {
    console.error(
      "Error occurred in traceability packing and shipping:",
      err.message
    );
    return {
      status: 500,
      message: "An error occurred while fetching shipping data.",
      success: false,
    };
  }
};

module.exports = adminService;
