const BillOfMaterials = require("../../models/billOfMaterials");
const PurchaseOrderCreation = require("../../models/purchaseOrderCreation");
const ProductionOrderCreationOutput = require("../../models/productionOrderCreationOutput");
const MainStock = require("../../models/mainStock");
let billOfMaterialsService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS || 'admin@123';

billOfMaterialsService.fetchbillOfMaterials = async () => {
  try {
    const data = await BillOfMaterials.find({})
    const productNames = await ProductionOrderCreationOutput.distinct('productName');
    const materials = await MainStock.distinct("materialName");
    return {
      status: 200,
      data: data,
      productNames:productNames,
      materials:materials
    };
  } catch (error) {
    console.log(
      "An error occured at fetching bill Of Materials in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in fetching bill Of Materials in admin services",
    });
  }
};
billOfMaterialsService.newBillOfMaterials = async (bomData) => {
  try {
    const { bomNumber, productName, materials } = bomData;

    if (!Array.isArray(materials) || materials.length === 0) {
      return {
        status: 400,
        message: "Materials list is required.",
      };
    }

    const existing = await BillOfMaterials.findOne({
      $and: [
        { bomNumber: bomNumber },
        { productName: productName },
        { materials : materials  },
      ],
    });

    if (existing) {
      return {
        status: 409,
        message: " Bill of materials already exists with the same details",
      };
    }
    let assignedBomNUmber = bomNumber;

    if (!bomNumber) {

      const lastOrder = await BillOfMaterials.findOne()
        .sort({ createdAt: -1 }) 
        .select("processOrder");

      if (lastOrder && lastOrder.bomNumber) {
        const lastNumber = parseInt(lastOrder.bomNumber.match(/\d+$/), 10);
        assignedBomNUmber = `FRN/BOM/${(lastNumber || 0) + 1}`;
      } else {
        assignedBomNUmber = "FRN/BOM/1";
      }
    }

    const newData = new BillOfMaterials({
      bomNumber:assignedBomNUmber,
      productName,
      materials 
    });

    await newData.save();
    return {
      status: 201,
      message: "New Bill of materials added successfully",
      data: newData,
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at adding new Bill Of Materials in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in adding Bill Of Materials in admin services",
    });
  }
};

billOfMaterialsService.editBillOfMaterials = async (billOfMaterialsData) => {
  try {
    const {
      authPassword,
      billOfMaterialsId,
      bomNumber,
      productName,
      materials
    } = billOfMaterialsData;

    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }
    const existing = await BillOfMaterials.findOne({
      $and: [
        { bomNumber: bomNumber },
        { productName: productName },
        { materials: materials },
       
      ],
    });

    const currentBillOfMaterials = await BillOfMaterials.findOne({
      $and: [
        { _id: billOfMaterialsId },
        { bomNumber: bomNumber },
        { productName: productName },
        { materials: materials },
        
      ],
    });
    let assignedBomNUmber = bomNumber;

    if (!bomNumber) {

      const lastOrder = await BillOfMaterials.findOne()
        .sort({ createdAt: -1 }) 
        .select("processOrder");

      if (lastOrder && lastOrder.bomNumber) {
        const lastNumber = parseInt(lastOrder.bomNumber.match(/\d+$/), 10);
        assignedBomNUmber = `FRN/BOM/${(lastNumber || 0) + 1}`;
      } else {
        assignedBomNUmber = "FRN/BOM/1";
      }
    }
    if (existing && !currentBillOfMaterials) {
      return {
        status: 409,
        message: "Bill Of Materials already exists with the same details",
      };
    } else {
      const BillOfMaterialsUpdate = await BillOfMaterials.findByIdAndUpdate(
        billOfMaterialsId,
        {

          bomNumber:assignedBomNUmber,
          productName,
          materials
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    return {
      status: 201,
      message: "Bill of materials edited Successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at editing BillOfMaterialsUpdate",
      error.message
    );
    res.status(500).json({
      info: "An error occured in editing Bill Of Materials services",
    });
  }
};

billOfMaterialsService.removeBillOfMaterials = async (
  billOfMaterialsId
) => {
  try {
    const billOfMaterials = await BillOfMaterials.findByIdAndDelete(
      billOfMaterialsId
    );

    if(!billOfMaterials){
      return {
        status: 201,
        message: "Bill of materials not found or can't able to delete right now,Please try again later",
        token: "sampleToken",
      };
    }
    return {
      status: 201,
      message: "Bill of materials deleted successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at bill of materials remove",
      error.message
    );
    res
      .status(500)
      .json({
        info: "An error occured in bill of materials remove in gate entry services",
      });
  }
};

module.exports = billOfMaterialsService;
