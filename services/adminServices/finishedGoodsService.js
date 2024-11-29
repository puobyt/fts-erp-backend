const FinishedGoods = require("../../models/finishedGoods");
const ProductionOrderCreation = require("../../models/productionOrderCreation");
const BillOfMaterials = require("../../models/billOfMaterials");
const MainStock = require("../../models/mainStock");
const PurchaseOrderCreation = require("../../models/purchaseOrderCreation");
const ProcessOrder = require("../../models/processOrder");
const ProductionOrderCreationOutput = require("../../models/productionOrderCreationOutput");
let finishedGoodsService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;
finishedGoodsService.fetchFinishedGoods = async () => {
  try {
    const data = await FinishedGoods.find({})

    return {
      status: 200,
      data: data,
    };
  } catch (error) {
    console.log(
      "An error occured at fetching Finished Goods in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in fetching Finished Goods in admin services",
    });
  }
};

finishedGoodsService.newFinishedGoods = async (finishedGoodsData) => {
  try {
    const { finishedGoodsName, batchNumber, productionDate, quantityProduced } =
      finishedGoodsData;

    const existing = await FinishedGoods.findOne({
      $and: [
        { finishedGoodsName: finishedGoodsName },
        { batchNumber: batchNumber },
        { productionDate: productionDate },
        { quantityProduced: quantityProduced },
      ],
    });

    if (existing) {
      return {
        status: 409,
        message: "Finished Goods already exists with the same details",
      };
    }
    const productionOrderCreation = await ProductionOrderCreation.findOne({
      productName: finishedGoodsName,
    });
    if (!productionOrderCreation) {
      return {
        status: 409,
        message: "Product Not Found In Production Order Creation",
      };
    }
    
    const billOfMaterials = await BillOfMaterials.findOne({
      productName: finishedGoodsName,
    });
    if (!billOfMaterials) {
      return {
        status: 409,
        message: "Product Not Found In Bill Of Materials",
      };
    }
    
    const { materials } = billOfMaterials;
    
    const enrichedMaterials = [];
    
    for (const material of materials) {
      const { materialsList, quantity,materialCode } = material;
    
      const mainStockData = await MainStock.findOne({ materialName: materialsList });
      if (!mainStockData) {
        return {
          status: 409,
          message: `Batch not found for material: ${materialsList}`,
        };
      }
    
      const vendorData = await PurchaseOrderCreation.findOne({ materialName: materialsList });
      if (!vendorData) {
        return {
          status: 409,
          message: `Vendor not found for material: ${materialsList}`,
        };
      }
    
      enrichedMaterials.push({
        materialsList,
        quantity,
        materialCode,
        batchNumber: mainStockData.batchNumber,
        vendorId: vendorData.vendorId,
      });
    }
    const processOrder = await ProcessOrder.findOne({productName:finishedGoodsName});
    if(!processOrder){
      return {
        status: 409,
        message: `product Name not found in process Order`,
      };
    }
const productionOrderCreationOutput = await ProductionOrderCreationOutput.findOne({productName:finishedGoodsName})
if(!productionOrderCreationOutput){
  return {
    status: 409,
    message: `product Name not found in production Order Creation Output`,
  };
}
    const newFinishedGoods = new FinishedGoods({
      finishedGoodsName,
      batchNumber,
      productionDate,
      plant: productionOrderCreation.plant,
      materials: enrichedMaterials,
      processOrderNo:processOrder.processOrderNumber,
      description:processOrder.description,
      storageLocation:productionOrderCreationOutput.storageLocationforOutput,
      quantityProduced,
    });
    
    await newFinishedGoods.save();
    return {
      status: 201,
      message: "New Finished Goods added successfully",
      data: newFinishedGoods,
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at adding new Finished Goods in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in adding  Finished Goods in admin services",
    });
  }
};

finishedGoodsService.editFinishedGoods = async (finishedGoodsData) => {
  try {
    const {
      authPassword,
      finishedGoodsId,
      finishedGoodsName,
      batchNumber,
      productionDate,
      quantityProduced,
    } = finishedGoodsData;

    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }

    const existing = await FinishedGoods.findOne({
      $and: [
        { finishedGoodsName: finishedGoodsName },
        { batchNumber: batchNumber },
        { productionDate: productionDate },
        { quantityProduced: quantityProduced },
      ],
    });

    const currentFinishedGoods = await FinishedGoods.findOne({
      $and: [
        { _id: finishedGoodsId },
        { finishedGoodsName: finishedGoodsName },
        { batchNumber: batchNumber },
        { productionDate: productionDate },
        { quantityProduced: quantityProduced },
      ],
    });

    if (existing && !currentFinishedGoods) {
      return {
        status: 409,
        message: "Finished Goods already exists with the same details",
      };
    } 

    const productionOrderCreation = await ProductionOrderCreation.findOne({productName:finishedGoodsName});
if(!productionOrderCreation){
  return {
    status: 409,
    message: "Product Not Found In Production Order Creation",
  };
}

const billOfMaterials = await BillOfMaterials.findOne({productName:finishedGoodsName});
if(!billOfMaterials){
  return {
    status: 409,
    message: "Product Not Found In Bill Of Materials",
  };
}
      const FinishedGoodsUpdate = await FinishedGoods.findByIdAndUpdate(
        finishedGoodsId,
        {
          finishedGoodsName,
          batchNumber,
          productionDate,
          plant:productionOrderCreation.plant,
          materials:billOfMaterials.materials,
          quantityProduced,
        },
        {
          new: true,
          runValidators: true,
        }
      );
    

    return {
      status: 201,
      message: "Finished Goods Edited Successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log("An error occured at editing finished goods", error.message);
    res.status(500).json({
      info: "An error occured in editing Finished Goods management services",
    });
  }
};



finishedGoodsService.removeFinishedGoods = async (
  finishedGoodsId
) => {
  try {
    const finishedGoods = await FinishedGoods.findByIdAndDelete(
      finishedGoodsId
    );

    if(!finishedGoods){
      return {
        status: 201,
        message: "Finished Goods not found or can't able to delete right now,Please try again later",
        token: "sampleToken",
      };
    }
    return {
      status: 201,
      message: "Finished Goods  deleted successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at Finished Goods remove",
      error.message
    );
    res
      .status(500)
      .json({
        info: "An error occured in Finished Goods  remove in Finished Goods  services",
      });
  }
};

module.exports = finishedGoodsService;
