const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    batchNumber: { type: String },
    grn:{ type: String },
    materialName: { type: String, required: true },
    materialCode: { type: String, required: true },
    inspectionDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    inspectorName: { type: String },
    qualityStatus: { type: String },
    comments: { type: String },
    reassessmentHistory: [
      {
        date: Date,
        previousStatus: String,
        currentStatus: String,
        reason: String,
        performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", autopopulate: true }
      }
    ],
    createdBy: { type: mongoose.Schema.ObjectId, ref: "Admin" },
    assigned: { type: mongoose.Schema.ObjectId, ref: "Admin" },
    removed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

schema.methods.needReassessment = function () {
  const today = new Date();
  const expiryThreshold = new Date();
  expiryThreshold.setDate(today.getDate() + 30);
  return this.expiryDate <= expiryThreshold;
};

schema.methods.addReassessment = function (previousStatus, currentStatus, reason, performedBy) {
  this.reassessmentHistory.push({
    date: new Date(),
    previousStatus,
    currentStatus,
    reason,
    performedBy
  });
  this.qualityStatus = currentStatus;
};

schema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("QualityCheck", schema);