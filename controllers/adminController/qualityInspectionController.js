const express = require("express");

const qualityInspectionService = require("../../services/adminServices/qualityInspectionService");

let qualityInspectionController = {};

qualityInspectionController.fetchQualityInspection = async (req, res) => {
  try {
    console.log("loading Quality Inspection...");

    const result = await qualityInspectionService.fetchQualityInspection();

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      productNames:result.productNames,
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
qualityInspectionController.newQualityInspection = async (req, res) => {
  try {
    console.log("Adding new Quality Inspection ");

    const { inspectionNumber, productName, inspectionResults,date,batchNumber,quantity, unit, createdBy } = req.body;

    const result = await qualityInspectionService.newQualityInspection({
      inspectionNumber,
      productName,
      inspectionResults,
      date,
      batchNumber,
      quantity,
      unit,
      createdBy
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


qualityInspectionController.editQualityInspection = async (req, res) => {
  try {
    console.log("editing Quality Inspection..");

    const {
      authPassword,
      qualityInspectionId,
      inspectionNumber,
      productName,
      inspectionResults,
      date,
      batchNumber,
      quantity,
      unit,
      editedBy
    } = req.body;

    const result =
      await qualityInspectionService.editQualityInspection({
        authPassword,
        qualityInspectionId,
        inspectionNumber,
        productName,
        inspectionResults,
        date,
        batchNumber,
        quantity,
        unit,
        editedBy
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

qualityInspectionController.removeFinalQualityInspection = async (req, res) => {
  try {
    console.log("deleting Rework...");
const {qualityInspectionId, user} = req.query;

    const result = await qualityInspectionService.removeFinalQualityInspection(qualityInspectionId,user);

    res.status(result.status).json({
      message: result.message,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while removing final quality inspection in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};

module.exports = qualityInspectionController;
