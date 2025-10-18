const { default: mongoose } = require("mongoose");
const { AuditLog } = require("../../models/auditLog");
const ProductionOrderCreationOutput = require("../../models/productionOrderCreationOutput");
const ProductionOrderCreation = require("../../models/productionOrderCreation");
const CurrentStock = require("../../models/currentStock");
const GateEntry = require("../../models/gateEntry");
const BillOfMaterials = require("../../models/billOfMaterials");
const FinalQualityInspection = require("../../models/finalQualityInspection");
const FinishedGoods = require("../../models/finishedGoods");
const InvoiceCreation = require("../../models/invoiceCreation");
const MainStock = require("../../models/mainStock");
const MaterialAssignment = require("../../models/materialAssignment");
const OutOfStock = require("../../models/outOfStock");
const ProcessOrder = require("../../models/processOrder");
const PurchaseOrderCreation = require("../../models/purchaseOrderCreation");
const QualityCheck = require("../../models/qualityCheck");
const RequestCreationForMaterials = require("../../models/requestCreationForMaterials");
const Rework = require("../../models/rework");
const VendorManagement = require("../../models/vendorManagement");
const Certificate = require("../../models/certificate");


const auditLogsService = {}
// Create a mapping between audit log model names and actual Mongoose models
const MODEL_NAME_MAPPING = {
  'production-order-creation-output': 'ProductionOrderCreationOutput',
  'gate-entry': 'GateEntry',
  'production-order-creation': 'ProductionOrderCreation',
  'current-stock': 'CurrentStock',
  'bill-of-materials': 'BillOfMaterials',
  'final-quality-inspection': 'FinalQualityInspection',
  'finished-goods': 'FinishedGoods',
  'invoice-creation': 'InvoiceCreation',
  'main-stock': 'MainStock',
  'material-assignment': 'MaterialAssignment',
  'out-of-stock': 'OutOfStock',
  'process-order': 'ProcessOrder',
  'purchase-order-creation': 'PurchaseOrderCreation',
  'quality-check': 'QualityCheck',
  'request-creation-for-materials': 'RequestCreationForMaterials',
  'rework': 'Rework',
  'vendor-management': 'VendorManagement',
  'certificate': 'Certificate',
};
const getModelName = (auditLogModelName) => {
  console.log(`auditLogModelName --- ${auditLogModelName}`, MODEL_NAME_MAPPING[auditLogModelName])
  return MODEL_NAME_MAPPING[auditLogModelName] || auditLogModelName;
};

auditLogsService.fetchAllLogs = async () => {
  try {
    const logs = await AuditLog.find({}).lean();

    const populatedLogs = await Promise.all(
      logs.map(async (log) => {
        if (log.model && log.recordId) {
          try {
            // Get the correct model name
            const modelName = getModelName(log.model);

            // Dynamically get the model and populate
            const ModelRef = mongoose.model(modelName);
            console.log('ModelRef', ModelRef)
            const populatedRecord = await ModelRef.findById(log.recordId);

            return {
              ...log,
              recordData: populatedRecord,
            };
          } catch (error) {
            console.log(`Could not populate model ${log.model}:`, error.message);
            return log;
          }
        }
        return log;
      })
    );

    return {
      status: 200,
      data: populatedLogs,
    };
  } catch (error) {
    console.log("An error occurred at fetching logs", error.message);
    throw error;
  }
};

module.exports = auditLogsService