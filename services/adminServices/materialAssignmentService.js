const MaterialAssignment = require("../../models/materialAssignment");
const PurchaseOrderCreation = require("../../models/purchaseOrderCreation");
const ProductionOrderCreation = require("../../models/productionOrderCreation");
const FinishedGoods = require("../../models/finishedGoods");
const VendorManagement = require("../../models/vendorManagement");
const CurrentStock = require("../../models/currentStock");
let materialAssignmentService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;

materialAssignmentService.fetchMaterialAssignment = async () => {
  try {
    const data = await MaterialAssignment.find({});

    // const materials = await CurrentStock.aggregate([
    //   {
    //     $group: {
    //       _id: "$materialName",
    //       batchNumbers: { $addToSet: "$batchNumber" },
    //     },
    //   },
    //   {
    //     $project: {
    //       materialName: "$_id",
    //       batchNumbers: 1,
    //       _id: 0,
    //     },
    //   },
    // ]);
    const materials = await CurrentStock.aggregate([
      {
        $group: {
          _id: "$materialName",
          batchNumber: { $first: "$batchNumber" } // Use $first instead of $addToSet
        }
      },
      {
        $project: {
          materialName: "$_id",
          batchNumber: 1,
          _id: 0
        }
      }
    ]);
    const finishedGoods = await FinishedGoods.distinct("finishedGoodsName");
    const batchNumber = await CurrentStock.distinct("batchNumber");
const processOrderNumber = await ProductionOrderCreation.distinct('processOrder')
    return {
      status: 200,
      data: data,
      batchNumber: batchNumber,
      materials: materials,
      finishedGoods: finishedGoods,
      processOrderNumber:processOrderNumber
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

    const currentStock = await CurrentStock.findOne({ materialName });

    if (!currentStock) {
      return {
        status: 409,
        message: `Material "${materialName}" not found in Current Stock.`,
      };
    }
    const numericQuantity = parseFloat(currentStock.quantity.replace(/\D/g, ''));


    if (isNaN(numericQuantity)) {
      throw new Error(`Invalid quantity format for material: ${materialName}`);
    }
  
    const updatedQuantity = numericQuantity - assignedQuantity;
    if (numericQuantity < assignedQuantity) {
      return {
        status: 409,
        message: `Insufficient stock for material: ${materialName}`,
      };
    }

    const updatedStock = await CurrentStock.findOneAndUpdate(
      { materialName },
      { quantity: `${updatedQuantity} KG` },
      { new: true }
    );

    if (existing) {
      return {
        status: 409,
        message: " Material Assignment already exists with the same details",
      };
    }
    let assignedAssignmentNumber = assignmentNumber;

    if (!assignmentNumber) {

      const lastOrder = await MaterialAssignment.findOne()
        .sort({ createdAt: -1 }) 
        .select("assignmentNumber");

      if (lastOrder && lastOrder.assignmentNumber) {
        const lastNumber = parseInt(lastOrder.assignmentNumber.match(/\d+$/), 10);
        assignedAssignmentNumber = `FRN/AN/${(lastNumber || 0) + 1}`;
      } else {
        assignedAssignmentNumber = "FRN/AN/1";
      }
    }
    const newData = new MaterialAssignment({
      assignmentNumber:assignedAssignmentNumber,
      batchNumber,
      processOrderNumber,
      materialName,
      assignedQuantity,
      assignedTo,
    });

    await newData.save();
    return {
      status: 200,
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
    let assignedAssignmentNumber = assignmentNumber;

    if (!assignmentNumber) {

      const lastOrder = await MaterialAssignment.findOne()
        .sort({ createdAt: -1 }) 
        .select("assignmentNumber");

      if (lastOrder && lastOrder.assignmentNumber) {
        const lastNumber = parseInt(lastOrder.assignmentNumber.match(/\d+$/), 10);
        assignedAssignmentNumber = `FRN/AN/${(lastNumber || 0) + 1}`;
      } else {
        assignedAssignmentNumber = "FRN/AN/1";
      }
    }
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
            assignmentNumber:assignedAssignmentNumber,
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
