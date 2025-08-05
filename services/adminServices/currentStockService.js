const CurrentStock = require("../../models/currentStock");
const PurchaseOrderCreation = require("../../models/purchaseOrderCreation");
const GateEntry = require("../../models/gateEntry");

const purchaseOrderService = require("../../services/adminServices/purchaseOrderService");
const VendorManagement = require("../../models/vendorManagement");
const MainStock = require("../../models/mainStock");
const MaterialAssignment = require("../../models/materialAssignment");
const QualityCheck = require("../../models/qualityCheck");
let currentStockService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;

currentStockService.fetchCurrentStock = async () => {
  try {
    const data = await CurrentStock.find({});
    console.log('data', data)
    // const materials = await PurchaseOrderCreation.distinct("materialName");
    const newMaterials = await GateEntry.aggregate([
      { $unwind: "$materials" }, // Flatten the materials array
      {
        $group: {
          _id: "$materials.materialName" // Group by materialName
        }
      },
      {
        $project: {
          _id: 0,
          materialName: "$_id" // Rename _id to materialName
        }
      }
    ]);
    const materials = newMaterials.map(item => item.materialName);

    console.log('materials', materials)
    const vendors = await PurchaseOrderCreation.distinct("nameOfTheFirm");
    const purchaseOrderCreationData = await PurchaseOrderCreation.find(
      {},
      "price quantity productName"
    ).sort({ createdAt: -1 });
    const distinctMaterials = materials

    return {
      status: 200,
      data: data,
      purchaseOrderCreationData: purchaseOrderCreationData,
      materials: distinctMaterials || [],
      vendors: vendors,
    };
  } catch (error) {
    console.log(
      "An error occured at fetching current stocks in admin service",
      error.message
    );
    res
      .status(500)
      .json({ info: "An error occured in fetching stocks in admin services" });
  }
};

currentStockService.newCurrentStock = async (newStockData) => {
  try {
    const {
      materialName,
      materialCode,
      grn,
      quantity,
      unit,
      price,
      storageLocation,
      vendorName,
      dateRecieved,
      expiryDate,
    } = newStockData;

    const existingGrnNumber = await CurrentStock.findOne({
      grn,
    });

    if (existingGrnNumber) {
      return {
        status: 409,
        message: " GRN already exists",
      };
    }
    const existing = await CurrentStock.findOne({
      $and: [
        { materialName: materialName },
        { materialCode: materialCode },
        { grn: grn },
        { quantity: quantity },
        { unit: unit },
        { price: price },
        { storageLocation: storageLocation },
        { vendorName: vendorName },
        { dateRecieved: dateRecieved },
        { expiryDate: expiryDate },
      ],
    });

    if (existing) {
      return {
        status: 409,
        message: "Current stock already exists with the same details",
      };
    }



    // const batchNumberValue = batchNumber || "NIL";
    let assignedGrn = grn;

    if (!grn) {
      const lastOrder = await CurrentStock.findOne()
        .sort({ createdAt: -1 })
        .select("grn");

      if (lastOrder && lastOrder.grn) {
        const lastNumber = parseInt(lastOrder.grn.match(/\d+$/), 10);
        const nextNumber = String((lastNumber || 0) + 1).padStart(3, "0");
        assignedGrn = `FRN/MT/${nextNumber}`;
      } else {
        assignedGrn = "FRN/MT/1";
      }
    }

    const vendor = await PurchaseOrderCreation.findOne({
      nameOfTheFirm: vendorName,
    });
    //  async function calculateAssignedQuantity(materialName) {
    //     const materialAssignments = await MaterialAssignment.aggregate([
    //       {
    //         $unwind: "$materials",
    //       },
    //       {
    //         $match: { "materials.materialsList": materialName },
    //       },
    //       {
    //         $group: {
    //           _id: null,
    //           totalAssignedQuantity: {
    //             $sum: { $toDouble: "$materials.assignedQuantity" },
    //           },
    //         },
    //       },
    //     ]);

    //     return materialAssignments.length > 0
    //       ? materialAssignments[0].totalAssignedQuantity.toString()
    //       : "0";
    //   }

    //   const assignedQuantity = await calculateAssignedQuantity(materialName);
    //   console.log('assigned quanitututuututu',assignedQuantity);
    // const vendor = VendorManagement.findOne({})
    const newStock = new CurrentStock({
      materialName,
      materialCode,
      grn: assignedGrn,
      quantity,
      unit,
      quantityReceived: quantity,
      price,
      storageLocation,
      vendorName,
      vendorId: vendor.vendorId,
      dateRecieved,
      expiryDate,
    });

    await newStock.save();

    // const newData = new QualityCheck({
    //   batchNumber:assignedGrn,
    //   materialName,
    //   materialCode,
    //   inspectionDate:Date.now(),
    //   inspectorName:'Nil',
    //   qualityStatus:'Nil',
    //   comments:'Nil',
    //   expiryDate,

    // });

    // await newData.save();
    return {
      status: 201,
      message: "New stock added successfully",
      data: newStock,
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at adding new current stock in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in adding new current stock in admin services",
    });
  }
};

