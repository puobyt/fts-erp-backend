const PurchaseOrderCreation = require("../../models/purchaseOrderCreation");
const RequestCreationForMaterials = require("../../models/requestCreationForMaterials");
const FinishedGoods = require("../../models/finishedGoods");
const VendorManagement = require("../../models/vendorManagement");
const CurrentStock = require("../../models/currentStock");
let requestCreationMaterialService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;

requestCreationMaterialService.fetchRequestCreationForMaterials = async () => {
  try {
    const data = await RequestCreationForMaterials.find({});
    const materials = await CurrentStock.aggregate([
      {
        $group: {
          _id: "$materialName",
          batchNumber: { $first: "$batchNumber" }, // Use $first instead of $addToSet
        },
      },
      {
        $project: {
          materialName: "$_id",
          batchNumber: 1,
          _id: 0,
        },
      },
    ]);
    const finishedGoods = await FinishedGoods.distinct("finishedGoodsName");

    return {
      status: 200,
      data: data,
      materials: materials,
      finishedGoods: finishedGoods,
    };
  } catch (error) {
    console.log(
      "An error occured at fetching Request Creation For Materials in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in fetching Request Creation For Materials in admin services",
    });
  }
};
requestCreationMaterialService.newRequestCreationForMaterials = async (
  requestCreationData
) => {
  try {
    const { requestNumber, batchNumber, materialName, quantity, requiredDate } =
      requestCreationData;

    const existing = await RequestCreationForMaterials.findOne({
      $and: [
        { requestNumber: requestNumber },
        { materialName: materialName },
        { quantity: quantity },
        { requiredDate: requiredDate },
        { batchNumber: batchNumber },
      ],
    });

    if (existing) {
      return {
        status: 409,
        message:
          "Request Creation For Materials already exists with the same details",
      };
    }

    const newData = new RequestCreationForMaterials({
      requestNumber,
      batchNumber,
      materialName,
      quantity,
      requiredDate,
    });

    await newData.save();
    return {
      status: 201,
      message: "New Request Creation For Materials added successfully",
      data: newData,
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at adding Request Creation For Materials in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in adding Request Creatio nFor Materials in admin services",
    });
  }
};

requestCreationMaterialService.editRequestCreationForMaterials = async (
  requestCreationData
) => {
  try {
    const {
      authPassword,
      requestMaterialsId,
      requestNumber,
      batchNumber,
      materialName,
      quantity,
      requiredDate,
    } = requestCreationData;
    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }
    const existing = await RequestCreationForMaterials.findOne({
      $and: [
        { requestNumber: requestNumber },
        { materialName: materialName },
        { quantity: quantity },
        { requiredDate: requiredDate },
        { batchNumber: batchNumber },
      ],
    });
    const currentRequestMaterialsOrder =
      await RequestCreationForMaterials.findOne({
        $and: [
          { _id: requestMaterialsId },
          { requestNumber: requestNumber },
          { materialName: materialName },
          { quantity: quantity },
          { requiredDate: requiredDate },
          { batchNumber: batchNumber },
        ],
      });
    if (existing && !currentRequestMaterialsOrder) {
      return {
        status: 409,
        message:
          " Request Materials Order already exists with the same details",
      };
    } else {
      const requestMaterialsUpdate =
        await RequestCreationForMaterials.findByIdAndUpdate(
          requestMaterialsId,
          {
            requestNumber,
            batchNumber,
            materialName,
            quantity,
            requiredDate,
          },
          {
            new: true,
            runValidators: true,
          }
        );
    }

    return {
      status: 201,
      message: "Request Materials Creation Order Edited Successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at editing Request Materials Order",
      error.message
    );
    res.status(500).json({
      info: "An error occured in editing Request Materials Order services",
    });
  }
};

requestCreationMaterialService.removeRequestCreationForMaterials = async (
  requestCreationId
) => {
  try {
    const requestCreationForMaterials =
      await RequestCreationForMaterials.findByIdAndDelete(requestCreationId);

    if (!requestCreationForMaterials) {
      return {
        status: 201,
        message:
          "Request creation for materials not found or can't able to delete right now,Please try again later",
        token: "sampleToken",
      };
    }
    if (requestCreationForMaterials) {
      return {
        status: 201,
        message: "Request creation for materials deleted successfully",
        token: "sampleToken",
      };
    }
  } catch (error) {
    console.log(
      "An error occured at request creation for materials remove",
      error.message
    );
    res.status(500).json({
      info: "An error occured in request creation for materials remove in current stock services",
    });
  }
};
module.exports = requestCreationMaterialService;
