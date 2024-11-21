const CurrentStock = require("../../models/currentStock");
const PurchaseOrderCreation = require("../../models/purchaseOrderCreation");
const purchaseOrderService = require("../../services/adminServices/purchaseOrderService");
const VendorManagement = require("../../models/vendorManagement");
let currentStockService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;

currentStockService.fetchCurrentStock = async () => {
  try {
    const data = await CurrentStock.find({});
    const materials = await PurchaseOrderCreation.distinct("materialName");
    const vendors = await PurchaseOrderCreation.distinct("nameOfTheFirm");
    const purchaseOrderCreationData = await PurchaseOrderCreation.find(
      {},
      "price quantity productName"
    ).sort({ createdAt: -1 });

    return {
      status: 200,
      data: data,
      purchaseOrderCreationData: purchaseOrderCreationData,
      materials: materials,
      vendors:vendors
    };
  } catch (error) {
    console.log(
      "An error occured at fetching current stocks in admin service",
      error.message
    );
    res
      .status(500)
      .json({ info: "An error occured in fetching stocks in admin services" });
  }
};

currentStockService.newCurrentStock = async (newStockData) => {
  try {
    const {
      materialName,
      batchNumber,
      quantity,
      price,
      storageLocation,
      vendorName,
      dateRecieved,
      expiryDate,
    } = newStockData;

    const existing = await CurrentStock.findOne({
      $and: [
        { materialName: materialName },
        { batchNumber: batchNumber },
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
        message: "Current stock already exists with the same details",
      };
    }
    // const batchNumberValue = batchNumber || "NIL";
    let assignedBatchNumber= batchNumber;

    if (!batchNumber) {

      const lastOrder = await CurrentStock.findOne()
        .sort({ createdAt: -1 }) 
        .select("batchNumber");

        if (lastOrder && lastOrder.batchNumber) {
  
          const lastNumber = parseInt(lastOrder.batchNumber.match(/\d+$/), 10);
          const nextNumber = String((lastNumber || 0) + 1).padStart(3, "0");
          assignedBatchNumber = `FRN/MT/${nextNumber}`;
        } else {
          assignedBatchNumber = "FRN/MT/1";
        }
    }
    const newStock = new CurrentStock({
      materialName,
      batchNumber: assignedBatchNumber,
      quantity:`${quantity} KG`,
      price,
      storageLocation,
      vendorName,
      dateRecieved,
      expiryDate,
    });

    await newStock.save();
    return {
      status: 201,
      message: "New stock added successfully",
      data: newStock,
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at adding new current stock in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in adding new current stock in admin services",
    });
  }
};

currentStockService.editCurrentStock = async (currentStockData) => {
  try {
    const {
      authPassword,
      currentStockId,
      materialName,
      batchNumber,
      quantity,
      price,
      storageLocation,
      vendorName,
      dateRecieved,
      expiryDate,
    } = currentStockData;

    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }

    const existing = await CurrentStock.findOne({
      $and: [
        { materialName: materialName },
        { batchNumber: batchNumber },
        { quantity: quantity },
        { price: price },
        { vendorName: vendorName },
        { dateRecieved: dateRecieved },
        { expiryDate: expiryDate },
      ],
    });

    const currentStockExist = await CurrentStock.findOne({
      $and: [
        { _id: currentStockId },
        { materialName: materialName },
        { batchNumber: batchNumber },
        { quantity: quantity },
        { price: price },
        { storageLocation: storageLocation },
        { vendorName: vendorName },
        { dateRecieved: dateRecieved },
        { expiryDate: expiryDate },
      ],
    });

    const batchNumberValue = batchNumber || "NIL";

    if (existing && !currentStockExist) {
      return {
        status: 409,
        message: "Current Stock already exists with the same details",
      };
    } else {
      const currentStock = await CurrentStock.findByIdAndUpdate(
        currentStockId,
        {
          materialName,
          batchNumber: batchNumberValue,
          quantity:`${quantity} KG`,
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
    }

    return {
      status: 201,
      message: "Current Stock Edited Successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log("An error occured at editing Current Stock", error.message);
    res.status(500).json({
      info: "An error occured in editing Current Stock management services",
    });
  }
};

currentStockService.removeCurrentStock = async (currentStockId) => {
  try {
    const currentStock = await CurrentStock.findByIdAndDelete(currentStockId);
    if (currentStock) {
      return {
        status: 201,
        message: "current stock deleted successfully",
        token: "sampleToken",
      };
    }
  } catch (error) {
    console.log("An error occured at current stock remove", error.message);
    res.status(500).json({
      info: "An error occured in current Stock remove in current stock services",
    });
  }
};

module.exports = currentStockService;
