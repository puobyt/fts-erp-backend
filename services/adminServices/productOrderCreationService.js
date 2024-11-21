const ProductionOrderCreation = require("../../models/productionOrderCreation");
const PurchaseOrderCreation = require("../../models/purchaseOrderCreation");
const ProductionOrderCreationOutput = require("../../models/productionOrderCreationOutput");
const CurrentStock = require("../../models/currentStock");
const MainStock = require("../../models/mainStock");
let productOrderCreationService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;

productOrderCreationService.fetchProductOrderCreation = async () => {
  try {
    const data = await ProductionOrderCreation.find({})
const materials = await MainStock.distinct('materialName')
console.log('materials in just',materials);
    return {
      status: 200,
      data: data,
      materials:materials
    };



  } catch (error) {
    console.log(
      "An error occured at fetching Production Order Creation in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in fetching Production Order Creation in admin services",
    });
  }
};

productOrderCreationService.fetchProductOrderCreationOutput = async () => {
  try {
    const data = await ProductionOrderCreationOutput.find({}).sort({
      createdAt: -1,
    });
    const batches = await ProductionOrderCreation.distinct("batch");
    const products = await ProductionOrderCreation.distinct("productName");
    return {
      status: 200,
      data: data,
      batches: batches,
      products:products
    };
  } catch (error) {
    console.log(
      "An error occured at fetching Production Order outputs Creation in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in fetching Production Order reation Outputs in admin services",
    });
  }
};
productOrderCreationService.newProductionOrderCreation = async (
  productionOrderData
) => {
  try {
    const {
      processOrder,
      plant,
      materialName,
      productName,
      productDescription,
      batch,
      requiredQuantity,
      instructions,
      startDate,
      endDate,
    } = productionOrderData;

    const existing = await ProductionOrderCreation.findOne({
      $and: [
        { processOrder: processOrder },
        { plant: plant },
        { materialName: materialName },
        { productName: productName },
        { productDescription: productDescription },
        { batch: batch },
        { requiredQuantity: requiredQuantity },
        { instructions: instructions },
        { startDate: startDate },
        { endDate: endDate },
      ],
    });

    if (existing) {
      return {
        status: 409,
        message: "Production Order already exists with the same details",
      };
    }
    let assignedProcessOrder = processOrder;

    if (!processOrder) {

      const lastOrder = await ProductionOrderCreation.findOne()
        .sort({ createdAt: -1 }) 
        .select("processOrder");

      if (lastOrder && lastOrder.processOrder) {
        const lastNumber = parseInt(lastOrder.processOrder.match(/\d+$/), 10);
        assignedProcessOrder = `FRN/PO/${(lastNumber || 0) + 1}`;
      } else {
        assignedProcessOrder = "FRN/PO/1";
      }
    }

    let assignedBatch = batch;

    if (!batch) {

      const lastOrder = await ProductionOrderCreation.findOne()
        .sort({ createdAt: -1 }) 
        .select("batch");

      if (lastOrder && lastOrder.batch) {
        const lastNumber = parseInt(lastOrder.batch.match(/\d+$/), 10);
        assignedBatch = `FRN/FG/${(lastNumber || 0) + 1}`;
      } else {
        assignedBatch = "FRN/FG/1";
      }
    }
    
    const newData = new ProductionOrderCreation({
      processOrder:assignedProcessOrder,
      plant,
      materialName,
      productName,
      productDescription,
      batch:assignedBatch,
      requiredQuantity,
      instructions,
      startDate,
      endDate,
    });

    await newData.save();
    return {
      status: 201,
      message: " New production order added successfully",
      data: newData,
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at adding production order in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in adding production order in admin services",
    });
  }
};

