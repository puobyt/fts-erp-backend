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
    console.log("Adding new vendor");

    const {
      processOrderNumber,
      productName,
      description,
    } = req.body;

    // Pass the extracted data to the service function
    const result = await processOrderService.newProcessOrder({
        processOrderNumber,
        productName,
        description,
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
      console.log("Adding new vendor");
  
      const {
        authPassword,
        processOrderId,
        processOrderNumber,
        productName,
        description,
      } = req.body;
  
      // Pass the extracted data to the service function
      const result = await processOrderService.editProcessOrder({
        authPassword,
        processOrderId,
        processOrderNumber,
        productName,
        description,
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

module.exports = processOrderController;