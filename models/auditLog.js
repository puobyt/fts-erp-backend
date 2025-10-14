const { default: mongoose } = require("mongoose");

const auditLogSchema = new mongoose.Schema({
    action: String,
    model: String,
    recordId: mongoose.Schema.Types.ObjectId,
    user: String,
    data: {},
    timestamp: { type: Date, default: Date.now },
});

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

module.exports = { AuditLog }