const express = require("express");

const requestCreationMaterialService = require("../../services/adminServices/requestCreationMaterialService");

let requestCreationMaterialController = {};

requestCreationMaterialController.fetchRequestCreationForMaterials = async (
  req,
  res
) => {
  try {
    console.log("loadingRequestCreationForMaterials...");

    const result =
      await requestCreationMaterialService.fetchRequestCreationForMaterials();

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: "",
    });
  } catch (error) {
    console.log(
      "An error occurred while fetching reworks in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in server" });
  }
};

requestCreationMaterialController.newRequestCreationForMaterials = async (
  req,
  res
) => {
  try {
    console.log("Adding new  Request Creation For Materials creation ");

    const { requestNumber, materialName, quantity, requiredDate } = req.body;

    const result =
      await requestCreationMaterialService.newRequestCreationForMaterials({
        requestNumber,
        materialName,
        quantity,
        requiredDate,
      });

    res.status(result.status).json({
      message: result.message,
      data: result.data,
      userToken: result.token,
    });
  } catch (error) {
    console.log(
      "An error occurred while adding newRequest Creation For Materials in admin controller:",
      error.message
    );
    res.status(500).json({ info: "An error occurred in Server" });
  }
};


requestCreationMaterialController.editRequestCreationForMaterials = async (req, res) => {
    try {
      console.log("editing Request Creation For Materials..");
  
      const {
        authPassword,
        requestMaterialsId,
        requestNumber,
        materialName,
        quantity,
        requiredDate
      } = req.body;
  

      const result = await requestCreationMaterialService.editRequestCreationForMaterials({
        authPassword,
        requestMaterialsId,
        requestNumber,
        materialName,
        quantity,
        requiredDate
      });
  
      res.status(result.status).json({
        message: result.message,
        data: result.data,
        userToken: result.token,
      });
    } catch (error) {
      console.log(
        "An error occurred while editing production order creation in admin controller:",
        error.message
      );
      res.status(500).json({ info: "An error occurred" });
    }
  };

module.exports = requestCreationMaterialController;
