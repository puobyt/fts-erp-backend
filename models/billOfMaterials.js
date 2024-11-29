const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    bomNumber: {
      type: String,
    },
    productName: {
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
        materialCode: {
          type: String,
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

module.exports = mongoose.model("BillOfMaterials", schema);
