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
      firms: result.firms,
      userToken: "",
    });
  } catch (error) {
    console.log("An error occurred while fetching purchase order in admin controller:", error.message);
    res.status(500).json({ info: "An error occurred" });
  }
};

purchaseOrderController.newPurchaseOrderCreation = async (req, res) => {
  try {
    console.log("Adding new Purchase Order Creation");
    const result = await purchaseOrderService.newPurchaseOrderCreation(req.body);
    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log("An error occurred while adding new purchase order creation in admin controller:", error.message);
    res.status(500).json({ info: "An error occurred in Server" });
  }
};

purchaseOrderController.editPurchaseOrderCreation = async (req, res) => {
  try {
    console.log("editing purchase order");
    const result = await purchaseOrderService.editPurchaseOrderCreation(req.body);
    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log("An error occurred while editing purchase order in admin controller:", error.message);
    res.status(500).json({ info: "An error occurred" });
  }
};

purchaseOrderController.removePurchaseOrderCreation = async (req, res) => {
  try {
    console.log("deleting Purchase Order Creation...");
    const { purchaseOrderId } = req.query;
    const result = await purchaseOrderService.removePurchaseOrderCreation(purchaseOrderId);
    res.status(result.status).json({
      message: result.message,
      userToken: result.token,
    });
  } catch (error) {
    console.log("An error occurred while removing purchase Order creation in admin controller:", error.message);
    res.status(500).json({ info: "An error occurred in server" });
  }
};

purchaseOrderController.getAllPurchaseOrders = async (req, res) => {
  try {
    const pos = await purchaseOrderService.fetchAllPurchaseOrder();
    console.log("GET PURCHASE",pos)
    res.status(200).json({ data: pos, message: "All purchase orders fetched successfully" });
  } catch (error) {
    console.log("An error occurred while fetching all purchase orders in admin controller:", error.message);
    res.status(500).json({ info: "An error occurred in server" });
  }
};

module.exports = purchaseOrderController;