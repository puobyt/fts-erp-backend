const PurchaseOrderCreation = require("../../models/purchaseOrderCreation");
const VendorManagement = require("../../models/vendorManagement");
let purchaseOrderService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;

purchaseOrderService.fetchPurchaseOrderCreation = async () => {
  try {
    const orders = await PurchaseOrderCreation.find({})
    .sort({ createdAt: -1 })
    .populate({ path: 'vendorId', select: 'nameOfTheFirm' });

    return {
      status: 200,
      data: orders,
    };
  } catch (error) {
    console.log(
      "An error occured at fetching purchase orders in admin service",
      error.message
    );
    res
      .status(500)
      .json({
        info: "An error occured in fetching purchase order in admin services",
      });
  }
};

purchaseOrderService.fetchFirms = async () => {
  try {
    // const firms = await VendorManagement.find({}, 'nameOfTheFirm')
    // .sort({ createdAt: -1 })
    // .exec();

    const firmNames = await VendorManagement.distinct("nameOfTheFirm");
    const contact = await VendorManagement.distinct("contact");
    return {
      status: 200,
      data: firmNames,
      contact:contact
    };
  } catch (error) {
    console.log(
      "An error occured at fetching Firms in admin service",
      error.message
    );
    res
      .status(500)
      .json({ info: "An error occured in fetching Firms in admin services" });
  }
};

purchaseOrderService.newPurchaseOrderCreation = async (newPurchaseData) => {
  try {
    const {
      purchaseOrderNumber,
      date,
      address,
      nameOfTheFirm,
      contact,
      contactPersonName,
      contactPersonDetails,
      vendorId,
      productName,
      batchNumber,
      mfgDate,
      quantity,
      price,
      pan,
      gst,
    } = newPurchaseData;

    const existing = await PurchaseOrderCreation.findOne({
      $and: [
        { purchaseOrderNumber: purchaseOrderNumber },
        { date: date },
        { address: address },
        { nameOfTheFirm: nameOfTheFirm },
        { contact: contact },
        { contactPersonName: contactPersonName },
        { contactPersonDetails: contactPersonDetails },
        { vendorId: vendorId },
        { productName: productName },
        { batchNumber: batchNumber },
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

    const newPurchaseOrder = new PurchaseOrderCreation({
      purchaseOrderNumber,
      date,
      address,
      nameOfTheFirm,
      contact,
      contactPersonName,
      contactPersonDetails,
      vendorId,
      productName,
      batchNumber,
      mfgDate,
      quantity,
      price,
      pan,
      gst,
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
    res
      .status(500)
      .json({
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
      contact,
      contactPersonName,
      contactPersonDetails,
      vendorId,
      productName,
      batchNumber,
      mfgDate,
      quantity,
      price,
      pan,
      gst,
    } = orderData;

    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }

    const existing = await PurchaseOrderCreation.findOne({
      $and: [
        { purchaseOrderNumber: purchaseOrderNumber },
        { date: date },
        { address: address },
        { nameOfTheFirm: nameOfTheFirm },
        { contact: contact },
        { contactPersonName: contactPersonName },
        { contactPersonDetails: contactPersonDetails },
        { vendorId: vendorId },
        { productName: productName },
        { batchNumber: batchNumber },
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
        { contact: contact },
        { contactPersonName: contactPersonName },
        { contactPersonDetails: contactPersonDetails },
        { vendorId: vendorId },
        { productName: productName },
        { batchNumber: batchNumber },
        { mfgDate: mfgDate },
        { quantity: quantity },
        { price: price },
        { pan: pan },
        { gst: gst },
      ],
    });

    if (existing && !currentVendor) {
      return {
        status: 409,
        message: "Purchase order already exists with the same details",
      };
    } else {
      const order = await PurchaseOrderCreation.findByIdAndUpdate(
        orderId,
        {
          purchaseOrderNumber,
          date,
          address,
          nameOfTheFirm,
          contact,
          contactPersonName,
          contactPersonDetails,
          vendorId,
          productName,
          batchNumber,
          mfgDate,
          quantity,
          price,
          pan,
          gst,
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
    console.log("An error occured at editing purchase order management", error.message);
    res
      .status(500)
      .json({ info: "An error occured in purchase order creation management services" });
  }
};

module.exports = purchaseOrderService;
