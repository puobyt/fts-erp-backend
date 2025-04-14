const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    removed: {
      type: Boolean,
      default: false,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    entryTime: {
      type: String,
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
    },
    docNumber: {
      type: String,
      required: true,
    },
    materials: [
      {
        materialName: {
          type: String,
        },
        quantity: {
          type: String,
        },
      },
    ],
    vendorName: String,
    date: Date,
    createdBy: { type: mongoose.Schema.ObjectId, ref: "Admin" },
    assigned: { type: mongoose.Schema.ObjectId, ref: "Admin" },
  },
  {
    timestamps: true,
  }
);

schema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("GateEntry", schema);
