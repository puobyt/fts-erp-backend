const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    inspectionNumber: {
      type: String,
    },
    productName: {
      type: String,
    },
    inspectionResults: {
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

schema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("FinalQualityInspection", schema);
