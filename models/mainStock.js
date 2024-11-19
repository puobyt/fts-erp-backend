const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    productName: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    price: {
      type: String,
    },
    storageLocation: {
        type: String,
      },
    supplier: {
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
