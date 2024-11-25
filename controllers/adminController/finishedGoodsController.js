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

    const result = await finishedGoodsService.newFinishedGoods({
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
      "An error occurred while adding new finished goods in finished goods controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in Server" });
  }
};


finishedGoodsController.editFinishedGoods = async (req, res) => {
  try {
    console.log("editing Finished Goods..");

    const {
      authPassword,
      finishedGoodsId,
      finishedGoodsName,
      batchNumber,
      productionDate,
      quantityProduced
    } = req.body;

    const result =
      await finishedGoodsService.editFinishedGoods({
        authPassword,
        finishedGoodsId,
        finishedGoodsName,
        batchNumber,
        productionDate,
        quantityProduced
      });

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while editing Finished Goods in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in Server" });
  }
};

finishedGoodsController.removeFinishedGoods = async (req, res) => {
  try {
    console.log("deleting Rework...");
const {finishedGoodsId} = req.query;

    const result = await finishedGoodsService.removeFinishedGoods(finishedGoodsId);

    res.status(result.status).json({
      message: result.message,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while removing Finished Goods in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};

module.exports = finishedGoodsController;
