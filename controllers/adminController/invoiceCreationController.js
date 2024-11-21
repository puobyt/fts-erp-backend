const invoiceCreationService = require("../../services/adminServices/invoiceCreationService");

let invoiceCreationController = {};

invoiceCreationController.fetchInvoiceCreations = async (req, res) => {
  try {
    console.log("loading invoices...");

    const result = await invoiceCreationService.fetchInvoiceCreations();

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: "",
    }); 

  } catch (error) {
    console.log(
      "An error occurred while fetching Invoice Creations in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};

invoiceCreationController.newInvoiceCreation = async (req, res) => {
  try {
    console.log("Adding new invoice");

    const {
      invoiceNumber,
      customerId,
      invoiceDate,
      customerName,
      customerAddress,
      itemName,
      quantity,
      price,
    } = req.body;

    // Pass the extracted data to the service function
    const result = await invoiceCreationService.newInvoiceCreation({
      invoiceNumber,
      customerId,
      invoiceDate,
      customerName,
      customerAddress,
      itemName,
      quantity,
      price,
    });

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while adding new invoice in invoice controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred" });
  }
};

invoiceCreationController.editInvoiceCreation = async (req, res) => {
  try {
    console.log("editing invoice..");

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
    } = req.body;

    const result = await invoiceCreationService.editInvoiceCreation({
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
    });

    res.status(result.status).json({
      message: result.message,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while adding editing Invoice Creation in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred" });
  }
};


invoiceCreationController.removeInvoiceCreation = async (req, res) => {
  try {
    console.log("deleting invoice...");
const {invoiceId} = req.query;

    const result = await invoiceCreationService.removeInvoiceCreation(invoiceId);

    res.status(result.status).json({
      message: result.message,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while removing Invoice Creation in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};
module.exports = invoiceCreationController;
