const express = require("express");

const productOrderCreationService = require("../../services/adminServices/productOrderCreationService");

let productionOrderCreationController = {};

productionOrderCreationController.fetchProductOrderCreation = async (
  req,
  res
) => {
  try {
    console.log("loading product orders...");

    const result =
      await productOrderCreationService.fetchProductOrderCreation();

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      processOrderNumbers:result.processOrderNumbers,
      materials:result.materials,
      userToken: "",
    });
  } catch (error) {
    console.log(
      "An error occurred while fetching Product Order Creation in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};

productionOrderCreationController.fetchProductOrderCreationOutput = async (
  req,
  res
) => {
  try {
    console.log("loading product orders outputs...");

    const result =
      await productOrderCreationService.fetchProductOrderCreationOutput();

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      batches: result.batches,
      products:result.products,
      userToken: "",
    });
  } catch (error) {
    console.log(
      "An error occurred while fetching Product Order Creation in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};
productionOrderCreationController.newProductionOrderCreation = async (
  req,
  res
) => {
  try {
    console.log("Adding new production order creation ");

    const {
      processOrder,
      plant,
      productName,
      productDescription,
      batch,
      materials,
      instructions,
      startDate,
      endDate,
    } = req.body;

    const result = await productOrderCreationService.newProductionOrderCreation(
      {
        processOrder,
        plant,
        productName,
        productDescription,
        batch,
        materials,
        instructions,
        startDate,
        endDate,
      }
    );

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while adding quality checks in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in Server" });
  }
};

productionOrderCreationController.newProductionOrderCreationOutput = async (
  req,
  res
) => {
  try {
    console.log("Adding new production order creation ");

    const {
      productName,
      producedQuantity,
      productionCompletionDate,
      // qualityCheckStatus,
      storageLocationforOutput,
      batchNumberforOutput,
      productionNotes,
      Yield,
      outputQualityRating,
      outputHandlingInstructions,
    } = req.body;

    const result =
      await productOrderCreationService.newProductionOrderCreationOutput({
        productName,
        producedQuantity,
        productionCompletionDate,
        // qualityCheckStatus,
        storageLocationforOutput,
        batchNumberforOutput,
        productionNotes,
        Yield,
        outputQualityRating,
        outputHandlingInstructions,
      });

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while adding quality checks in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in Server" });
  }
};

productionOrderCreationController.editProductionOrderCreation = async (
  req,
  res
) => {
  try {
    console.log("editing production order creation..");

    const {
      authPassword,
      productionOrderId,
      processOrder,
      plant,
      productName,
      productDescription,
      storageLocation,
      batch,
      materials,
      instructions,
      startDate,
      endDate,
    } = req.body;

    const result =
      await productOrderCreationService.editProductionOrderCreation({
        authPassword,
        productionOrderId,
        processOrder,
        plant,
        productName,
        productDescription,
        storageLocation,
        batch,
        materials,
        instructions,
        startDate,
        endDate,
      });

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while editing production order creation in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred" });
  }
};

productionOrderCreationController.editProductionOrderCreationOutput = async (
  req,
  res
) => {
  try {
    console.log("editing production order creation..");

    const {
      authPassword,
      productionOrderoutputId,
      productName,
      producedQuantity,
      productionCompletionDate,
      // qualityCheckStatus,
      storageLocationforOutput,
      batchNumberforOutput,
      productionNotes,
      Yield,
      outputQualityRating,
      outputHandlingInstructions,
    } = req.body;

    const result =
      await productOrderCreationService.editProductionOrderCreationOutput({
        authPassword,
        productionOrderoutputId,
        productName,
        producedQuantity,
        productionCompletionDate,
        // qualityCheckStatus,
        storageLocationforOutput,
        batchNumberforOutput,
        productionNotes,
        Yield,
        outputQualityRating,
        outputHandlingInstructions,
      });

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while editing production order creation in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred" });
  }
};

productionOrderCreationController.removeProductionOrderCreation = async (
  req,
  res
) => {
  try {
    console.log("deleting production order creation...");
    const { productionOrderId } = req.query;
    // Pass the extracted data to the service function
    const result =
      await productOrderCreationService.removeProductionOrderCreation(
        productionOrderId
      );

    res.status(result.status).json({
      message: result.message,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while removing production order in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};


productionOrderCreationController.removeProductionOrderCreationOutput = async (
  req,
  res
) => {
  try {
    console.log("deleting production order creation output...");
    const { productionOrderoutputId } = req.query;
    // Pass the extracted data to the service function
    const result =
      await productOrderCreationService.removeProductionOrderCreationOutput(
        productionOrderoutputId
      );

    res.status(result.status).json({
      message: result.message,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while removing production order in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};
module.exports = productionOrderCreationController;
