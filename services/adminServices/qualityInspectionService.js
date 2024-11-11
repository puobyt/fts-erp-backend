
const FinalQualityInspection = require("../../models/finalQualityInspection");

let qualityInspectionService = {};


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
  
  
  module.exports = qualityInspectionService