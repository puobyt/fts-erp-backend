const express = require("express");
const VendorManagement = require("../../models/vendorManagement");
let vendorService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;

vendorService.vendorManagement = async (newVendorData) => {
  try {
    const vendors = await VendorManagement.find({})

    return {
      status: 200,
      data: vendors,
    };
  } catch (error) {
    console.log("An error occured at login", error.message);
    res.status(500).json({ info: "An error occured in vendor in services" });
  }
};

vendorService.newVendorManagement = async (newVendorData) => {
  try {
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
    } = newVendorData;

    const existingVendor = await VendorManagement.findOne({$or:[{vendorCode},{gst}]});

    if (existingVendor) {
      return {
        status: 409,
        message: "Vendor already exists with the same details",
      };
    }

    const newVendor = new VendorManagement({
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

    await newVendor.save();
    return {
      status: 201,
      message: "Vendor added successfully",
      data: newVendor,
      token: "sampleToken",
    };
  } catch (error) {
    console.log("An error occured at login", error.message);
    res
      .status(500)
      .json({ info: "An error occured in Vendor added vendor services" });
  }
};

vendorService.editVendorManagement = async (VendorData) => {
  try {
    const {
      authPassword,
      vendorId,
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
    } = VendorData;

    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }

   const existingVendor = await VendorManagement.findOne({
  _id: { $ne: vendorId },
  $or: [
    { vendorCode: vendorCode },
    { gst: gst }
  ]
});


    if (existingVendor ) {
      return {
        status: 409,
        message: "Vendor already exists with the same details",
      };
    } else {
      const vendor = await VendorManagement.findByIdAndUpdate(
        vendorId,
        {
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
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    return {
      status: 201,
      message: "Vendor Edited successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log("An error occured at editing vendor management", error.message);
    res
      .status(500)
      .json({ info: "An error occured in  vendor management services" });
  }
};

vendorService.removeVendorManagement = async (vendorId) => {
  try {
    const vendor = await VendorManagement.findByIdAndDelete(vendorId);

    return {
      status: 201,
      message: "Vendor deleted successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log("An error occured at vendor remove", error.message);
    res
      .status(500)
      .json({ info: "An error occured in Vendor remove in vendor services" });
  }
};

module.exports = vendorService;
