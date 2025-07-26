const express = require("express");

const reworkService = require("../../services/adminServices/reworkService");
const qualityCheckService = require("../../services/adminServices/qualityCheckService");

let reworkController = {};

reworkController.fetchRework = async (req, res) => {
  try {
    console.log("loading reworks...");

    const result = await reworkService.fetchRework();

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      batches:result.batches,
      userToken: "",
    });
  } catch (error) {
    console.log(
      "An error occurred while fetching reworks in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};
reworkController.newRework = async (req, res) => {
  try {
    console.log("Adding new rework ");

    const {
      batchNumber,
      materialName,
      inspectionDate,
      inspectorName,
      issueDescription,
      proposedReworkAction,
      reworkStartDate,
      reworkCompletionDate,
      quantityForRework,
      reworkStatus,
      comments,
    } = req.body;

    const result = await reworkService.newRework({
      batchNumber,
      materialName,
      inspectionDate,
      inspectorName,
      issueDescription,
      proposedReworkAction,
      reworkStartDate,
      reworkCompletionDate,
      quantityForRework,
      reworkStatus,
      comments,
    });

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while adding new Rework in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in Server" });
  }
};


reworkController.editRework = async (req, res) => {
    try {
      console.log("editing rework..");
  
      const {
        authPassword,
        reworkId,
        batchNumber ,
        materialName,
        inspectionDate ,
        inspectorName,
        issueDescription,
        proposedReworkAction,
        reworkStartDate,
        reworkCompletionDate,
        quantityForRework,
        reworkStatus,
        comments
      } = req.body;
  

      const result = await reworkService.editRework({
        authPassword,
        reworkId,
        batchNumber ,
        materialName,
        inspectionDate ,
        inspectorName,
        issueDescription,
        proposedReworkAction,
        reworkStartDate,
        reworkCompletionDate,
        quantityForRework,
        reworkStatus,
        comments
      });
  
      res.status(result.status).json({
        message: result.message,
        data: result.data,
        userToken: result.token,
      });
    } catch (error) {
      console.log(
        "An error occurred while adding editing Current Stock in admin controller:",
        error.message
      );
      res.status(500).json({ info: "An error occurred" });
    }
  };

  reworkController.removeRework = async (req, res) => {
    try {
      console.log("deleting Rework...");
  const {reworkId} = req.query;
      // Pass the extracted data to the service function
      const result = await reworkService.removeRework(reworkId);
  
      res.status(result.status).json({
        message: result.message,
        userToken: result.token,
      });
    } catch (error) {
      console.log(
        "An error occurred while removing Rework in admin controller:",
        error.message
      );
      res.status(500).json({ info: "An error occurred in server" });
    }
  };

  reworkController.getQuarentineItems = async(req,res)=>{
    try {
      console.log("deleting Rework...");
      // Pass the extracted data to the service function
      const result = await qualityCheckService.fetchQualityCheck({qualityStatus: "Quarantine"}, {inspectionResults: 'Quarantine'})
      res.status(result.status).json({
        data: result.data,
        message: result.message,
        userToken: result.token,
      });
    } catch (error) {
      console.log(
        "An error occurred while removing Rework in admin controller:",
        error.message
      );
      res.status(500).json({ info: "An error occurred in server" });
    }
  }

module.exports = reworkController;
