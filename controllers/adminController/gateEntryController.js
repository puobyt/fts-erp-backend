const express = require("express");
const gateEntryService = require("../../services/adminServices/gateEntryService");
let gateEntryController = {};
gateEntryController.newGateExit = async (req, res) => {
  try {
    const uploadedFiles = req.files;
    console.log("Uploaded files:", uploadedFiles);
    console.log(req.body);

    // Parse materials if sent as JSON string
    console.log(req.body);
    const formData = {
      exitTime: req.body.exitTime,
      docNumber: req.body.docNumber,
      vehicleNumber: req.body.vehicleNumber,
      returnReason: req.body.reason,
      date: new Date(req.body.date),
      goodsName: req.body.goodsName,
      quantity: req.body.quantity,
      unit: req.body.unit,
      shippingAddress: req.body.shippingAddress,
      createdBy: req.body.createdBy,
    };

    const result = await gateEntryService.newGateExit(formData);

    res.status(result.status).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Error in newGateExit controller:", error.message);
    res
      .status(500)
      .json({ info: "Failed to process gate exit", error: error.message });
  }
};

gateEntryController.newQcReturnEntry = async (req, res) => {
  try {
    const uploadedFiles = req.files || [];
    console.log(req.files);
    console.log(req.body);
    const formData = {
      ...req.body,
      materials: JSON.parse(req.body.materials),
      serialNumbers: JSON.parse(req.body.serialNumbers || "[]"),
      date: new Date(req.body.date),
      returnReason: req.body.returnReason,
      returnedBy: req.body.returnedBy,
      qcDocuments: uploadedFiles.map((file) => ({
        originalName: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
      })),
    };

    const result = await gateEntryService.newQcReturnEntry(formData);

    res.status(result.status).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Error in newQcReturnEntry controller:", error);
    res.status(500).json({
      info: "Failed to process QC return",
      error: error.message,
    });
  }
};

gateEntryController.updateQcStatus = async (req, res) => {
  try {
    const result = await gateEntryService.updateQcStatus(req.body);
    res.status(result.status).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Error in updateQcStatus controller:", error.message);
    res.status(500).json({ info: "Failed to update QC status" });
  }
};
gateEntryController.fetchGateEntry = async (req, res) => {
  try {
    const { type } = req.query;
    const result = await gateEntryService.fetchGateEntry(type);
    res.status(result.status).json({
      message: result.message,
      firmNames: result.firmNames,
      data: result.data,
    });
  } catch (error) {
    console.error("Error fetching gate entries:", error.message);
    res.status(500).json({ info: "Failed to fetch gate entries" });
  }
};
gateEntryController.newGateEntry = async (req, res) => {
  try {
    console.log("Raw request body:", req.body);
    console.log("Request headers:", req.headers);

    const {
      entryTime,
      materials,
      docNumber,
      vehicleNumber,
      vendorName,
      date,
      createdBy,
    } = req.body;

    // Ensure materials are parsed correctly
    const parsedMaterials =
      typeof materials === "string" ? JSON.parse(materials) : materials;

    const result = await gateEntryService.newGateEntry({
      entryTime,
      materials: parsedMaterials,
      docNumber,
      vehicleNumber,
      vendorName,
      date,
      createdBy,
    });

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log("Error in newGateEntry controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

gateEntryController.importNewGateEntry = async (req, res) => {
  try {
    const { Entry } = req.body.sheetsData;
    const entry = Entry;

    console.log("Adding new entry", entry);

    for (let i = 0; i < entry.length; i++) {
      const { entryTime, vehicleNumber, docNumber, vendorName, date, ...rest } =
        entry[i];

      // extract all material sets
      const materials = [];
      let j = 1;
      while (rest[`materialName${j}`]) {
        materials.push({
          materialName: rest[`materialName${j}`],
          quantity: rest[`quantity${j}`],
          unit: rest[`unit${j}`],
        });
        j++;
      }

      const parsedMaterials =
        typeof materials === "string" ? JSON.parse(materials) : materials;

      const utc_days = Math.floor(entryTime - 25569);
      const utc_value = utc_days * 86400;
      const date_info = new Date(utc_value * 1000);

      const fractional_day = entryTime - Math.floor(entryTime) + 0.0000001;
      let total_seconds = Math.floor(86400 * fractional_day);

      const seconds = total_seconds % 60;
      total_seconds -= seconds;

      const hours = Math.floor(total_seconds / (60 * 60));
      const minutes = Math.floor(total_seconds / 60) % 60;

      console.log(`Data ${i}`, {
        entryTime: `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`,
        materials: parsedMaterials,
        docNumber,
        vehicleNumber,
        vendorName,
        date,
      });

      await gateEntryService.newGateEntry({
        entryTime: `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`,
        materials: parsedMaterials,
        docNumber,
        vehicleNumber,
        vendorName,
        date,
      });
    }

    res.status(200).json({
      message: "Successfully imported",
    });
  } catch (error) {
    console.log("Error in newGateEntry controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

gateEntryController.editGateEntry = async (req, res) => {
  try {
    console.log("editing gate entry");
    const {
      authPassword,
      materials,
      docNumber,
      gateEntryId,
      entryTime,
      vehicleNumber,
      vendorName,
      date,
      editedBy,
    } = req.body;
    const result = await gateEntryService.editGateEntry({
      authPassword,
      gateEntryId,
      materials,
      docNumber,
      entryTime,
      vehicleNumber,
      vendorName,
      date,
      editedBy,
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
    const { gateEntryId, user } = req.query;
    const result = await gateEntryService.removeGateEntry(gateEntryId, user);

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
