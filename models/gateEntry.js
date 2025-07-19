  const mongoose = require("mongoose");

  const schema = new mongoose.Schema(
    {
      removed: {
        type: Boolean,
        default: false,
      },
      enabled: {
        type: Boolean,
        default: true,
      },
      entryTime: {
        type: String,
      },
      exitTime: {
        type: String, // Added for exit time
      },
      returnReason:{
        type:String
      },
      returnedBy:{
        type:String
      },
      vehicleNumber: {
        type: String,
        required: true,
      },
      docNumber: {
        type: String,
        required: true,
      },
      materials: [
        {
          materialName: {
            type: String,
          },
          quantity: {
            type: String,
          },
          returnedQuantity: {
            type: String, // Added for tracking returned quantity in returns
          },
          unit: {
            type: String,
            required: true,
            enum: ['KG', 'Gram', 'Litre', 'ML', 'Pieces'],
          },
          batchNumber: {
            type: String, // Added for batch/lot tracking
          },
          qcStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'hold'],
            default: 'pending', // Default QC status
          },
          qcRemarks: {
            type: String, // Added for QC remarks
          },
        },
      ],
      vendorName: {
        type: String,
      },
      date: {
        type: Date,
        required: true, // Ensure date is required
      },
      createdBy: { 
        type: mongoose.Schema.ObjectId, 
        ref: "Admin" 
      },
      assigned: { 
        type: mongoose.Schema.ObjectId, 
        ref: "Admin" 
      },
      gateType: {
        type: String,
        enum: ['entry', 'exit', 'qc_return_entry', 'return_exit'],
        default: 'entry', // Default gate type
      },
      returnReason: {
        type: String, // Added for return reason
      },
      originalDocNumber: {
        type: String, // Added for tracking original document number in returns
      },
      returnedBy: {
        type: String, // Added for tracking who returned the items
      },
      approvedBy: {
        type: String, // Added for tracking who approved the return
      },
      expectedReturnDate: {
        type: Date, // Added for expected return date
      },
      returnType: {
        type: String,
        enum: ['vendor', 'customer'],
        default: 'vendor', // Default return type
      },
      replacementRequired: {
        type: Boolean, // Added to indicate if replacement is required
        default: false,
      },
      replacementDueDate: {
        type: Date, // Added for replacement due date
      },
      qcDocuments: [
    {
      originalName: { type: String },
      path: { type: String },
      mimetype: { type: String },
      size: { type: Number }
    }
  ]

    },  
    {
      timestamps: true,
    }
  );

  schema.plugin(require("mongoose-autopopulate"));

  module.exports = mongoose.model("GateEntry", schema);
    