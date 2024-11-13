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

    invoiceNumber: {
      type: String,
    },
    invoiceDate: {
      type: Date,
    },
    customerName: {
      type: String,
    },
    customerAddress: {
      type: String,
    },
    itemName: {
      type: String,
    },
    quantity: {
      type: String,
    },
    price: {
      type: String,
    },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "Admin" },
    assigned: { type: mongoose.Schema.ObjectId, ref: "Admin" },
  },
  {
    timestamps: true,
  }
);

schema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("InvoiceCreation", schema);
