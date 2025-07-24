const PurchaseOrderCreation = require("../../models/purchaseOrderCreation");
const QualityCheck = require("../../models/qualityCheck");
const CurrentStock = require("../../models/currentStock");
const MainStock = require("../../models/mainStock");
const qualityParameterSchema = require("../../models/qualityParameterSchema");
const finalQualityInspection = require("../../models/finalQualityInspection");
const reworkService = require("./reworkService");
const qualityInspectionService = require("./qualityInspectionService");
let qualityCheckService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;

qualityCheckService.fetchQualityCheck = async (query = {}, finalQualityInspectionQuery = {}) => {
  try {
    let data = []
    data = await QualityCheck.find(query);
    if (Object.keys(finalQualityInspectionQuery).length > 0) {
      const finalQIResult = await finalQualityInspection.find(finalQualityInspectionQuery)
      if (finalQIResult) {
        finalQIResult.map((item) => data.push(item))
      }
    }
    if (Object.keys(query).length === 0) {
      var batches = await CurrentStock.aggregate([
        {
          $group: {
            _id: {
              grn: "$grn",
              materialName: "$materialName",
              materialCode: "$materialCode",
            },
          },
        },
        {
          $project: {
            _id: 0,
            grn: "$_id.grn",
            materialName: "$_id.materialName",
            materialCode: "$_id.materialCode",
          },
        },
      ]);
      var products = await CurrentStock.distinct("materialName");
    }


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
      grn,
      batchNumber,
      materialName,
      materialCode,
      inspectionDate,
      inspectorName,
      qualityStatus,
      comments,
    } = newQualityCheckData;

    const existingBatchNumber = await QualityCheck.findOne({
      batchNumber,
    });

    if (existingBatchNumber) {
      return {
        status: 409,
        message: "Batch Number already exists",
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

    if (existing) {
      return {
        status: 409,
        message: "Quality check already exists with the same details",
      };
    }

    const mainStockExist = await MainStock.findOne({ materialName });
    let currentStock = await CurrentStock.findOne({ grn });

    if (qualityStatus === "Accepted") {
      if (mainStockExist) {
        return {
          status: 409,
          message: "Material stock already exists",
        };
      }
      if (!currentStock) {
        return {
          status: 409,
          message: "Current stock not found",
        };
      }

      const productPrefix = currentStock.materialName.slice(0, 4).toUpperCase().trim();
      const year = new Date(inspectionDate).getFullYear();
      const randomBatchNum = Math.floor(1000 + Math.random() * 9000); // Range: 1000-9999
      const customBatch = `${productPrefix}_${randomBatchNum}_${year}`;

      assignedBatch = customBatch
      const mainStock = new MainStock({
        currentStockId: currentStock.id,
        materialName: currentStock.materialName,
        materialCode: currentStock.materialCode,
        batchNumber: customBatch,
        grn: grn,
        quantity: currentStock.quantity,
        price: currentStock.price,
        vendorName: currentStock.vendorName,
        storageLocation: currentStock.storageLocation,
        dateRecieved: currentStock.dateRecieved,
        expiryDate: new Date(currentStock.expiryDate),
      });
      await mainStock.save();
      currentStock.mainStockId = mainStock.id;
      await currentStock.save();
    }

    let cmt = comments.join(", ")
    const newData = new QualityCheck({
      batchNumber,
      grn,
      materialName,
      materialCode,
      inspectionDate,
      inspectorName,
      qualityStatus,
      cmt,
      expiryDate: new Date(currentStock.expiryDate),
    });

    await newData.save();
    return {
      status: 200,
      message: " New quality check added successfully",
      data: newData,
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at adding quality check in admin service",
      error.message
    );
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

    const existingBatchNumber = await QualityCheck.findOne({
      batchNumber,
      _id: { $ne: qualityCheckId },
    });

    if (existingBatchNumber) {
      return {
        status: 409,
        message: "Batch Number already exists",
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
    const currentStock = await CurrentStock.findOne({ grn: batchNumber });

    const mainStockExist = await MainStock.findOne({
      $and: [
        { materialName: currentStock.materialName },
        { materialCode: currentStock.materialCode },
        { grn: currentStock.grn },
        { quantity: currentStock.quantity },
        { price: currentStock.price },
        { storageLocation: currentStock.storageLocation },
        { vendorName: currentStock.vendorName },
        { dateRecieved: currentStock.dateRecieved },
        { expiryDate: currentStock.expiryDate },
      ],
    });

    if (qualityStatus === "Accepted") {
      let rework = await reworkService.fetchRework({ batchNumber: batchNumber, materialName: materialName });
      
      if (rework.data.length <= 0) {
        rework = await qualityInspectionService.fetchQualityInspection({ batchNumber: batchNumber, productName: materialName });
      }

      if (rework.data.length > 0) {
        await reworkService.removeRework(rework.data[0]._id);
      }
      if (!mainStockExist) {

        if (!currentStock) {
          return {
            status: 409,
            message: "Current stock not found",
          };
        }
        const mainStock = new MainStock({
          currentStockId: currentStock.id,
          materialCode: currentStock.materialCode,
          grn: currentStock.grn,
          materialName: currentStock.materialName,
          quantity: currentStock.quantity,
          unit: currentStock.unit ,
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
        await MainStock.findOneAndDelete({ grn: batchNumber });
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
      message: "Quality Check Edited Successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log("An error occurred at editing quality Check", error.message);
    return {
      status: 500,
      message: "Internal Server Error",
    };
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
qualityCheckService.addQcParameters = async (data) => {
  if (!data || !data.parameterName) {
    throw new Error("Fields are missing")
  }
  const result = await qualityParameterSchema.create(data)
  return result
}
qualityCheckService.editQcParameters = async (id, data) => {
  const params = await qualityParameterSchema.findById(id)
  if (!params) {
    throw new Error("QC params missing!")
  }
  const result = await qualityParameterSchema.findByIdAndUpdate(id, { data }, { new: true })
  console.log("An error occured at editing qc parameters", error.message);

}
qualityCheckService.deleteQcParameters = async (id) => {
  const qcParams = await qualityParameterSchema.findByIdAndDelete(id)
  if (!qcParams) {
    throw new Error("QC params not found!")
  }
  return qcParams
}
qualityCheckService.fetchQcParameters = async () => {
  const result = await qualityParameterSchema.find()
  return result

}

module.exports = qualityCheckService;