productOrderCreationService.newProductionOrderCreationOutput = async (
  productionOrderData
) => {
  try {
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
    } = productionOrderData;

    const existing = await ProductionOrderCreationOutput.findOne({
      $and: [
        { productName: productName },
        { producedQuantity: producedQuantity },
        { productionCompletionDate: productionCompletionDate },
        // { qualityCheckStatus: qualityCheckStatus },
        { storageLocationforOutput: storageLocationforOutput },
        { batchNumberforOutput: batchNumberforOutput },
        { productionNotes: productionNotes },
        { Yield: Yield },
        { outputQualityRating: outputQualityRating },
        { outputHandlingInstructions: outputHandlingInstructions },
      ],
    });

    if (existing) {
      return {
        status: 409,
        message: "Production Order Output already exists with the same details",
      };
    }
    let assignedBatchNumber= batchNumberforOutput;

    if (!batchNumberforOutput) {

      const lastOrder = await PurchaseOrderCreation.findOne()
        .sort({ createdAt: -1 }) 
        .select("batchNumberforOutput");

        if (lastOrder && lastOrder.batchNumberforOutput) {
  
          const lastNumber = parseInt(lastOrder.batchNumberforOutput.match(/\d+$/), 10);
          const nextNumber = String((lastNumber || 0) + 1).padStart(3, "0");
          assignedBatchNumber = `FRN/BNO/${nextNumber}`;
        } else {
          assignedBatchNumber = "FRN/BNO/1";
        }
    }
    const newData = new ProductionOrderCreationOutput({
      productName,
      producedQuantity,
      productionCompletionDate,
      // qualityCheckStatus,
      storageLocationforOutput,
      batchNumberforOutput:assignedBatchNumber,
      productionNotes,
      Yield,
      outputQualityRating,
      outputHandlingInstructions,
    });

    await newData.save();
    return {
      status: 201,
      message: " New production order output added successfully",
      data: newData,
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at adding production order output in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in adding production order output in admin services",
    });
  }
};

productOrderCreationService.editProductionOrderCreation = async (
  productionOrderData
) => {
  try {
    const {
      authPassword,
      productionOrderId,
      processOrder,
      plant,
      materialName,
      productName,
      productDescription,
      batch,
      requiredQuantity,
      instructions,
      startDate,
      endDate,
    } = productionOrderData;

    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }

    const existing = await ProductionOrderCreation.findOne({
      $and: [
        { processOrder: processOrder },
        { plant: plant },
        { materialName: materialName },
        { productName: productName },
        { productDescription: productDescription },
        { batch: batch },
        { requiredQuantity: requiredQuantity },
        { instructions: instructions },
        { startDate: startDate },
        { endDate: endDate },
      ],
    });

    const currentProductionOrder = await ProductionOrderCreation.findOne({
      $and: [
        { _id: productionOrderId },
        { processOrder: processOrder },
        { plant: plant },
        { materialName: materialName },
        { productName: productName },
        { productDescription: productDescription },
        { batch: batch },
        { requiredQuantity: requiredQuantity },
        { instructions: instructions },
        { startDate: startDate },
        { endDate: endDate },
      ],
    });
    let assignedProcessOrder = processOrder;

    if (!processOrder) {

      const lastOrder = await ProductionOrderCreation.findOne()
        .sort({ createdAt: -1 }) 
        .select("processOrder");

      if (lastOrder && lastOrder.processOrder) {
        const lastNumber = parseInt(lastOrder.processOrder.match(/\d+$/), 10);
        assignedProcessOrder = `PO-${(lastNumber || 0) + 1}`;
      } else {
        assignedProcessOrder = "PO-1";
      }
    }
    let assignedBatch = batch;

    if (!batch) {

      const lastOrder = await ProductionOrderCreation.findOne()
        .sort({ createdAt: -1 }) 
        .select("batch");

      if (lastOrder && lastOrder.batch) {
        const lastNumber = parseInt(lastOrder.batch.match(/\d+$/), 10);
        assignedBatch = `FRN/Btch/${(lastNumber || 0) + 1}`;
      } else {
        assignedBatch = "FRN/Btch/1";
      }
    }
    if (existing && !currentProductionOrder) {
      return {
        status: 409,
        message: "Production order already exists with the same details",
      };
    } else {
      const ProductionOrderUpdate =
        await ProductionOrderCreation.findByIdAndUpdate(
          productionOrderId,
          {
            processOrder:assignedProcessOrder,
            plant,
            materialName,
            productName,
            productDescription,
            batch:assignedBatch,
            requiredQuantity,
            instructions,
            startDate,
            endDate,
          },
          {
            new: true,
            runValidators: true,
          }
        );
    }

    return {
      status: 201,
      message: "Production Order  Edited Successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log("An error occured at editing Production Order ", error.message);
    res.status(500).json({
      info: "An error occured in editing Production Order  services",
    });
  }
};

