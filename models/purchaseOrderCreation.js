const mongoose = require("mongoose");

const PurchaseOrderCreationSchema = new mongoose.Schema(
  {
    purchaseOrderNumber: { type: String },
    termsAndConditions: { type: [String] },
    date: { type: Date },
    nameOfTheFirm: { type: String },
    address: { type: String },
    quotationReferenceNumber: { type: String },
    hsn: { type: String },
    description: { type: String },
    totalAmount: { type: String },
    amountInWords: { type: String },
    discount: { type: String },
    afterDiscount: { type: String },
    igst: { type: String },
    transportationFreight: { type: String },
    roundOff: { type: String },
    finalAmount: { type: String },
    poDate: { type: String },
    contactNumber: { type: String },
    contactPersonName: { type: String },
    contactPersonDetails: { type: String },
    vendorId: { type: String, ref: 'VendorManagement' },
    pan: { type: String },
    gst: { type: String },
    deliveryAddress:{type:String},
    createdBy: { type: mongoose.Schema.ObjectId, ref: "Admin" },
    assigned: { type: mongoose.Schema.ObjectId, ref: "Admin" },
    removed: { type: Boolean, default: false },
    materials: [
      {
        materialName: { type: String },
        quantity: { type: String },
        unit: { type: String },
        price: { type: String },
        mfgDate: { type: Date }
        // batchNumber: { type: String }
      }
    ]
  },
  {
    timestamps: true,
  }
);

PurchaseOrderCreationSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model(
  "PurchaseOrderCreation",
  PurchaseOrderCreationSchema
);