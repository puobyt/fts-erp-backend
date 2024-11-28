const MainStock = require("../../models/mainStock");
const PurchaseOrderCreation = require("../../models/purchaseOrderCreation");
const purchaseOrderService = require("../../services/adminServices/purchaseOrderService");
const VendorManagement = require("../../models/vendorManagement");
const CurrentStock = require("../../models/currentStock");
const OutOfStock = require("../../models/outOfStock");
let mainStockService = {};
require("dotenv").config();

let adminAuthPassword = process.env.ADMIN_AUTH_PASS;


mainStockService.fetchOutOfStock = async () => {
  try {
    const data = await OutOfStock.find({});

    return {
      status: 200,
      data: data,
    };
  } catch (error) {
    console.log(
      "An error occured at fetching main stocks in admin service",
      error.message
    );
    res
      .status(500)
      .json({ info: "An error occured in main stocks in admin services" });
  }
};
mainStockService.fetchMainStock = async () => {
  try {
    const data = await MainStock.find({});

    return {
      status: 200,
      data: data,
    };
  } catch (error) {
    console.log(
      "An error occured at fetching main stocks in admin service",
      error.message
    );
    res
      .status(500)
      .json({ info: "An error occured in main stocks in admin services" });
  }
};

mainStockService.newMainStock = async (mainStockData) => {
  try {
    const {
      materialName,
      materialCode,
      quantity,
      price,
      vendorName,
      storageLocation,
      dateRecieved,
      expiryDate,
    } = mainStockData;

    const existing = await MainStock.findOne({
      $and: [
        { materialName: materialName },
        { materialCode: materialCode },
        { quantity: quantity },
        { price: price },
        { storageLocation: storageLocation },
        { vendorName: vendorName },
        { dateRecieved: dateRecieved },
        { expiryDate: expiryDate },
      ],
    });

    if (existing) {
      return {
        status: 409,
        message: "Main stock already exists with the same details",
      };
    }

    const newMainStock = new MainStock({
      materialName,
      materialCode,
      quantity,
      price,
      vendorName,
      storageLocation,
      dateRecieved,
      expiryDate,
    });

    await newMainStock.save();
    return {
      status: 201,
      message: "New Main stock added successfully",
      data: newMainStock,
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at adding new main stock in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in adding new main stock in admin services",
    });
  }
};

mainStockService.editMainStock = async (mainStockData) => {
  try {
    const {
      authPassword,
      mainStockId,
      materialName,
      materialCode,
      quantity,
      price,
      vendorName,
      storageLocation,
      dateRecieved,
      expiryDate,
    } = mainStockData;

    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }

    const existing = await MainStock.findOne({
      $and: [
        { materialName: materialName },
        { materialCode: materialCode },
        { quantity: quantity },
        { price: price },
        { storageLocation: storageLocation },
        { vendorName: vendorName },
        { dateRecieved: dateRecieved },
        { expiryDate: expiryDate },
      ],
    });

    const mainStockExist = await MainStock.findOne({
      $and: [
        { _id: mainStockId },
        { materialName: materialName },
        { materialCode: materialCode },
        { quantity: quantity },
        { price: price },
        { storageLocation: storageLocation },
        { vendorName: vendorName },
        { dateRecieved: dateRecieved },
        { expiryDate: expiryDate },
      ],
    });

    if (existing && !mainStockExist) {
      return {
        status: 409,
        message: "Main Stock already exists with the same details",
      };
    }
    const mainStock = await MainStock.findByIdAndUpdate(
      mainStockId,
      {
        materialName,
        materialCode,
        quantity,
        price,
        vendorName,
        storageLocation,
        dateRecieved,
        expiryDate,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    const currentStockId = mainStock.currentStockId;
    const currentStockUpdate = await CurrentStock.findByIdAndUpdate(
      currentStockId,
      {
        materialName,
        materialCode,
        quantity,
        price,
        vendorName,
        storageLocation,
        dateRecieved,
        expiryDate,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return {
      status: 201,
      message: "Main Stock Edited Successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log("An error occured at editing Main Stock", error.message);
    res.status(500).json({
      info: "An error occured in editing Main Stock management services",
    });
  }
};

mainStockService.removeMainStock = async (mainStockId) => {
  try {
    const mainStock = await MainStock.findByIdAndDelete(mainStockId);
    if (mainStock) {
      return {
        status: 201,
        message: "Main stock deleted successfully",
        token: "sampleToken",
      };
    }
  } catch (error) {
    console.log("An error occured at main stock remove", error.message);
    res.status(500).json({
      info: "An error occured in main Stock remove in current stock services",
    });
  }
};

module.exports = mainStockService;
