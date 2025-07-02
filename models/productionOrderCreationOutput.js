const mongoose = require("mongoose");

const PackingMaterialSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
  },
  { _id: false }
);

const schema = new mongoose.Schema(
  {
    productName: { type: String },
    purchaseOrder: { type: mongoose.Schema.ObjectId, ref: "PurchaseOrderCreation" },
    producedQuantity: { type: String },
    productionCompletionDate: { type: Date },
    // qualityCheckStatus: { type: String },
    storageLocationforOutput: { type: String },
    batchNumberforOutput: { type: String },
    productionNotes: { type: String },
    Yield: { type: String },
    outputQualityRating: { type: String },
    outputHandlingInstructions: { type: String },

    packingMaterials: [PackingMaterialSchema], 

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