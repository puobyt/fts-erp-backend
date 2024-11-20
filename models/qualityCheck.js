const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    batchNumber: {
      type: String,
    },
    materialName: {
      type: String,
    },
    inspectionDate: {
      type: Date,
    },
    inspectorName: {
      type: String,
    },
    qualityStatus: {
      type: String,
    },
    comments: {
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
    timestamps: true,
  }
);

schema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("QualityCheck", schema);
