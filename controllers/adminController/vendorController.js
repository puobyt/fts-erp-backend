const express = require("express");

const vendorService = require("../../services/adminServices/vendorService");

let vendorController = {};

vendorController.vendorManagement = async (req, res) => {
  try {
    console.log("loading vendors...");

    const result = await vendorService.vendorManagement();

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: "",
    });
  } catch (error) {
    console.log(
      "An error occurred while fetching vendors in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred" });
  }
};

vendorController.newVendorManagement = async (req, res) => {
  try {
    console.log("Adding new vendor");

    const {
      nameOfTheFirm,
      address,
      contactNumber,
      contactPersonName,
      contactPersonDetails,
      material,
      bankDetails,
      pan,
      gst,
    } = req.body;

    // Pass the extracted data to the service function
    const result = await vendorService.newVendorManagement({
      nameOfTheFirm,
      address,
      contactNumber,
      contactPersonName,
      contactPersonDetails,
      material,
      bankDetails,
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

vendorController.editVendorManagement = async (req, res) => {
  try {
    console.log("Adding new vendor");

    const {
      authPassword,
      vendorId,
      nameOfTheFirm,
      address,
      contact,
      contactPersonName,
      contactPersonDetails,
      material,
      bankDetails,
      pan,
      gst,
    } = req.body;

    // Pass the extracted data to the service function
    const result = await vendorService.editVendorManagement({
      authPassword,
      vendorId,
      nameOfTheFirm,
      address,
      contact,
      contactPersonName,
      contactPersonDetails,
      material,
      bankDetails,
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



vendorController.removeVendorManagement = async (req, res) => {
  try {
    console.log("deleting vendor...");
const {vendorId} = req.query;

    // Pass the extracted data to the service function
    const result = await vendorService.removeVendorManagement(vendorId);

    res.status(result.status).json({
      message: result.message,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while removing vendor in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};

module.exports = vendorController;
