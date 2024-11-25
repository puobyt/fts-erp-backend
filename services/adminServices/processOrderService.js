const express = require("express");
const ProcessOrder = require("../../models/processOrder");
let processOrderService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;

processOrderService.fetchProcessOrder = async () => {
  try {
    const processOrders = await ProcessOrder.find({});

    return {
      status: 200,
      data: processOrders,
    };
  } catch (error) {
    console.log("An error occured at fetching process orders", error.message);
    res
      .status(500)
      .json({ info: "An error occured in process Orders in services" });
  }
};

processOrderService.newProcessOrder = async (processOrderData) => {
  try {
    const { processOrderNumber, productName, description } = processOrderData;

    const existingProcessOrder = await ProcessOrder.findOne({
      $and: [
        { processOrderNumber: processOrderNumber },
        { productName: productName },
        { description: description },
      ],
    });

    if (existingProcessOrder) {
      return {
        status: 409,
        message: "Process Order already exists with the same details",
      };
    }

    const newProcessOrder = new ProcessOrder({
      processOrderNumber,
      productName,
      description,
    });

    await newProcessOrder.save();
    return {
      status: 201,
      message: "Process Order added successfully",
      data: newProcessOrder,
      token: "sampleToken",
    };
  } catch (error) {
    console.log("An error occured at adding process order", error.message);
    res.status(500).json({
      info: "An error occured in Process Order added Process Order services",
    });
  }
};

processOrderService.editProcessOrder = async (processOrderData) => {
  try {
    const { processOrderId,authPassword, processOrderNumber, productName, description } =
      processOrderData;

    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }

    const existingProcessOrder = await ProcessOrder.findOne({
      $and: [
        { processOrderNumber: processOrderNumber },
        { productName: productName },
        { description: description },
      ],
    });

    const currentProcessOrder = await ProcessOrder.findOne({
      $and: [
        { _id: processOrderId },
        { processOrderNumber: processOrderNumber },
        { productName: productName },
        { description: description },
      ],
    });

    if (existingProcessOrder && !currentProcessOrder) {
      return {
        status: 409,
        message: "Process Order  already exists with the same details",
      };
    } else {
      const processOrder = await ProcessOrder.findByIdAndUpdate(
        processOrderId,
        {
          processOrderNumber,
          productName,
          description,
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    return {
      status: 201,
      message: "Process Order Edited successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log("An error occured at editing Process Order", error.message);
    res
      .status(500)
      .json({ info: "An error occured in Process Order services" });
  }
};
module.exports = processOrderService;
