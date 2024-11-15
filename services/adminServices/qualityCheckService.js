const PurchaseOrderCreation = require("../../models/purchaseOrderCreation");
const QualityCheck = require("../../models/qualityCheck");
const CurrentStock = require("../../models/currentStock");
let qualityCheckService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;

qualityCheckService.fetchQualityCheck = async () => {
  try {
    const data = await QualityCheck.find({}).sort({ createdAt: -1 });
    const batches = await PurchaseOrderCreation.aggregate([
      {
        $group: {
          _id: { batchNumber: "$batchNumber", productName: "$productName" },
        },
      },
      {
        $project: {
          _id: 0,
          batchNumber: "$_id.batchNumber",
          productName: "$_id.productName",
        },
      },
    ]);
    const products = await CurrentStock.distinct('productName')

    console.log(batches);
    return {
      status: 200,
      data: data,
      batches: batches,
      products:products
    };
  } catch (error) {
    console.log(
      "An error occured at fetching quality checks in admin service",
      error.message
    );
    res
      .status(500)
      .json({
        info: "An error occured in fetching quality checks in admin services",
      });
  }
};
qualityCheckService.newQualityCheck = async (newQualityCheckData) => {
  try {
    const {
      batchNumber,
      productName,
      inspectionDate,
      inspectorName,
      qualityStatus,
      comments,
    } = newQualityCheckData;

    const existing = await QualityCheck.findOne({
      $and: [
        { batchNumber: batchNumber },
        { productName: productName },
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

    const newData = new QualityCheck({
      batchNumber,
      productName,
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
    res
      .status(500)
      .json({
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
      productName,
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
        { productName: productName },
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
        { productName: productName },
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
    } else {
      const qualityCheck = await QualityCheck.findByIdAndUpdate(
        qualityCheckId,
        {
          batchNumber,
          productName,
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
    }

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
