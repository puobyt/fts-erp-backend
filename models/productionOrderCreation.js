const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    processOrder: {
      type: String,
    },
    plant: {
      type: String,
    },
    materials: [
      {
        materialsList: {
          type: String,
        },
        requiredQuantity: {
          type: String,
        },
        unit: {
          type: String,
        },
        materialCode: {
          type: String,
        },
      },
    ],
    productName: {
      type: String,
    },
    productQuantity: {
      type: String,
    },

    productDescription: {
      type: String,
    },
    batch: {
      type: String,
    },
    instructions: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
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

module.exports = mongoose.model("ProductionOrderCreation", schema);
