const mongoose = require("mongoose");


const schema = new mongoose.Schema(
  {
    producedQuantity: {
      type: String,
    },
    productionCompletionDate: {
      type: Date,
    },
    // qualityCheckStatus: {
    //   type: String,
    // },
    storageLocationforOutput: {
      type: String,
    },
    batchNumberforOutput: {
      type: String,
    },
    productionNotes: {
      type: String,
    },
    Yield: {
      type: String,
    },
    outputQualityRating: {
      type: String,
    },
    outputHandlingInstructions: {
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

module.exports = mongoose.model("ProductionOrderCreationOutput", schema);
