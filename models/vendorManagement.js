const mongoose = require("mongoose");

const vendorManagementSchema = new mongoose.Schema(
  {
    nameOfTheFirm: {
      type: String,
    },
    address: {
      type: String,
    },
    vendorCode: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    contactPersonName: {
      type: String,
    },
    contactPersonDetails: {
      type: String,
    },
    bankDetails: {
      type: String,
    },
    material: {
      type: String,
    },
    pan: {
      type: String,
    },
    gst: {
      type: String,
    },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "Admin" },
    assigned: { type: mongoose.Schema.ObjectId, ref: "Admin" },
    removed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Enables createdAt and updatedAt fields
  }
);

vendorManagementSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("VendorManagement", vendorManagementSchema);
