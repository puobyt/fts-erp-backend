const express = require("express");
const processOrderService = require('../../services/adminServices/processOrderService')

let processOrderController = {};


processOrderController.fetchProcessOrder = async (req, res) => {
    try {
      console.log("loading Process Orders...");
  
      const result = await processOrderService.fetchProcessOrder();
  
      res.status(result.status).json({
        message: result.message,
        data: result.data,
        userToken: "",
      });
    } catch (error) {
      console.log(
        "An error occurred while fetching Process Orders in admin controller:",
        error.message
      );
      res.status(500).json({ info: "An error occurred" });
    }
  };



processOrderController.newProcessOrder = async (req, res) => {
  try {

    const {
      processOrderNumber,
      batchNumber,
      plant,
      equipment,
      startDate,
      finishDate,
      productName,
      productCode,
      batch,
      orderQuantity,
      materialInput

    } = req.body;

    // Pass the extracted data to the service function
    const result = await processOrderService.newProcessOrder({
      processOrderNumber,
      batchNumber,
      plant,
      equipment,
      startDate,
      finishDate,
      productName,
      productCode,
      batch,
      orderQuantity,
      materialInput

    });

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while adding process order in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred" });
  }
};



processOrderController.editProcessOrder = async (req, res) => {
    try {
      console.log("editing  process order");
  
      const {
        authPassword,
        processOrderId,
        processOrderNumber,
        plant,
        equipment,
        startDate,
        finishDate,
        productName,
        productCode,
        batch,
        orderQuantity,
        materialInput
      } = req.body;
  
      // Pass the extracted data to the service function
      const result = await processOrderService.editProcessOrder({
        authPassword,
        processOrderId,
        processOrderNumber,
        plant,
        equipment,
        startDate,
        finishDate,
        productName,
        productCode,
        batch,
        orderQuantity,
        materialInput
      });
  
      res.status(result.status).json({
        message: result.message,
        data: result.data,
        userToken: result.token,
      });
    } catch (error) {
      console.log(
        "An error occurred while editing process order in admin controller:",
        error.message
      );
      res.status(500).json({ info: "An error occurred" });
    }
  };

  processOrderController.removeProcessOrder = async (req, res) => {
    try {
      console.log("deleting process order...");
  const {processOrderId} = req.query;
      // Pass the extracted data to the service function
      const result = await processOrderService.removeProcessOrder(processOrderId);
  
      res.status(result.status).json({
        message: result.message,
        userToken: result.token,
      });
    } catch (error) {
      console.log(
        "An error occurred while removing process order in admin controller:",
        error.message
      );
      res.status(500).json({ info: "An error occurred in server" });
    }
  };


  processOrderController.excelImportData = async (req, res) => {
    try {

      const { sheetsData } = req.body;

      if (!sheetsData || Object.keys(sheetsData).length === 0) {
        return res.status(400).json({ success: false, message: 'No data provided!' });
      }
    // console.log('sheets data',sheetsData)
      const result = await processOrderService.excelImportData(sheetsData);

  
      res.status(200).json({ success: true, message: 'Data imported successfully!' });
    } catch (err) {
      console.error('Error importing data:', err);
      res.status(500).json({ success: false, message: 'Internal server error!' });
    }
  };

module.exports = processOrderController;