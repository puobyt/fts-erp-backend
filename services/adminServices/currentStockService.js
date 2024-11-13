const CurrentStock = require("../../models/currentStock");
const PurchaseOrderCreation = require("../../models/purchaseOrderCreation");
const purchaseOrderService = require("../../services/adminServices/purchaseOrderService");
let currentStockService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;
currentStockService.fetchCurrentStock = async () => {
  try {
    const data = await CurrentStock.find({}).sort({ createdAt: -1 });
    const purchaseOrderCreationData = await PurchaseOrderCreation.find({}, 'price quantity productName').sort({ createdAt: -1 });
   
    return {
      status: 200,
      data: data,
      purchaseOrderCreationData:purchaseOrderCreationData
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
    const { productName, quantity, price, supplier, dateRecieved } =
      newStockData;

    const existing = await CurrentStock.findOne({
      $and: [
        { productName: productName },
        { quantity: quantity },
        { price: price },
        { supplier: supplier },
        { dateRecieved: dateRecieved },
      ],
    });

    if (existing) {
      return {
        status: 409,
        message: "Current stock already exists with the same details",
      };
    }

    const newStock = new CurrentStock({
      productName,
      quantity,
      price,
      supplier,
      dateRecieved,
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
      productName,
      quantity,
      price,
      supplier,
      dateRecieved,
    } = currentStockData;

    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }

    const existing = await CurrentStock.findOne({
      $and: [
        { productName: productName },
        { quantity: quantity },
        { price: price },
        { supplier: supplier },
        { dateRecieved: dateRecieved },
      ],
    });

    const currentStockExist = await CurrentStock.findOne({
      $and: [
        { _id: currentStockId },
        { productName: productName },
        { quantity: quantity },
        { price: price },
        { supplier: supplier },
        { dateRecieved: dateRecieved },
      ],
    });

    if (existing && !currentStockExist) {
      return {
        status: 409,
        message: "Current Stock already exists with the same details",
      };
    } else {
      const currentStock = await CurrentStock.findByIdAndUpdate(
        currentStockId,
        {
          productName,
          quantity,
          price,
          supplier,
          dateRecieved,
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


currentStockService.removeCurrentStock = async (
  currentStockId
) => {
  try {
    const currentStock = await CurrentStock.findByIdAndDelete(
      currentStockId
    );
 if(currentStock){
  return {
    status: 201,
    message: "current stock deleted successfully",
    token: "sampleToken",
  };
 }

  } catch (error) {
    console.log(
      "An error occured at current stock remove",
      error.message
    );
    res
      .status(500)
      .json({
        info: "An error occured in current Stock remove in current stock services",
      });
  }
};

module.exports = currentStockService;
