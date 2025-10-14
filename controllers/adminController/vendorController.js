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
      vendorCode,
      contactNumber,
      contactPersonName,
      contactPersonDetails,
      material,
      bankDetails,
      pan,
      gst,
      createdBy
    } = req.body;

    const result = await vendorService.newVendorManagement({
      nameOfTheFirm,
      address,
      vendorCode,
      contactNumber,
      contactPersonName,
      contactPersonDetails,
      material,
      bankDetails,
      pan,
      gst,
      createdBy
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

vendorController.importVendors = async (req, res) => {
  try {

    const { Vendors } = req.body.sheetsData
    const vendors = Vendors

    console.log('Adding new vendors', vendors)

    for (let i = 0; i < vendors.length; i++) {
      const {
        nameOfTheFirm,
        address,
        vendorCode,
        contactNumber,
        contactPersonName,
        contactPersonDetails,
        material,
        bankDetails,
        pan,
        gst,
      } = vendors[i];

      console.log(`Adding new vendors ${i}`, vendors[i])


      await vendorService.newVendorManagement({
        nameOfTheFirm,
        address,
        vendorCode,
        contactNumber,
        contactPersonName,
        contactPersonDetails,
        material,
        bankDetails,
        pan,
        gst,
      });


    }

    res.status(200).json({
      message: 'successfully inserted',
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
      vendorCode,
      contact,
      contactPersonName,
      contactPersonDetails,
      material,
      bankDetails,
      pan,
      gst,
      editedBy
    } = req.body;

    // Pass the extracted data to the service function
    const result = await vendorService.editVendorManagement({
      authPassword,
      vendorId,
      nameOfTheFirm,
      address,
      vendorCode,
      contact,
      contactPersonName,
      contactPersonDetails,
      material,
      bankDetails,
      pan,
      gst,
      editedBy
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
const {vendorId, user} = req.query;


    // Pass the extracted data to the service function
    const result = await vendorService.removeVendorManagement(vendorId,user);

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
