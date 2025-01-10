let invoiceCreationService = {};
const InvoiceCreation = require("../../models/invoiceCreation");
const FinishedGoods = require("../../models/finishedGoods");
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;

invoiceCreationService.fetchInvoiceCreations = async () => {
  try {
    const data = await InvoiceCreation.find({})
const itemNames = await FinishedGoods.distinct('finishedGoodsName')
    return {
      status: 200,
      data: data,
      itemNames:itemNames
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
      customerId,
      invoiceDate,
      customerName,
      customerAddress,
      itemName,
      quantity,
      price,
      invoicePreparedBy
    } = invoiceData;

    const existingInvoiceNumber = await InvoiceCreation.findOne({
      $or: [
        { invoiceNumber},
        { customerId },
      ],
    });
    
    if (existingInvoiceNumber) {
      if (existingInvoiceNumber.invoiceNumber === invoiceNumber) {
        return {
          status: 409,
          message: "Invoice Number already exists",
        };
      }
      if (existingInvoiceNumber.customerId === customerId) {
        return {
          status: 409,
          message: "Customer ID already has an existing invoice",
        };
      }
    }
    const existingInvoice = await InvoiceCreation.findOne({
      $and: [
        { invoiceNumber: invoiceNumber },
        { customerId: customerId },
        { invoiceDate: invoiceDate },
        { customerName: customerName },
        { customerAddress: customerAddress },
        { itemName: itemName },
        { quantity: quantity },
        { price: price },
        { invoicePreparedBy: invoicePreparedBy },
      ],
    });

    if (existingInvoice) {
      return {
        status: 409,
        message: "Invoice already exists with the same details",
      };
    }

    let assignedCustomerId = customerId;

    if (!customerId) {

      const lastOrder = await InvoiceCreation.findOne()
        .sort({ createdAt: -1 }) 
        .select("customerId");

      if (lastOrder && lastOrder.customerId) {
        const lastNumber = parseInt(lastOrder.customerId.match(/\d+$/), 10);
        assignedCustomerId = `FRN/CID/-${(lastNumber || 0) + 1}`;
      } else {
        assignedCustomerId = "FRN/CID/1";
      }
    }

    let assignedInvoiceNumber = invoiceNumber;

    if (!invoiceNumber) {

      const lastOrder = await InvoiceCreation.findOne()
        .sort({ createdAt: -1 }) 
        .select("invoiceNumber");

      if (lastOrder && lastOrder.invoiceNumber) {
        const lastNumber = parseInt(lastOrder.invoiceNumber.match(/\d+$/), 10);
        assignedInvoiceNumber = `FRN/IV/-${(lastNumber || 0) + 1}`;
      } else {
        assignedInvoiceNumber = "FRN/IV/1";
      }
    }
    const newInvoice = new InvoiceCreation({
      invoiceNumber:assignedInvoiceNumber,
      customerId:assignedCustomerId,
      invoiceDate,
      customerName,
      customerAddress,
      itemName,
      quantity,
      price,
      invoicePreparedBy
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
      customerId,
      invoiceDate,
      customerName,
      customerAddress,
      itemName,
      quantity,
      price,
      invoicePreparedBy
    } = invoiceData;

    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }
    const existingInvoiceNumber = await InvoiceCreation.findOne({
      $or: [
        { invoiceNumber, _id: { $ne: invoiceId } },
        { customerId, _id: { $ne: invoiceId } },
      ],
    });
    
    if (existingInvoiceNumber) {
      if (existingInvoiceNumber.invoiceNumber === invoiceNumber) {
        return {
          status: 409,
          message: "Invoice Number already exists",
        };
      }
      if (existingInvoiceNumber.customerId === customerId) {
        return {
          status: 409,
          message: "Customer ID already has an existing invoice",
        };
      }
    }
    const existing = await InvoiceCreation.findOne({
      $and: [
        { invoiceNumber: invoiceNumber },
        { customerId: customerId },
        { invoiceDate: invoiceDate },
        { customerName: customerName },
        { customerAddress: customerAddress },
        { itemName: itemName },
        { quantity: quantity },
        { price: price },
        { invoicePreparedBy: invoicePreparedBy },
      ],
    });

    const currentInvoice = await InvoiceCreation.findOne({
      $and: [
        { _id: invoiceId },
        { invoiceNumber: invoiceNumber },
        { customerId: customerId },
        { invoiceDate: invoiceDate },
        { customerName: customerName },
        { customerAddress: customerAddress },
        { itemName: itemName },
        { quantity: quantity },
        { price: price },
        { invoicePreparedBy: invoicePreparedBy },
      ],
    });

    let assignedCustomerId = customerId;

    if (!customerId) {

      const lastOrder = await InvoiceCreation.findOne()
        .sort({ createdAt: -1 }) 
        .select("customerId");

      if (lastOrder && lastOrder.customerId) {
        const lastNumber = parseInt(lastOrder.customerId.match(/\d+$/), 10);
        assignedCustomerId = `FRN/CID/-${(lastNumber || 0) + 1}`;
      } else {
        assignedCustomerId = "FRN/CID/1";
      }
    }

    let assignedInvoiceNumber = invoiceNumber;

    if (!invoiceNumber) {

      const lastOrder = await InvoiceCreation.findOne()
        .sort({ createdAt: -1 }) 
        .select("invoiceNumber");

      if (lastOrder && lastOrder.invoiceNumber) {
        const lastNumber = parseInt(lastOrder.invoiceNumber.match(/\d+$/), 10);
        assignedInvoiceNumber = `FRN/IV/-${(lastNumber || 0) + 1}`;
      } else {
        assignedInvoiceNumber = "FRN/IV/1";
      }
    }
    if (existing && !currentInvoice) {
      return {
        status: 409,
        message: "Invoice already exists with the same details",
      };
    } else {
      const InvoiceUpdate = await InvoiceCreation.findByIdAndUpdate(
        invoiceId,
        {
          invoiceNumber:assignedInvoiceNumber,
          invoiceDate,
          customerId:assignedCustomerId,
          customerName,
          customerAddress,
          itemName,
          quantity,
          price,
          invoicePreparedBy
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
