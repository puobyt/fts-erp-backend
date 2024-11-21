const express = require("express");

const purchaseOrderService = require("../../services/adminServices/purchaseOrderService");

let purchaseOrderController = {};

purchaseOrderController.fetchPurchaseOrderCreation = async (req, res) => {
  try {
    console.log("loading purchase orders...");

    const result = await purchaseOrderService.fetchPurchaseOrderCreation();

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      firms:result.firms,
      userToken: "",
    });
  } catch (error) {
    console.log(
      "An error occurred while fetching purchase order in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred" });
  }
};

// purchaseOrderController.fetchFirms = async (req, res) => {
//   try {
//     console.log("loading Firms...");

//     const result = await purchaseOrderService.fetchFirms();

//     res.status(result.status).json({
//       message: result.message,
//       data: result.data,
//       userToken: "",
//     });
//   } catch (error) {
//     console.log( 
//       "An error occurred while fetching fetch Firms in admin controller:",
//       error.message
//     );
//     res.status(500).json({ info: "An error occurred in server" });
//   }
// };

purchaseOrderController.newPurchaseOrderCreation = async (req, res) => {
  try {
    console.log("Adding new Purchase Order Creation");

    const {
      purchaseOrderNumber,
      date,
      address,
      nameOfTheFirm,
      contactNumber,
      contactPersonName,
      contactPersonDetails,
      vendorId,
      materialName,
      // batchNumber,
      mfgDate,
      quantity,
      price,
      pan,
      gst,
    } = req.body;

    // Pass the extracted data to the service function
    const result = await purchaseOrderService.newPurchaseOrderCreation({
      purchaseOrderNumber,
      date,
      address,
      nameOfTheFirm,
      contactNumber,
      contactPersonName,
      contactPersonDetails,
      vendorId,
      materialName,
      // batchNumber,
      mfgDate,
      quantity,
      price,
      pan,
      gst,
    });

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while adding new purchase order creation in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in Server" });
  }
};

purchaseOrderController.editPurchaseOrderCreation = async (req, res) => {
  try {
    console.log("editing purchase order");

    const {
      authPassword,
      orderId,
      purchaseOrderNumber,
      date,
      address,
      nameOfTheFirm,
      contactNumber,
      contactPersonName,
      contactPersonDetails,
      vendorId,
      materialName,
      // batchNumber,
      mfgDate,
      quantity,
      price,
      pan,
      gst,
    } = req.body;

    // Pass the extracted data to the service function
    const result = await purchaseOrderService.editPurchaseOrderCreation({
      authPassword,
      orderId,
      purchaseOrderNumber,
      date,
      address,
      nameOfTheFirm,
      contactNumber,
      contactPersonName,
      contactPersonDetails,
      vendorId,
      materialName,
      // batchNumber,
      mfgDate,
      quantity,
      price,
      pan,
      gst,
    });

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while adding vendor in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred" });
  }
};


purchaseOrderController.removePurchaseOrderCreation = async (req, res) => {
  try {
    console.log("deleting Production Order Creation...");
const {purchaseOrderId} = req.query;
    // Pass the extracted data to the service function
    const result = await purchaseOrderService.removePurchaseOrderCreation(purchaseOrderId);

    res.status(result.status).json({
      message: result.message,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while removing purchase Order creation in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};

module.exports = purchaseOrderController;
