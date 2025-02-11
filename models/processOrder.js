const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    processOrderNumber: {
      type: String,
    },

    plant: {
      type: String,
    },

    equipment: {
      type: String,
    },
    startDate: {
      type: String,
    },
    finishDate: {
      type: String,
    },
    productName: {
      type: String,
    },
    productCode: {
      type: String,
    },
    batchNumber: {
      type: String,
    },
    orderQuantity: {
      type: String,
    },

    materialInput: [
      {
        materialCode: {
          type: String,
        },
        quantity: {
          type: String,
        },
        batch: {
          type: String,
        },
        storageLocation: {
          type: String,
        },
      },
    ],
    materialOutput: [
      {
        materialCode: {
          type: String,
        },
        quantity: {
          type: String,
        },
        batch: {
          type: String,
        },
        storageLocation: {
          type: String,
        },
        Yield: {
          type: String,
        },
      },
    ],
    operations: [
      {
        operation: {
          type: String, // e.g., Loading, Mixing, etc.
        },
        equipment: {
          type: String, // Equipment used
        },
        startDate: {
          type: String, // Start Date
        },
        endDate: {
          type: String, // End Date
        },
        machineHrs: {
          type: Number, // Machine Hours
        },
        labourHrs: {
          type: Number, // Labour Hours
        },
        powerKwh: {
          type: Number, // Power in Kwh
        },
        steamKg: {
          type: Number, // Steam in Kg
        },
      },
    ],
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

module.exports = mongoose.model("ProcessOrder", schema);
