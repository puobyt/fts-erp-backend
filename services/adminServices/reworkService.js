const CurrentStock = require("../../models/currentStock");
const Rework = require('../../models/rework');
let reworkService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;
reworkService.fetchRework = async () => {
    try {
      const data = await Rework.find({})
      const batches = await CurrentStock.aggregate([
        {
          $group: {
            _id: { batchNumber: "$batchNumber", materialName: "$materialName" },
          },
        },
        {
          $project: {
            _id: 0,
            batchNumber: "$_id.batchNumber",
            materialName: "$_id.materialName",
          },
        },
      ]);
      return {
        status: 200,
        data: data,
        batches:batches
      };
    } catch (error) {
      console.log("An error occured at fetching reworks in admin service", error.message);
      res.status(500).json({ info: "An error occured in fetching quality checks in admin services" });
    }
  };
  reworkService.newRework = async (reworkData) => {
    try {
      const {
        batchNumber, 
        materialName, 
        inspectionDate, 
        inspectorName, 
        issueDescription, 
        proposedReworkAction, 
        reworkStartDate, 
        reworkCompletionDate, 
        quantityForRework, 
        reworkStatus, 
        comments
      } = reworkData;
  
      const existing = await Rework.findOne({
        $and: [
          { batchNumber: batchNumber },
          { materialName: materialName },
          { inspectionDate: inspectionDate },
          { inspectorName: inspectorName },
          { issueDescription: issueDescription},
          { proposedReworkAction: proposedReworkAction},
          { reworkStartDate: reworkStartDate },
          { reworkCompletionDate: reworkCompletionDate },
          { quantityForRework: quantityForRework },
          { reworkStatus: reworkStatus },
          { comments: comments},
    
        ],
      });
  
      if (existing) {
        return {
          status: 409,
          message: "Rework already exists with the same details",
        };
      }
  
      const newData = new Rework({
        batchNumber, 
        materialName, 
        inspectionDate, 
        inspectorName, 
        issueDescription, 
        proposedReworkAction, 
        reworkStartDate, 
        reworkCompletionDate, 
        quantityForRework, 
        reworkStatus, 
        comments
      });
  
      await newData.save();
      return {
        status: 201,
        message: " New Rework added successfully",
        data: newData,
        token: "sampleToken",
      };
    } catch (error) {
      console.log("An error occured at adding rework in admin service", error.message);
      res.status(500).json({ info: "An error occured in adding new rework in admin services" });
    }
  };



  reworkService.editRework = async (reworkData) => {
    try {
      const {
        authPassword,
        reworkId,
        batchNumber ,
        materialName,
        inspectionDate ,
        inspectorName,
        issueDescription,
        proposedReworkAction,
        reworkStartDate,
        reworkCompletionDate,
        quantityForRework,
        reworkStatus,
        comments
      } = reworkData;
  
      if (adminAuthPassword !== authPassword) {
        return {
          status: 401,
          message: "Authorization Password is Invalid",
        };
      }
  
      const existing = await Rework.findOne({
        $and: [
          { batchNumber: batchNumber },
          { materialName: materialName },
          { inspectionDate: inspectionDate },
          { inspectorName: inspectorName },
          { issueDescription: issueDescription },
          { proposedReworkAction: proposedReworkAction },
          { reworkStartDate: reworkStartDate },
          { reworkCompletionDate: reworkCompletionDate },
          { quantityForRework: quantityForRework },
          { reworkStatus: reworkStatus },
          { comments:comments },
        ],
      });
  
      const currentRework = await Rework.findOne({
        $and: [
          { _id: reworkId },
          { batchNumber: batchNumber },
          { materialName: materialName },
          { inspectionDate: inspectionDate },
          { inspectorName: inspectorName },
          { issueDescription: issueDescription },
          { proposedReworkAction: proposedReworkAction },
          { reworkStartDate: reworkStartDate },
          { reworkCompletionDate: reworkCompletionDate },
          { quantityForRework: quantityForRework },
          { reworkStatus: reworkStatus },
          { comments:comments },
        ],
      });
  
      if (existing && !currentRework) {
        return {
          status: 409,
          message: "Rework already exists with the same details",
        };
      } else {
        const reworkUpdate = await Rework.findByIdAndUpdate(
            reworkId,
          {
            batchNumber ,
            materialName,
            inspectionDate ,
            inspectorName,
            issueDescription,
            proposedReworkAction,
            reworkStartDate,
            reworkCompletionDate,
            quantityForRework,
            reworkStatus,
            comments
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
  
      return {
        status: 201,
        message: "Rework Edited Successfully",
        token: "sampleToken",
      };
    } catch (error) {
      console.log("An error occured at editing Rework", error.message);
      res.status(500).json({
        info: "An error occured in editing Rework services",
      });
    }
  };

  reworkService.removeRework = async (
    reworkId
  ) => {
    try {
      const rework = await Rework.findByIdAndDelete(
        reworkId
      );

      if(!rework){
        return {
          status: 201,
          message: "Rework not found or can't able to delete right now,Please try again later",
          token: "sampleToken",
        };
      }
if(rework){
  return {
    status: 201,
    message: "Rework deleted successfully",
    token: "sampleToken",
  };
}

    } catch (error) {
      console.log(
        "An error occured at rework remove",
        error.message
      );
      res
        .status(500)
        .json({
          info: "An error occured in rework remove in current stock services",
        });
    }
  };
  module.exports = reworkService