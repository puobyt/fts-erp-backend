const express = require("express");

const billOfMaterialsService = require("../../services/adminServices/billOfMaterialsService");

let billOfMaterialsController = {};

billOfMaterialsController.fetchbillOfMaterials = async (req, res) => {
  try {
    console.log("loading bill Of Materials...");

    const result = await billOfMaterialsService.fetchbillOfMaterials();

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

billOfMaterialsController.newBillOfMaterials = async (req, res) => {
  try {
    console.log("Adding new Bill Of Materials ");

    const { bomNumber, productName, materialsList } = req.body;

    const result = await billOfMaterialsService.newBillOfMaterials({
      bomNumber,
      productName,
      materialsList,
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


billOfMaterialsController.editBillOfMaterials = async (req, res) => {
  try {
    console.log("editing Bill Of Materials..");

    const {
      authPassword,
      billOfMaterialsId,
      bomNumber,
      productName,
      materialsList
    } = req.body;

    const result =
      await billOfMaterialsService.editBillOfMaterials({
        authPassword,
        billOfMaterialsId,
        bomNumber,
        productName,
        materialsList
      });

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while editing Material Assignment in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in Server" });
  }
};

billOfMaterialsController.removeBillOfMaterials = async (req, res) => {
  try {
    console.log("deleting Rework...");
const {billOfMaterialsId} = req.query;

    const result = await billOfMaterialsService.removeBillOfMaterials(billOfMaterialsId);

    res.status(result.status).json({
      message: result.message,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while removing bill of materials in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};

module.exports = billOfMaterialsController;
