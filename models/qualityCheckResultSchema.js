const mongoose = require('mongoose');

const qualityCheckResultSchema = new mongoose.Schema({
  qualityCheck: {
    type: mongoose.Types.ObjectId,
    ref: "QualityCheck",
    required: true,
    autopopulate: true
  },
  parameter: {  
    type: mongoose.Types.ObjectId,
    ref: "QualityParameter",
    required: true,
    autopopulate: true
  },
  actualResult: { type: Number, required: true },
  status: { type: String, enum: ['PASS', 'FAIL'], required: true },
  remarks: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", autopopulate: true },
  removed: { type: Boolean, default: false }
}, { timestamps: true });

/**
 * Note: You can't reliably access parameter.minRange/maxRange in a pre-save hook
 * unless you populate it first or pass it from your service/controller.
 * You should handle status calculation in your controller/service logic instead.
 */

qualityCheckResultSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model("QualityCheckResult", qualityCheckResultSchema);