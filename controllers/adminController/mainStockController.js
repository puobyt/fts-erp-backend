const express = require("express");

const mainStockService = require("../../services/adminServices/mainStockService");

let mainStockController = {};

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
      quantity,
      price,
      vendorName,
      storageLocation,
      dateRecieved,
      expiryDate,
    } = req.body;

    const result = await mainStockService.newMainStock({
        materialName,
      quantity,
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
      quantity,
      price,
      vendorName,
      storageLocation,
      dateRecieved,
      expiryDate,
    } = req.body;

    // Pass the extracted data to the service function
    const result = await mainStockService.editMainStock({
      authPassword,
      mainStockId,
      materialName,
      quantity,
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
