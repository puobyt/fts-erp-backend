const BillOfMaterials = require("../../models/billOfMaterials");
const PurchaseOrderCreation = require("../../models/purchaseOrderCreation");
 
let billOfMaterialsService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;

billOfMaterialsService.fetchbillOfMaterials = async () => {
  try {
    const data = await BillOfMaterials.find({}).sort({ createdAt: -1 });
    const productNames = await PurchaseOrderCreation.distinct('productName');
    return {
      status: 200,
      data: data,
      productNames:productNames
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
    const { bomNumber, productName, materialsList } = bomData;

    const existing = await BillOfMaterials.findOne({
      $and: [
        { bomNumber: bomNumber },
        { productName: productName },
        { materialsList: materialsList },
      ],
    });

    if (existing) {
      return {
        status: 409,
        message: " Bill of materials already exists with the same details",
      };
    }

    const newData = new BillOfMaterials({
      bomNumber,
      productName,
      materialsList,
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
      materialsList,
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
        { materialsList: materialsList },
      ],
    });

    const currentBillOfMaterials = await BillOfMaterials.findOne({
      $and: [
        { _id: billOfMaterialsId },
        { bomNumber: bomNumber },
        { productName: productName },
        { materialsList: materialsList },
      ],
    });

    if (existing && !currentBillOfMaterials) {
      return {
        status: 409,
        message: "Bill Of Materials already exists with the same details",
      };
    } else {
      const BillOfMaterialsUpdate = await BillOfMaterials.findByIdAndUpdate(
        billOfMaterialsId,
        {

          bomNumber,
          productName,
          materialsList,
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
