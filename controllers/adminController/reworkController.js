const express = require("express");

const reworkService = require("../../services/adminServices/reworkService");

let reworkController = {};

reworkController.fetchRework = async (req, res) => {
  try {
    console.log("loading reworks...");

    const result = await reworkService.fetchRework();

    res.status(result.status).json({
      message: result.message,
      data: result.data,
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

module.exports = reworkController;
