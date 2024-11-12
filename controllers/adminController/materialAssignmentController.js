const express = require("express");

const materialAssignmentService = require("../../services/adminServices/materialAssignmentService");

let materialAssignmentController = {};

materialAssignmentController.fetchMaterialAssignment = async (req, res) => {
  try {
    console.log("loading Material Assignment...");

    const result = await materialAssignmentService.fetchMaterialAssignment();

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: "",
    });
  } catch (error) {
    console.log(
      "An error occurred while fetching Material Assignment in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};
materialAssignmentController.newMaterialAssignment = async (req, res) => {
  try {
    console.log("Adding new Material Assignment ");

    const { assignmentNumber, materialName, assignedQuantity, assignedTo } =
      req.body;

    const result = await materialAssignmentService.newMaterialAssignment({
      assignmentNumber,
      materialName,
      assignedQuantity,
      assignedTo,
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

materialAssignmentController.editMaterialAssignment = async (req, res) => {
  try {
    console.log("editing Material Assignment..");

    const {
      authPassword,
      materialAssignmentId,
      assignmentNumber,
      materialName,
      assignedQuantity,
      assignedTo,
    } = req.body;

    const result =
      await materialAssignmentService.editMaterialAssignment({
        authPassword,
        materialAssignmentId,
        assignmentNumber,
        materialName,
        assignedQuantity,
        assignedTo,
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

materialAssignmentController.removeMaterialAssignment = async (req, res) => {
  try {
    console.log("deleting Rework...");
const {materialAssignmentId} = req.query;
    // Pass the extracted data to the service function
    const result = await materialAssignmentService.removeMaterialAssignment(materialAssignmentId);

    res.status(result.status).json({
      message: result.message,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while removing material assignment in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};

module.exports = materialAssignmentController;
