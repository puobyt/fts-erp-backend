
const FinalQualityInspection = require("../../models/finalQualityInspection");

let qualityInspectionService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;

qualityInspectionService.fetchQualityInspection = async () => {
    try {
      const data = await FinalQualityInspection.find({}).sort({createdAt:-1})
  
      return {
        status: 200,
        data: data,
      };
    } catch (error) {
      console.log("An error occured at fetching Quality Inspection in admin service", error.message);
      res.status(500).json({ info: "An error occured in fetching  Quality Inspection in admin services" });
    }
  };
  
  qualityInspectionService.newQualityInspection = async (inspectionData) => {
    try {
      const {
        inspectionNumber, 
        productName, 
        inspectionResults,  
      } = inspectionData;
  
      const existing = await FinalQualityInspection.findOne({
        $and: [
          { inspectionNumber: inspectionNumber },
          { productName: productName },
          { inspectionResults: inspectionResults },
        ],
      });
  
      if (existing) {
        return {
          status: 409,
          message: " Quality Inspection already exists with the same details",
        };
      }
  
      const newData = new FinalQualityInspection({
        inspectionNumber, 
        productName, 
        inspectionResults, 
      });
  
      await newData.save();
      return {
        status: 201,
        message: "New Quality Inspection added successfully",
        data: newData,
        token: "sampleToken",
      };
    } catch (error) {
      console.log("An error occured at adding new  Quality Inspection in admin service", error.message);
      res.status(500).json({ info: "An error occured in adding  Quality Inspection in admin services" });
    }
  };


  qualityInspectionService.editQualityInspection = async (qualityInpectionData) => {
    try {
      const {
        authPassword,
        qualityInspectionId,
        inspectionNumber,
        productName,
        inspectionResults
      } = qualityInpectionData;
  
      if (adminAuthPassword !== authPassword) {
        return {
          status: 401,
          message: "Authorization Password is Invalid",
        };
      }
 
      const existing = await FinalQualityInspection.findOne({
        $and: [
          { inspectionNumber: inspectionNumber },
          { productName: productName },
          { inspectionResults: inspectionResults },
        ],
      });
  
      const currentQualityInspection = await FinalQualityInspection.findOne({
        $and: [
          { _id: qualityInspectionId },
          { inspectionNumber: inspectionNumber },
          { productName: productName },
          { inspectionResults: inspectionResults },
        ],
      });
  
      if (existing && !currentQualityInspection) {
        return {
          status: 409,
          message: "Quality Inspection already exists with the same details",
        };
      } else {
        const qualityInspectionUpdate = await FinalQualityInspection.findByIdAndUpdate(
          qualityInspectionId,
          {
  
            inspectionNumber,
            productName,
            inspectionResults
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
  
      return {
        status: 201,
        message: "Quality Inspection Edited Successfully",
        token: "sampleToken",
      };
    } catch (error) {
      console.log("An error occured at editing Quality Inspection", error.message);
      res.status(500).json({
        info: "An error occured in editing Quality Inspection services",
      });
    }
  };

  qualityInspectionService.removeFinalQualityInspection = async (
    qualityInspectionId
  ) => {
    try {
      const finalQualityInspection = await FinalQualityInspection.findByIdAndDelete(
        qualityInspectionId
      );
  
      if(!finalQualityInspection){
        return {
          status: 201,
          message: "Final Quality Inspection not found or can't able to delete right now,Please try again later",
          token: "sampleToken",
        };
      }
      return {
        status: 201,
        message: "Final Quality Inspection deleted successfully",
        token: "sampleToken",
      };
    } catch (error) {
      console.log(
        "An error occured at Final Quality Inspection remove",
        error.message
      );
      res
        .status(500)
        .json({
          info: "An error occured in Final Quality Inspection remove in Final Quality Inspection services",
        });
    }
  };
  
  
  
  module.exports = qualityInspectionService