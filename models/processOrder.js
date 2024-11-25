const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    processOrderNumber: {
      type: String,
    },

    productName: {
      type: String,
    },

    description: {
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

module.exports = mongoose.model("ProcessOrder", schema);
