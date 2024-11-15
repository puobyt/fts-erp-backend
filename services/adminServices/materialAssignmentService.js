const MaterialAssignment = require("../../models/materialAssignment");
const PurchaseOrderCreation = require("../../models/purchaseOrderCreation");
const FinishedGoods = require('../../models/finishedGoods')
let materialAssignmentService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;

materialAssignmentService.fetchMaterialAssignment = async () => {
  try {
    const data = await MaterialAssignment.find({}).sort({ createdAt: -1 });

    const products = await PurchaseOrderCreation.distinct('productName');
    const finishedGoods = await FinishedGoods.distinct('finishedGoodsName');
    return {
      status: 200,
      data: data,
      products:products,
      finishedGoods:finishedGoods
    };
  } catch (error) {
    console.log(
      "An error occured at fetching Material Assignment in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in fetching Material Assignment in admin services",
    });
  }
};
materialAssignmentService.newMaterialAssignment = async (materialData) => {
  try {
    const {
      assignmentNumber,
      batchNumber,
      processOrderNumber,
      materialName,
      assignedQuantity,
      assignedTo,
    } = materialData;

    const existing = await MaterialAssignment.findOne({
      $and: [
        { assignmentNumber: assignmentNumber },
        { batchNumber: batchNumber },
        { processOrderNumber: processOrderNumber },
        { materialName: materialName },
        { assignedQuantity: assignedQuantity },
        { assignedTo: assignedTo },
        { batchNumber: batchNumber },
      ],
    });

    if (existing) {
      return {
        status: 409,
        message: " Material Assignment already exists with the same details",
      };
    }

    const newData = new MaterialAssignment({
      assignmentNumber,
      batchNumber,
      processOrderNumber,
      materialName,
      assignedQuantity,
      assignedTo,
    });

    await newData.save();
    return {
      status: 201,
      message: "New Material Assignment added successfully",
      data: newData,
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at adding new Material Assignment in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in adding new Material Assignment in admin services",
    });
  }
};

materialAssignmentService.editMaterialAssignment = async (
  materialAssignmentData
) => {
  try {
    const {
      authPassword,
      materialAssignmentId,
      assignmentNumber,
      batchNumber,
      processOrderNumber,
      materialName,
      assignedQuantity,
      assignedTo,
    } = materialAssignmentData;

    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }

    const existing = await MaterialAssignment.findOne({
      $and: [
        { assignmentNumber: assignmentNumber },
        { batchNumber: batchNumber },
        { processOrderNumber: processOrderNumber },
        { materialName: materialName },
        { assignedQuantity: assignedQuantity },
        { assignedTo: assignedTo },
        { batchNumber: batchNumber },
      ],
    });

    const materialAssignmentCurrent = await MaterialAssignment.findOne({
      $and: [
        { _id: materialAssignmentId },
        { assignmentNumber: assignmentNumber },
        { batchNumber: batchNumber },
        { processOrderNumber: processOrderNumber },
        { materialName: materialName },
        { assignedQuantity: assignedQuantity },
        { assignedTo: assignedTo },
        { batchNumber: batchNumber },
      ],
    });

    if (existing && !materialAssignmentCurrent) {
      return {
        status: 409,
        message:
          "Material assignment current already exists with the same details",
      };
    } else {
      const materialAssignmentUpdate =
        await MaterialAssignment.findByIdAndUpdate(
          materialAssignmentId,
          {
            assignmentNumber,
            batchNumber,
            processOrderNumber,
            materialName,
            assignedQuantity,
            assignedTo,
          },
          {
            new: true,
            runValidators: true,
          }
        );
    }

    return {
      status: 201,
      message: "Material Assignment Edited Successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at editing Material Assignment in services",
      error.message
    );
    res.status(500).json({
      info: "An error occured in Material Assignment services",
    });
  }
};

materialAssignmentService.removeMaterialAssignment = async (
  materialAssignmentId
) => {
  try {
    const materialAssignment = await MaterialAssignment.findByIdAndDelete(
      materialAssignmentId
    );

    if (!materialAssignment) {
      return {
        status: 201,
        message:
          "Material assignment not found or can't able to delete right now,Please try again later",
        token: "sampleToken",
      };
    }
    return {
      status: 201,
      message: "Material assignment deleted successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at material asssignment remove",
      error.message
    );
    res.status(500).json({
      info: "An error occured in material asssignment remove in gate entry services",
    });
  }
};

module.exports = materialAssignmentService;
