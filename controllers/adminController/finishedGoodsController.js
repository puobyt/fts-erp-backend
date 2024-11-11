const express = require("express");

const finishedGoodsService = require("../../services/adminServices/finishedGoodsService");

let finishedGoodsController = {};

finishedGoodsController.fetchFinishedGoods = async (req, res) => {
  try {
    console.log("loading Finished Goods...");

    const result = await finishedGoodsService.fetchFinishedGoods();

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: "",
    });
  } catch (error) {
    console.log(
      "An error occurred while fetching bill Of Materials in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};

finishedGoodsController.newFinishedGoods = async (req, res) => {
  try {
    console.log("Adding new Finished Goods ");
    console.log("Received data:", req.body);

    const { finishedGoodsName, batchNumber, productionDate, quantityProduced } =
      req.body;

    const result = await adminService.newFinishedGoods({
      finishedGoodsName,
      batchNumber,
      productionDate,
      quantityProduced,
    });

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while adding new Material Assignment in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in Server" });
  }
};

module.exports = finishedGoodsController;
