const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    assignmentNumber: {
      type: String,
    },
    materialName: {
      type: String,
    },
    assignedQuantity: {
      type: String,
    },
    assignedTo: {
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

module.exports = mongoose.model("MaterialAssignment", schema);
