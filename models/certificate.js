const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certificateName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    reminderSent30: {
      type: Boolean,
      default: false,
    },
    removed: {
      type: Boolean,
      default: false,
    },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "Admin" },
    assigned: { type: mongoose.Schema.ObjectId, ref: "Admin" },
  },
  {
    timestamps: true,
  }
);

certificateSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Certificate", certificateSchema);


