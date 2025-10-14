const express = require("express");

const currentStockService = require("../../services/adminServices/currentStockService");

let currentStockController = {};

currentStockController.fetchCurrentStock = async (req, res) => {
  try {
    console.log("loading current stocks...");

    const result = await currentStockService.fetchCurrentStock();

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      purchaseOrderCreationData: result.purchaseOrderCreationData,
      materials: result.materials,
      vendors: result.vendors,
      userToken: "",
    });
  } catch (error) {
    console.log(
      "An error occurred while fetching stocks in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};
currentStockController.newCurrentStock = async (req, res) => {
  try {
    console.log("Adding new current stock ");

    const { materialName,materialCode,grn, quantity, unit, price,storageLocation, vendorName, dateRecieved,expiryDate,createdBy } = req.body;


    const result = await currentStockService.newCurrentStock({
      materialName,
      materialCode,
      grn,
      quantity,
      unit,
      price,
      storageLocation,
      vendorName,
      dateRecieved,
      expiryDate,
      createdBy
    });

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while adding current stocks in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in Server" });
  }
};

currentStockController.importStock = async (req, res) => {
  try {

    const { Stocks } = req.body.sheetsData
    const stocks = Stocks

    console.log('Adding new stock', stocks)

    for (let i = 0; i < stocks.length; i++) {
      const { materialName, materialCode, grn, quantity, unit, price, storageLocation, vendorName, dateRecieved, expiryDate } = stocks[i];

      await currentStockService.newCurrentStock({
        materialName,
        materialCode,
        grn,
        quantity,
        unit,
        price,
        storageLocation,
        vendorName,
        dateRecieved,
        expiryDate
      });
    }


    res.status(200).json({
      message: "Imported Successfully",
    });
  } catch (error) {
    console.log(
      "An error occurred while adding current stocks in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in Server" });
  }
}

currentStockController.editCurrentStock = async (req, res) => {
  try {
    console.log("editing current stock..");

    const {
      authPassword,
      currentStockId,
      materialName,
      materialCode,
      grn,
      quantity,
      unit,
      price,
      storageLocation,
      vendorName,
      dateRecieved,
      expiryDate,
      editedBy
    } = req.body;

    // Pass the extracted data to the service function
    const result = await currentStockService.editCurrentStock({
      authPassword,
      currentStockId,
      materialName,
      materialCode,
      grn,
      quantity,
      unit,
      price,
      storageLocation,
      vendorName,
      dateRecieved,
      expiryDate,
      editedBy
    });

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while adding editing Current Stock in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred" });
  }
};



currentStockController.removeCurrentStock = async (req, res) => {
  try {
    console.log("deleting current stock...");
const {currentStockId, user} = req.query;
    // Pass the extracted data to the service function
    const result = await currentStockService.removeCurrentStock(currentStockId,user);

    res.status(result.status).json({
      message: result.message,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while removing current stock in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};

module.exports = currentStockController;
