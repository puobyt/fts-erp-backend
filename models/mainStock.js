const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    currentStockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CurrentStock",
    },

    materialName: {
      type: String,
    },
    materialCode: {
      type: String,
    },
    grn: {
      type: String,
    },
    quantity: {
      type: String,
    },
    quantityUsed: {
      type: String,

    },
    price: {
      type: String,
    },
    storageLocation: {
      type: String,
    },
    vendorName: {
      type: String,
    },
    dateRecieved: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },

    createdBy: { type: mongoose.Schema.ObjectId, ref: "Admin" },
    assigned: { type: mongoose.Schema.ObjectId, ref: "Admin" },

    removed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

schema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("MainStock", schema);
