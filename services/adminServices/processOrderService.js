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
    const {
      processOrderNumber,
      batchNumber,
      plant,
      equipment,
      startDate,
      finishDate,
      productName,
      productCode,
      batch,
      orderQuantity,
      materialInput,
    } = processOrderData;

    const existingProcessOrderNumber = await ProcessOrder.findOne({
      $or: [
        { processOrderNumber },
        { batchNumber},
      ],
    });
    
    if (existingProcessOrderNumber) {
      if (existingProcessOrderNumber.processOrderNumber === processOrderNumber) {
        return {
          status: 409,
          message: "Process Order Number already exists",
        };
      }
      if (existingProcessOrderNumber.batchNumber === batchNumber) {
        return {
          status: 409,
          message: "Batch Number already exists",
        };
      }
    }

    const existingProcessOrder = await ProcessOrder.findOne({
      $and: [
        { processOrderNumber: processOrderNumber },
        { plant: plant },
        { equipment: equipment },
        { startDate: startDate },
        { finishDate: finishDate },
        { productName: productName },
        { productCode: productCode },
        { batch: batch },
        { orderQuantity: orderQuantity },
        { materialInput: materialInput },
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
      batchNumber,
      plant,
      equipment,
      startDate,
      finishDate,
      productName,
      productCode,
      batch,
      orderQuantity,
      materialInput,
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
    const {
      authPassword,
      processOrderId,
      processOrderNumber,
      batchNumber,
      plant,
      equipment,
      startDate,
      finishDate,
      productName,
      productCode,
      batch,
      orderQuantity,
      materialInput
    } = processOrderData;

    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }

    const existingProcessOrderNumber = await ProcessOrder.findOne({
      $or: [
        { processOrderNumber, _id: { $ne: processOrderId } },
        { batchNumber, _id: { $ne: processOrderId } },
      ],
    });
    
    if (existingProcessOrderNumber) {
      if (existingProcessOrderNumber.processOrderNumber === processOrderNumber) {
        return {
          status: 409,
          message: "Process Order Number already exists",
        };
      }
      if (existingProcessOrderNumber.batchNumber === batchNumber) {
        return {
          status: 409,
          message: "Batch Number already exists",
        };
      }
    }
    const existingProcessOrder = await ProcessOrder.findOne({
      $and: [
        { processOrderNumber: processOrderNumber },
        { batchNumber: batchNumber },
        { plant: plant },
        { equipment: equipment },
        { startDate: startDate },
        { finishDate: finishDate },
        { productName: productName },
        { productCode: productCode },
        { batch: batch },
        { orderQuantity: orderQuantity },
        { materialInput: materialInput },
      ],
    });

    const currentProcessOrder = await ProcessOrder.findOne({
      $and: [
        { _id: processOrderId },
        { processOrderNumber: processOrderNumber },
        { batchNumber: batchNumber },
        { plant: plant },
        { equipment: equipment },
        { startDate: startDate },
        { finishDate: finishDate },
        { productName: productName },
        { productCode: productCode },
        { batch: batch },
        { orderQuantity: orderQuantity },
        { materialInput: materialInput },
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
          batchNumber,
          plant,
          equipment,
          startDate,
          finishDate,
          productName,
          productCode,
          batch,
          orderQuantity,
          materialInput
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

processOrderService.removeProcessOrder = async (processOrderId) => {
  try {
    const processOrder = await ProcessOrder.findByIdAndDelete(processOrderId);

    if (!processOrder) {
      return {
        status: 201,
        message:
          "Process Order not found or can't able to delete right now,Please try again later",
        token: "sampleToken",
      };
    }

    return {
      status: 201,
      message: "process Order deleted successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log("An error occured at Process Order remove", error.message);
    res.status(500).json({
      info: "An error occured in Process Order remove in Process Order services",
    });
  }
};

processOrderService.excelImportData = async (sheetsData) => {
  try {
    const sheet1 = sheetsData.Sheet1; // Process Order Details
    const sheet2 = sheetsData.Sheet2; // Material Input
    const sheet3 = sheetsData.Sheet3; // Material Output
    const sheet4 = sheetsData.Sheet4; // Operations

    const materialInput = sheet2.map((item) => ({
      materialCode: item["Material Code"],
      batch: item.Batch,
      quantity: item.Qty,
      storageLocation: item["Storage Location"],
    }));

    const materialOutput = sheet3.map((item) => ({
      materialCode: item["Material Code"],
      description: item.Description,
      batch: item.Batch,
      quantity: item.Qty,
      storageLocation: item["Storage Location"],
      Yield: item.Yield,
    }));

    const operations = sheet4.map((item) => ({
      operation: item.Operation,
      equipment: item.Equipment,
      startDate: item["Start Date"],
      endDate: item["End Date"],
      machineHrs: item["Machine Hrs"],
      labourHrs: item["Labour Hrs"],
      powerKwh: item["Power in Kwh"],
      steamKg: item["Steam in Kg"],
    }));

    // Fetch Existing Process Orders Once
    const processOrderNumbers = sheet1.map(
      (order) => order["Process Order No"]
    );
    const existingOrders = await ProcessOrder.find({
      processOrderNumber: { $in: processOrderNumbers },
    });

    // Create a Map for Existing Orders
    const existingOrderMap = new Map(
      existingOrders.map((order) => [order.processOrderNumber, order])
    );

    // Prepare Bulk Operations
    const bulkOps = sheet1.map((order) => {
      const processOrderNumber = order["Process Order No"];
      const isExisting = existingOrderMap.has(processOrderNumber);

      // Map Process Order Details
      const data = {
        processOrderNumber,
        plant: order.Plant,
        equipment: order.Equipment,
        startDate: order["Start Date"],
        finishDate: order["Finish Date"],
        productCode: order["Product Code"],
        productName: order["Product Description"],
        batch: order.Batch,
        orderQuantity: order["Order Qty"],
        poIssueDate: order["PO Issue Date"],
        materialInput,
        materialOutput,
        operations,
      };

      // Prepare Update or Insert Operation
      if (isExisting) {
        return {
          updateOne: {
            filter: { processOrderNumber },
            update: { $set: data },
          },
        };
      } else {
        return { insertOne: { document: data } };
      }
    });

    // Execute Bulk Operation
    if (bulkOps.length > 0) {
      await ProcessOrder.bulkWrite(bulkOps);
    }

    // Return Success Response
    return {
      status: 201,
      message: "Process Orders added or updated successfully!",
    };
  } catch (error) {
    console.error(
      "An error occurred while adding process order:",
      error.message
    );
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};
module.exports = processOrderService;
