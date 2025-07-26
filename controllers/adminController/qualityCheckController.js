const express = require("express");

const qualityCheckService = require("../../services/adminServices/qualityCheckService");

let qualityCheckController = {};

qualityCheckController.fetchQualityCheck = async (req, res) => {
  try {
    console.log("loading quality checks...");

    const result = await qualityCheckService.fetchQualityCheck();

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      batches:result.batches,
      products:result.products,
      userToken: "",
    });
  } catch (error) {
    console.log(
      "An error occurred while fetching quality checks in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};
qualityCheckController.newQualityCheck = async (req, res) => {
  try {
    console.log("Adding new quality check ");

    const {
      grn,
      materialName,
      materialCode,
      inspectionDate,
      inspectorName,
      qualityStatus,
      comments,
    } = req.body;

    const result = await qualityCheckService.newQualityCheck({
      grn,
      materialName,
      materialCode,
      inspectionDate,
      inspectorName,
      qualityStatus,
      comments,
    });

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while adding quality checks in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in Server" });
  }
};


qualityCheckController.editQualityCheck = async (req, res) => {
    try {
      console.log("editing quality check..");
  
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
      } = req.body;
  

      const result = await qualityCheckService.editQualityCheck({
        authPassword,
        qualityCheckId,
        batchNumber,
        materialName,
        materialCode,
        inspectionDate,
        inspectorName,
        qualityStatus,
        comments,
      });
  
      res.status(result.status).json({
        message: result.message,
        data: result.data,
        userToken: result.token,
      });
    } catch (error) {
      console.log(
        "An error occurred while adding editing quality check controller in admin controller:",
        error.message
      );
      res.status(500).json({ info: "An error occurred" });
    }
  };


  qualityCheckController.removeQualityCheck = async (req, res) => {
    try {
      console.log("deleting quality Check...");
  const {qualityCheckId} = req.query;
      // Pass the extracted data to the service function
      const result = await qualityCheckService.removeQualityCheck(qualityCheckId);
  
      res.status(result.status).json({
        message: result.message,
        userToken: result.token,
        
      });
    } catch (error) {
      console.log(
        "An error occurred while removing current stock in admin controller:",
        error.message
      );
      res.status(500).json({ info: "An error occurred in server" });
    }
  };
  qualityCheckController.addQcParams=async(req,res)=>{
    try {
      const data=req.body
      if(!data||!data.parameterName||data.minRange===undefined ||data.maxRange===undefined||!data.methodOfAnalysis)
      {
        throw new Error("Fields are missing!")
      }
      const result=await qualityCheckService.addQcParameters(data)
      res.status(200).json({message:"Qc params added successfully",data:result})
    } catch (error) {
      console.log(
        "An error occurred while adding qc params in admin controller:",
        error.message
      );
      res.status(500).json({ info: "An error occurred in server" });
    }
  }
  qualityCheckController.editQcParams=async(req,res)=>{
    try {
      const data=req.body
      const id=req.params.id
      if(!id)
      {
        throw new Error("ID required")
      }
      if(!data)
      {
        throw new Error("No data provided!")
      }
      const result=await qualityCheckService.editQcParameters(id,data)
      res.status(200).json({message:"Qc params edited successfully"})
    } catch (error) {
      console.log(
        "An error occurred while editing qc params in admin controller:",
        error.message
      );
      res.status(500).json({ info: "An error occurred in server" });
    }
  }
  qualityCheckController.deleteQcParams=async(req,res)=>{
    try {
      const id=req.params.id
      if(!id)
      {
        throw new Error("Failed to delete qc params")
      }
      const result=await qualityCheckService.deleteQcParameters(id)
      res.status(200).json({message:"Qc params deleted successfully!"})
    } catch (error) {
      console.log("An error occured while deleting qc params in admin controller")
      res.status(500).json({info:"An error occured in server!"})
    }
  }
  qualityCheckController.fetchQcParams=async(req,res)=>{
    try {
      const params=await qualityCheckService.fetchQcParameters()
      res.status(200).json(params)
    } catch (error) {
      console.log("Error fetching QC params",error.message)
      res.status(500).json({message:"An error occured in the server"})
    }
  }
module.exports = qualityCheckController;
