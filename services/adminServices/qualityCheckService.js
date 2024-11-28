const PurchaseOrderCreation = require("../../models/purchaseOrderCreation");
const QualityCheck = require("../../models/qualityCheck");
const CurrentStock = require("../../models/currentStock");
const MainStock = require("../../models/mainStock");
let qualityCheckService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;

qualityCheckService.fetchQualityCheck = async () => {
  try {
    const data = await QualityCheck.find({});
    const batches = await CurrentStock.aggregate([
      {
        $group: {
          _id: {
            batchNumber: "$batchNumber",
            materialName: "$materialName",
            materialCode: "$materialCode",
          },
        },
      },
      {
        $project: {
          _id: 0,
          batchNumber: "$_id.batchNumber",
          materialName: "$_id.materialName",
          materialCode: "$_id.materialCode",
        },
      },
    ]);
    const products = await CurrentStock.distinct("materialName");

    console.log(batches);
    return {
      status: 200,
      data: data,
      batches: batches,
      products: products,
    };
  } catch (error) {
    console.log(
      "An error occured at fetching quality checks in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in fetching quality checks in admin services",
    });
  }
};
qualityCheckService.newQualityCheck = async (newQualityCheckData) => {
  try {
    const {
      batchNumber,
      materialName,
      materialCode,
      inspectionDate,
      inspectorName,
      qualityStatus,
      comments,
    } = newQualityCheckData;

    const existing = await QualityCheck.findOne({
      $and: [
        { batchNumber: batchNumber },
        { materialName: materialName },
        { materialCode: materialCode },
        { inspectionDate: inspectionDate },
        { inspectorName: inspectorName },
        { qualityStatus: qualityStatus },
        { comments: comments },
      ],
    });

    if (existing) {
      return {
        status: 409,
        message: "Quality check already exists with the same details",
      };
    }

    const mainStockExist = await MainStock.findOne({ materialName });

    if (qualityStatus === "Accepted") {
      if (mainStockExist) {
        return {
          status: 409,
          message: "Material stock already exists",
        };
      }
      const currentStock = await CurrentStock.findOne({ batchNumber });
      if (!currentStock) {
        return {
          status: 409,
          message: "Current stock not found",
        };
      }
      const mainStock = new MainStock({
        currentStockId: currentStock.id,
        materialName: currentStock.materialName,
        materialCode:currentStock.materialCode,
        batchNumber: currentStock.batchNumber,
        quantity: currentStock.quantity,
        price: currentStock.price,
        vendorName: currentStock.vendorName,
        storageLocation: currentStock.storageLocation,
        dateRecieved: currentStock.dateRecieved,
        expiryDate: currentStock.expiryDate,
      });
      await mainStock.save();
      currentStock.mainStockId = mainStock.id;
      await currentStock.save();
    }

    const newData = new QualityCheck({
      batchNumber,
      materialName,
      materialCode,
      inspectionDate,
      inspectorName,
      qualityStatus,
      comments,
    });

    await newData.save();
    return {
      status: 201,
      message: " New quality check added successfully",
      data: newData,
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at adding quality check in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in adding new current stock in admin services",
    });
  }
};

qualityCheckService.editQualityCheck = async (qualityCheckData) => {
  try {
    const {
      authPassword,
      qualityCheckId,
      batchNumber,
      materialName,
      materialCode,
      inspectionDate,
      inspectorName,
      qualityStatus,
      comments,
    } = qualityCheckData;

    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }

    const existing = await QualityCheck.findOne({
      $and: [
        { batchNumber: batchNumber },
        { materialName: materialName },
        { materialCode: materialCode },
        { inspectionDate: inspectionDate },
        { inspectorName: inspectorName },
        { qualityStatus: qualityStatus },
        { comments: comments },
      ],
    });

    const currentQualityCheck = await QualityCheck.findOne({
      $and: [
        { _id: qualityCheckId },
        { batchNumber: batchNumber },
        { materialName: materialName },
        { materialCode: materialCode },
        { inspectionDate: inspectionDate },
        { inspectorName: inspectorName },
        { qualityStatus: qualityStatus },
        { comments: comments },
      ],
    });

    if (existing && !currentQualityCheck) {
      return {
        status: 409,
        message: "Quality Check already exists with the same details",
      };
    } 
     
    const mainStockExist = await MainStock.findOne({ materialName });
    if (qualityStatus === "Accepted") {
      if (!mainStockExist) {
        const currentStock = await CurrentStock.findOne({ batchNumber });
        if (!currentStock) {
          return {
            status: 409,
            message: "Current stock not found",
          };
        }
        const mainStock = new MainStock({
          currentStockId: currentStock.id,
          materialCode:currentStock.materialCode,
          materialName: currentStock.materialName,
          quantity:currentStock.quantity,
          price: currentStock.price,
          vendorName: currentStock.vendorName,
          storageLocation: currentStock.storageLocation,
          dateRecieved: currentStock.dateRecieved,
          expiryDate: currentStock.expiryDate,
        });
        await mainStock.save();
      }
    } else if (qualityStatus === "Quarantine || Rejected ") {
      if (mainStockExist) {
        await MainStock.findOneAndDelete({ batchNumber });
      }
    }

    const qualityCheck = await QualityCheck.findByIdAndUpdate(
      qualityCheckId,
      {
        batchNumber,
        materialName,
        materialCode,
        inspectionDate,
        inspectorName,
        qualityStatus,
        comments,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return {
      status: 201,
      message: "quality Check Edited Successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log("An error occured at editing quality Check", error.message);
    res.status(500).json({
      info: "An error occured in editing quality Check management services",
    });
  }
};

qualityCheckService.removeQualityCheck = async (qualityCheckId) => {
  try {
    const qualityCheck = await QualityCheck.findByIdAndDelete(qualityCheckId);

    if (!qualityCheck) {
      return {
        status: 201,
        message:
          "Product not found or can't able to delete right now,Please try again later",
        token: "sampleToken",
      };
    }
    if (qualityCheck) {
      return {
        status: 201,
        message: "Quality check deleted successfully",
        token: "sampleToken",
      };
    }
  } catch (error) {
    console.log("An error occured at quality check remove", error.message);
    res.status(500).json({
      info: "An error occured in quality check remove in current stock services",
    });
  }
};

module.exports = qualityCheckService;