productOrderCreationService.editProductionOrderCreationOutput = async (
  productionOrderData
) => {
  try {
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
    } = productionOrderData;

    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }

    const existing = await ProductionOrderCreationOutput.findOne({
      $and: [
        { productName: productName },
        { producedQuantity: producedQuantity },
        { productionCompletionDate: productionCompletionDate },
        // { qualityCheckStatus: qualityCheckStatus },
        { storageLocationforOutput: storageLocationforOutput },
        { batchNumberforOutput: batchNumberforOutput },
        { productionNotes: productionNotes },
        { Yield: Yield },
        { outputQualityRating: outputQualityRating },
        { outputHandlingInstructions: outputHandlingInstructions },
      ],
    });

    const currentProductionOrderOutput =
      await ProductionOrderCreationOutput.findOne({
        $and: [
          { _id: productionOrderoutputId },
          { productName: productName },
          { producedQuantity: producedQuantity },
          { productionCompletionDate: productionCompletionDate },
          // { qualityCheckStatus: qualityCheckStatus },
          { storageLocationforOutput: storageLocationforOutput },
          { batchNumberforOutput: batchNumberforOutput },
          { productionNotes: productionNotes },
          { Yield: Yield },
          { outputQualityRating: outputQualityRating },
          { outputHandlingInstructions: outputHandlingInstructions },
        ],
      });
      let assignedBatchNumber= batchNumberforOutput;

      if (!batchNumberforOutput) {
  
        const lastOrder = await PurchaseOrderCreation.findOne()
          .sort({ createdAt: -1 }) 
          .select("batchNumberforOutput");
  
          if (lastOrder && lastOrder.batchNumberforOutput) {
    
            const lastNumber = parseInt(lastOrder.batchNumberforOutput.match(/\d+$/), 10);
            const nextNumber = String((lastNumber || 0) + 1).padStart(3, "0");
            assignedBatchNumber = `FN${nextNumber}`;
          } else {
            assignedBatchNumber = "FN001";
          }
      }
    if (existing && !currentProductionOrderOutput) {
      return {
        status: 409,
        message: "Production order output already exists with the same details",
      };
    } else {
      const ProductionOrderOutputUpdate =
        await ProductionOrderCreationOutput.findByIdAndUpdate(
          productionOrderoutputId,
          {
            productName,
            producedQuantity,
            productionCompletionDate,
            // qualityCheckStatus,
            storageLocationforOutput,
            batchNumberforOutput:assignedBatchNumber,
            productionNotes,
            Yield,
            outputQualityRating,
            outputHandlingInstructions,
          },
          {
            new: true,
            runValidators: true,
          }
        );
    }

    return {
      status: 201,
      message: "Production Order output  Edited Successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at editing Production Order output ",
      error.message
    );
    res.status(500).json({
      info: "An error occured in editing Production Order output  services",
    });
  }
};
productOrderCreationService.removeProductionOrderCreation = async (
  productionOrderId
) => {
  try {
    const productionOrderCreation =
      await ProductionOrderCreation.findByIdAndDelete(productionOrderId);

    if (!productionOrderCreation) {
      return {
        status: 201,
        message:
          "production order creation not found or can't able to delete right now,Please try again later",
        token: "sampleToken",
      };
    }
    if (productionOrderCreation) {
      return {
        status: 201,
        message: "production order creation deleted successfully",
        token: "sampleToken",
      };
    }
  } catch (error) {
    console.log(
      "An error occured at production order creation remove",
      error.message
    );
    res.status(500).json({
      info: "An error occured in productio order creation remove in current stock services",
    });
  }
};

productOrderCreationService.removeProductionOrderCreationOutput = async (
  productionOrderoutputId
) => {
  try {
    const productionOrderCreationOutput =
      await ProductionOrderCreationOutput.findByIdAndDelete(
        productionOrderoutputId
      );

    if (!productionOrderCreationOutput) {
      return {
        status: 201,
        message:
          "production order creation output not found or can't able to delete right now,Please try again later",
        token: "sampleToken",
      };
    }

    return {
      status: 201,
      message: "production order output creation deleted successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at production order creation output remove",
      error.message
    );
    res.status(500).json({
      info: "An error occured in productio order creation output remove in current stock services",
    });
  }
};

module.exports = productOrderCreationService;
