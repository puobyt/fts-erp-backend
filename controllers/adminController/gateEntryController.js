const express = require("express");

const gateEntryService = require("../../services/adminServices/gateEntryService");

let gateEntryController = {};

gateEntryController.fetchGateEntry = async (req, res) => {
  try {
    console.log("loading gate entry...");

    const result = await gateEntryService.fetchGateEntry();

    res.status(result.status).json({
      message: result.message,
      firmNames:result.firmNames,
      data: result.data,
      userToken: "",
    });
  } catch (error) {
    console.log(
      "An error occurred while fetching gate entries in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred" });
  }
};

gateEntryController.newGateEntry = async (req, res) => {
  try {
    console.log("Adding new gate entry ",req.body);

    const {entryTime,materials,docNumber, vehicleNumber, vendorName, date } = req.body;

    // Pass the extracted data to the service function
    const result = await gateEntryService.newGateEntry({
      entryTime,
      materials,
      docNumber,
      vehicleNumber,
      vendorName,
      date,
    });

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while adding new gate entry in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in Server" });
  }
};

gateEntryController.editGateEntry = async (req, res) => {
  try {
    console.log("editing gate entry");

    const { authPassword,materials,docNumber, gateEntryId,entryTime, vehicleNumber, vendorName, date } =
      req.body;

    // Pass the extracted data to the service function
    const result = await gateEntryService.editGateEntry({
      authPassword,
      gateEntryId,
      materials,
      docNumber,
      entryTime,
      vehicleNumber,
      vendorName,
      date,
    });

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while adding editing gate entry in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred" });
  }
};


gateEntryController.removeGateEntry = async (req, res) => {
  try {
    console.log("deleting Production Order Creation...");
const {gateEntryId} = req.query;
    // Pass the extracted data to the service function
    const result = await gateEntryService.removeGateEntry(gateEntryId);

    res.status(result.status).json({
      message: result.message,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while removing gate Entry in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};

module.exports = gateEntryController;
