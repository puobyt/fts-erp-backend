const PurchaseOrderCreation = require("../../models/purchaseOrderCreation");
const VendorManagement = require("../../models/vendorManagement");
const crypto = require("crypto");
let purchaseOrderService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;

purchaseOrderService.fetchPurchaseOrderCreation = async () => {
  try {
    const orders = await PurchaseOrderCreation.find({});
    const firms = await VendorManagement.find({});
    console.log(orders)
// const materials = await VendorManagement.find({nameOfTheFirm})
    return {
      status: 200,
      data: orders,
      firms: firms,
    };
  } catch (error) {
    console.log(
      "An error occured at fetching purchase orders in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in fetching purchase order in admin services",
    });
  }
};

// purchaseOrderService.fetchFirms = async () => {
//   try {
//     // const firms = await VendorManagement.find({}, 'nameOfTheFirm')
//     // .sort({ createdAt: -1 })
//     // .exec();

//     const firmNames = await VendorManagement.find({});

//     return {
//       status: 200,
//       data: firmNames,
//     };
//   } catch (error) {
//     console.log(
//       "An error occured at fetching Firms in admin service",
//       error.message
//     );
//     res
//       .status(500)
//       .json({ info: "An error occured in fetching Firms in admin services" });
//   }
// };

purchaseOrderService.newPurchaseOrderCreation = async (newPurchaseData) => {
  try {
    const {
      purchaseOrderNumber,
      date,
      address,
      nameOfTheFirm,
      contactNumber,
      contactPersonName,
      contactPersonDetails,
      vendorId,
      materialName,
      quotationReferenceNumber,
      unit,
      hsn,
      description,
      totalAmount,
      amountInWords,
      discount,
      afterDiscount,
      igst,
      transportationFreight,
      roundOff,
      finalAmount,
      poDate,
      // batchNumber,
      mfgDate,
      quantity,
      price,
      pan,
      gst,
      termsAndConditions
    } = newPurchaseData;
const existingPurchaseOrderNumber = await PurchaseOrderCreation.findOne({purchaseOrderNumber});
if(existingPurchaseOrderNumber){
  return {
    status: 409,
    message: "Purchase Order Number already exists",
  };
}
    const existing = await PurchaseOrderCreation.findOne({
      $and: [
        { purchaseOrderNumber: purchaseOrderNumber },
        { date: date },
        { address: address },
        { nameOfTheFirm: nameOfTheFirm },
        { contactNumber: contactNumber },
        { contactPersonName: contactPersonName },
        { contactPersonDetails: contactPersonDetails },
        { vendorId: vendorId },
        { materialName: materialName },
        // { batchNumber: batchNumber },
        { mfgDate: mfgDate },
        { quantity: quantity },
        { price: price },
        { pan: pan },
        { gst: gst },
      ],
    });

    if (existing) {
      return {
        status: 409,
        message: "Purchase order already exists with the same details",
      };
    }

    let newVendorId;
    let isUnique = false;
    while (!isUnique) {
      newVendorId = `VND-${crypto.randomInt(100000, 999999)}`;

      const existingVendor = await PurchaseOrderCreation.findOne({ vendorId });
      if (!existingVendor) {
        isUnique = true;
      }
    }

    let assignedPurchaseOrderNumber = purchaseOrderNumber;

    if (!purchaseOrderNumber) {
      const lastOrder = await PurchaseOrderCreation.findOne()
        .sort({ createdAt: -1 })
        .select("purchaseOrderNumber");

      if (lastOrder && lastOrder.purchaseOrderNumber) {
        const lastNumber = parseInt(
          lastOrder.purchaseOrderNumber.match(/\d+$/),
          10
        );
        assignedPurchaseOrderNumber = `PUR-ORD-${(lastNumber || 0) + 1}`;
      } else {
        assignedPurchaseOrderNumber = "PUR-ORD-1";
      }
    }
    const newPurchaseOrder = new PurchaseOrderCreation({
      purchaseOrderNumber: assignedPurchaseOrderNumber,
      date,
      address,
      nameOfTheFirm,
      contactNumber,
      contactPersonName,
      contactPersonDetails,
      vendorId: newVendorId,
      materialName,
      quotationReferenceNumber,
      hsn,
      description,
      totalAmount,
      amountInWords,
      unit,
      discount,
      afterDiscount,
      igst,
      transportationFreight,
      roundOff,
      finalAmount,
      poDate,
      // batchNumber,
      mfgDate,
      quantity,
      price,
      pan,
      gst,
      termsAndConditions
    });

    await newPurchaseOrder.save();
    return {
      status: 201,
      message: "Purchase Order added successfully",
      data: newPurchaseOrder,
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at adding purchase order in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in adding new purchase order in admin services",
    });
  }
};