currentStockService.editCurrentStock = async (currentStockData) => {
  try {
    const {
      authPassword,
      currentStockId,
      materialName,
      materialCode,
      grn,
      quantity,
      unit,
      price,
      storageLocation,
      vendorName,
      dateRecieved,
      expiryDate,
    } = currentStockData;

    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }
    const existingGrn = await CurrentStock.findOne({
      grn,
      _id: { $ne: currentStockId },
    });

    if (existingGrn) {
      return {
        status: 409,
        message: "GRN already exists",
      };
    }
    const existing = await CurrentStock.findOne({
      $and: [
        { materialName: materialName },
        { grn: grn },
        { materialCode: materialCode },
        { quantity: quantity },
        { unit: unit },
        { price: price },
        { vendorName: vendorName },
        { dateRecieved: dateRecieved },
        { expiryDate: expiryDate },
      ],
    });

    const currentStockExist = await CurrentStock.findOne({
      $and: [
        { _id: currentStockId },
        { materialName: materialName },
        { materialCode: materialCode },
        { grn: grn },
        { quantity: quantity },
        { unit: unit },
        { price: price },
        { storageLocation: storageLocation },
        { vendorName: vendorName },
        { dateRecieved: dateRecieved },
        { expiryDate: expiryDate },
      ],
    });

    const GrnValue = grn || "NIL";

    if (existing && !currentStockExist) {
      return {
        status: 409,
        message: "Current Stock already exists with the same details",
      };
    }
    const currentStock = await CurrentStock.findByIdAndUpdate(
      currentStockId,
      {
        materialName,
        materialCode,
        grn: GrnValue,
        quantity,
        unit,
        price,
        vendorName,
        storageLocation,
        dateRecieved,
        expiryDate,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    const mainStockId = currentStock.mainStockId;
    const mainStock = await MainStock.findByIdAndUpdate(
      mainStockId,
      {
        materialName,
        materialCode,
        grn: GrnValue,
        quantity,
        unit,
        price,
        vendorName,
        storageLocation,
        dateRecieved,
        expiryDate,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return {
      status: 201,
      message: "Current Stock Edited Successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log("An error occured at editing Current Stock", error.message);
    res.status(500).json({
      info: "An error occured in editing Current Stock management services",
    });
  }
};

currentStockService.removeCurrentStock = async (currentStockId) => {
  try {
    const currentStock = await CurrentStock.findByIdAndDelete(currentStockId);
    if (currentStock) {
      return {
        status: 201,
        message: "current stock deleted successfully",
        token: "sampleToken",
      };
    }
  } catch (error) {
    console.log("An error occured at current stock remove", error.message);
    res.status(500).json({
      info: "An error occured in current Stock remove in current stock services",
    });
  }
};

module.exports = currentStockService;
