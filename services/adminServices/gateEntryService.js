const GateEntry = require("../../models/gateEntry");
const VendorManagement = require("../../models/vendorManagement");
const moment = require("moment");
let gateEntryService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;

gateEntryService.fetchGateEntry = async () => {
  try {
    const gateEntry = await GateEntry.find({});
    const firmNames = await VendorManagement.distinct("nameOfTheFirm");
    return {
      status: 200,
      firmNames: firmNames,
      data: gateEntry,
    };
  } catch (error) {
    console.log(
      "An error occured at fetching gate entries in admin service",
      error.message
    );
    res
      .status(500)
      .json({ info: "An error occured in fetching orders in admin services" });
  }
};

gateEntryService.newGateEntry = async (newGateEntry) => {
  try {
    const { entryTime, vehicleNumber, vendorName, date } = newGateEntry;

    const existing = await GateEntry.findOne({
      $and: [
        { entryTime: entryTime },
        { vehicleNumber: vehicleNumber },
        { vendorName: vendorName },
        { date: date },
      ],
    });

    if (existing) {
      return {
        status: 409,
        message: "Gate entry already exists with the same details",
      };
    }



    const newEntry = new GateEntry({
      entryTime,
      vehicleNumber,
      vendorName,
      date,
    });

    await newEntry.save();
    return {
      status: 201,
      message: "Gate entry added successfully",
      data: newEntry,
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at adding new Gate entry in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in adding new gate entry in admin services",
    });
  }
};

gateEntryService.editGateEntry = async (gateEntryData) => {
  try {
    const {
      authPassword,
      gateEntryId,
      entryTime,
      vehicleNumber,
      vendorName,
      date,
    } = gateEntryData;

    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }

    const existing = await GateEntry.findOne({
      $and: [
        { entryTime: entryTime },
        { vehicleNumber: vehicleNumber },
        { vendorName: vendorName },
        { date: date },
      ],
    });

    const currentGateEntry = await GateEntry.findOne({
      $and: [
        { _id: gateEntryId },
        { entryTime: entryTime },
        { vehicleNumber: vehicleNumber },
        { vendorName: vendorName },
        { date: date },
      ],
    });

    if (existing && !currentGateEntry) {
      return {
        status: 409,
        message: "Gate Entry already exists with the same details",
      };
    }

    const formatTo12Hour = (time24) => moment(time24, "HH:mm").format("h:mm A");
    const formattedTime = formatTo12Hour(entryTime);
    const gateEntry = await GateEntry.findByIdAndUpdate(
      gateEntryId,
      {
        entryTime: formattedTime,
        vehicleNumber,
        vendorName,
        date,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return {
      status: 201,
      message: "Gate Entry Edited Successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log("An error occured at editing Gate Entry", error.message);
    res.status(500).json({
      info: "An error occured in Gate Entry management services",
    });
  }
};

gateEntryService.removeGateEntry = async (gateEntryId) => {
  try {
    const gateEntry = await GateEntry.findByIdAndDelete(gateEntryId);

    return {
      status: 201,
      message: "Gate Entry deleted successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log("An error occured at Gate entry remove", error.message);
    res.status(500).json({
      info: "An error occured in Gate entry remove in gate entry services",
    });
  }
};

module.exports = gateEntryService;