purchaseOrderService.editPurchaseOrderCreation = async (orderData) => {
  try {
    const {
      authPassword,
      orderId,
      purchaseOrderNumber,
      date,
      address,
      nameOfTheFirm,
      contactNumber,
      contactPersonName,
      contactPersonDetails,
      vendorId,
      materialName,
      quotationReferenceNumber,
      hsn,
      description,
      totalAmount,
      unit,
      amountInWords,
      discount,
      afterDiscount,
      igst,
      transportationFreight,
      roundOff,
      finalAmount,
      poDate,
      // batchNumber,
      mfgDate,
      quantity,
      price,
      pan,
      gst,
      termsAndConditions
    } = orderData;

    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }
    const existingPurchaseOrderNumber = await PurchaseOrderCreation.findOne({
      purchaseOrderNumber,
      _id: { $ne: orderId }, // Exclude the current order being edited
    });

    if(existingPurchaseOrderNumber){
      return {
        status: 409,
        message: "Purchase Order Number already exists",
      };
    }
    const existing = await PurchaseOrderCreation.findOne({
      $and: [
        { purchaseOrderNumber: purchaseOrderNumber },
        { date: date },
        { address: address },
        { nameOfTheFirm: nameOfTheFirm },
        { contactNumber: contactNumber },
        { contactPersonName: contactPersonName },
        { contactPersonDetails: contactPersonDetails },
        { vendorId: vendorId },
        { materialName: materialName },
        // { batchNumber: batchNumber },
        { mfgDate: mfgDate },
        { quantity: quantity },
        { price: price },
        { pan: pan },
        { gst: gst },
      ],
    });

    const currentVendor = await PurchaseOrderCreation.findOne({
      $and: [
        { _id: orderId },
        { purchaseOrderNumber: purchaseOrderNumber },
        { date: date },
        { address: address },
        { nameOfTheFirm: nameOfTheFirm },
        { contactNumber: contactNumber },
        { contactPersonName: contactPersonName },
        { contactPersonDetails: contactPersonDetails },
        { vendorId: vendorId },
        { materialName: materialName },
        // { batchNumber: batchNumber },
        { mfgDate: mfgDate },
        { quantity: quantity },
        { price: price },
        { pan: pan },
        { gst: gst },
      ],
    });
    let newVendorId = vendorId;

    if (!vendorId) {
      let isUnique = false;
      while (!isUnique) {
        newVendorId = `VND-${crypto.randomInt(100000, 999999)}`;

        const existingVendor = await PurchaseOrderCreation.findOne({
          vendorId,
        });
        if (!existingVendor) {
          isUnique = true;
        }
      }
    }

    let assignedPurchaseOrderNumber = purchaseOrderNumber;

    if (!purchaseOrderNumber) {
      const lastOrder = await PurchaseOrderCreation.findOne()
        .sort({ createdAt: -1 })
        .select("purchaseOrderNumber");

      if (lastOrder && lastOrder.purchaseOrderNumber) {
        const lastNumber = parseInt(
          lastOrder.purchaseOrderNumber.match(/\d+$/),
          10
        );
        assignedPurchaseOrderNumber = `PUR-ORD-${(lastNumber || 0) + 1}`;
      } else {
        assignedPurchaseOrderNumber = "PUR-ORD-1";
      }
    }
    if (existing && !currentVendor) {
      return {
        status: 409,
        message: "Purchase order already exists with the same details",
      };
    } else {
      const order = await PurchaseOrderCreation.findByIdAndUpdate(
        orderId,
        {
          purchaseOrderNumber: assignedPurchaseOrderNumber,
          date,
          address,
          nameOfTheFirm,
          contactNumber,
          contactPersonName,
          contactPersonDetails,
          vendorId: newVendorId,
          materialName,
          quotationReferenceNumber,
          hsn,
          description,
          totalAmount,
          amountInWords,
          unit,
          discount,
          afterDiscount,
          igst,
          transportationFreight,
          roundOff,
          finalAmount,
          poDate,
          // batchNumber,
          mfgDate,
          quantity,
          price,
          pan,
          gst,
          termsAndConditions
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    return {
      status: 201,
      message: "Purchase Order Edited Successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at editing purchase order management",
      error.message
    );
    res.status(500).json({
      info: "An error occured in purchase order creation management services",
    });
  }
};

purchaseOrderService.removePurchaseOrderCreation = async (purchaseOrderId) => {
  try {
    const purchaseOrder = await PurchaseOrderCreation.findByIdAndDelete(
      purchaseOrderId
    );

    return {
      status: 201,
      message: "Purchase Order deleted successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at Purchase Order Creation remove",
      error.message
    );
    res.status(500).json({
      info: "An error occured in Purchase Order Creation remove in vendor services",
    });
  }
};
purchaseOrderService.fetchAllPurchaseOrder=async(req,res)=>{
  try {
    const pos=await PurchaseOrderCreation.find({})
    return pos
  } catch (error) {
    throw new Error("Failed to get purchase order!")
  }
}

module.exports = purchaseOrderService;
