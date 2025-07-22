const express = require("express");

const mainStockService = require("../../services/adminServices/mainStockService");

let mainStockController = {};


mainStockController.fetchOutOfStock = async (req, res) => {
  try {
    console.log("loading out of stocks...");

    const result = await mainStockService.fetchOutOfStock();

    res.status(result.status).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.log(
      "An error occurred while fetching out of stocks in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};
mainStockController.fetchMainStock = async (req, res) => {
  try {
    console.log("loading main stocks...");

    const result = await mainStockService.fetchMainStock();

    res.status(result.status).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.log(
      "An error occurred while fetching main stocks in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};
mainStockController.newMainStock = async (req, res) => {
  try {
    console.log("Adding new main stock ");

    const {
      materialName,
      materialCode,
      quantity,
      unit,
      price,
      vendorName,
      storageLocation,
      dateRecieved,
      expiryDate,
      batchNumber,
    } = req.body;

    const result = await mainStockService.newMainStock({
      batchNumber,
      materialName,
      materialCode,
      quantity,
      unit,
      price,
      vendorName,
      storageLocation,
      dateRecieved,
      expiryDate,
    });

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while adding main stocks in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in Server" });
  }
};

mainStockController.editMainStock = async (req, res) => {
  try {
    console.log("editing main stock..");

    const {
      authPassword,
      mainStockId,
      materialName,
      materialCode,
      grn,
      quantity,
      unit,
      price,
      vendorName,
      storageLocation,
      dateRecieved,
      expiryDate,
    } = req.body;

    const result = await mainStockService.editMainStock({
      authPassword,
      mainStockId,
      materialName,
      materialCode,
      grn,
      quantity,
      unit,
      price,
      vendorName,
      storageLocation,
      dateRecieved,
      expiryDate,
    });

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while adding editing main Stock in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred" });
  }
};

mainStockController.getFirstStocks = async (req, res) => {
  try {
    const materialName = req.params.materialName
    if (!materialName) {
      return res.status(400).json({ message: "MaterialName is required!" })
    }
    const result = await mainStockService.getFIFOStock(materialName)
    res.status(result.status).json({
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {

  }
}
mainStockController.removeMainStock = async (req, res) => {
  try {
    console.log("deleting current stock...");
    const { mainStockId } = req.query;
    console.log("mainStock id..", mainStockId);
    // Pass the extracted data to the service function
    const result = await mainStockService.removeMainStock(mainStockId);

    res.status(result.status).json({
      message: result.message,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while removing main stock in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};

module.exports = mainStockController;
