const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    requestNumber: {
      type: String,
    },
    batchNumber: {
      type: String,
    },
    materials: [
      {
        materialsList: {
          type: String,
        },
        quantity: {
          type: String,
        },
      },
    ],
    quantity: {
      type: String,
    },
    requiredDate: {
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

module.exports = mongoose.model("RequestCreationForMaterials", schema);
