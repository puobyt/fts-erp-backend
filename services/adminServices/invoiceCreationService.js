let invoiceCreationService = {};
const InvoiceCreation = require("../../models/invoiceCreation");
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;

invoiceCreationService.fetchInvoiceCreations = async () => {
  try {
    const data = await InvoiceCreation.find({}).sort({ createdAt: -1 });

    return {
      status: 200,
      data: data,
    };
  } catch (error) {
    console.log(
      "An error occured at fetching Invoice Creation in admin service",
      error.message
    );
    res
      .status(500)
      .json({
        info: "An error occured in fetching Invoice Creation in admin services",
      });
  }
};

invoiceCreationService.newInvoiceCreation = async (invoiceData) => {
  try {
    const {
      invoiceNumber,
      invoiceDate,
      customerName,
      customerAddress,
      itemName,
      quantity,
      price,
    } = invoiceData;

    const existingInvoice = await InvoiceCreation.findOne({
      $and: [
        { invoiceNumber: invoiceNumber },
        { invoiceDate: invoiceDate },
        { customerName: customerName },
        { customerAddress: customerAddress },
        { itemName: itemName },
        { quantity: quantity },
        { price: price },
      ],
    });

    if (existingInvoice) {
      return {
        status: 409,
        message: "Invoice already exists with the same details",
      };
    }

    const newInvoice = new InvoiceCreation({
      invoiceNumber,
      invoiceDate,
      customerName,
      customerAddress,
      itemName,
      quantity,
      price,
    });

    await newInvoice.save();
    return {
      status: 201,
      message: "Invoice added successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log("An error occured at Invoice Creation", error.message);
    res.status(500).json({
      info: "An error occured in adding Invoice Creation in invoice services",
    });
  }
};

invoiceCreationService.editInvoiceCreation = async (invoiceData) => {
  try {
    const {
      authPassword,
      invoiceId,
      invoiceNumber,
      invoiceDate,
      customerName,
      customerAddress,
      itemName,
      quantity,
      price,
    } = invoiceData;

    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }

    const existing = await InvoiceCreation.findOne({
      $and: [
        { invoiceNumber: invoiceNumber },
        { invoiceDate: invoiceDate },
        { customerName: customerName },
        { customerAddress: customerAddress },
        { itemName: itemName },
        { quantity: quantity },
        { price: price },
      ],
    });

    const currentInvoice = await InvoiceCreation.findOne({
      $and: [
        { _id: invoiceId },
        { invoiceNumber: invoiceNumber },
        { invoiceDate: invoiceDate },
        { customerName: customerName },
        { customerAddress: customerAddress },
        { itemName: itemName },
        { quantity: quantity },
        { price: price },
      ],
    });

    if (existing && !currentInvoice) {
      return {
        status: 409,
        message: "Invoice already exists with the same details",
      };
    } else {
      const InvoiceUpdate = await InvoiceCreation.findByIdAndUpdate(
        invoiceId,
        {
          invoiceNumber,
          invoiceDate,
          customerName,
          customerAddress,
          itemName,
          quantity,
          price,
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    return {
      status: 201,
      message: "Invoice Edited Successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log("An error occured at editing Invoice", error.message);
    res.status(500).json({
      info: "An error occured in editing Invoice services",
    });
  }
};

invoiceCreationService.removeInvoiceCreation = async (invoiceId) => {
  try {
    const invoiceCreation = await InvoiceCreation.findByIdAndDelete(invoiceId);

    if (!invoiceCreation) {
      return {
        status: 201,
        message:
          "Invoice not found or can't able to delete right now,Please try again later",
        token: "sampleToken",
      };
    }

    return {
      status: 201,
      message: "Invoice deleted successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log("An error occured at Invoice remove", error.message);
    res.status(500).json({
      info: "An error occured in Invoice remove in current stock services",
    });
  }
};

module.exports = invoiceCreationService;
