const RequestCreationForMaterials = require("../../models/requestCreationForMaterials");
const FinishedGoods = require("../../models/finishedGoods");
const MainStock = require("../../models/mainStock");
let requestCreationMaterialService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;

requestCreationMaterialService.fetchRequestCreationForMaterials = async () => {
  try {
    const data = await RequestCreationForMaterials.find({});
    const materials = await MainStock.aggregate([
      {
        $project: {
          materialName: 1, 
          materialCode: 1, 
          _id: 0,         
        },
      },
    ]);
    const finishedGoods = await FinishedGoods.distinct("finishedGoodsName");

    return {
      status: 200,
      data: data,
      materials: materials,
      finishedGoods: finishedGoods,
    };
  } catch (error) {
    console.log(
      "An error occured at fetching Request Creation For Materials in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in fetching Request Creation For Materials in admin services",
    });
  }
};
requestCreationMaterialService.newRequestCreationForMaterials = async (
  requestCreationData
) => {
  try {
    const { requestNumber, materials, requiredDate,finishedGoodsName,status } =
      requestCreationData;

          const existingRequestNumber= await RequestCreationForMaterials.findOne({
            requestNumber,
            });
            
            if (existingRequestNumber) {
              return {
                status: 409,
                message: "Request Number already exists",
              };
            }
    const existing = await RequestCreationForMaterials.findOne({
      $and: [
        { requestNumber: requestNumber },
        { materials: materials },
        { requiredDate: requiredDate },
        { status: status },
        { finishedGoodsName: finishedGoodsName },
      ],
    });

    if (existing) {
      return {
        status: 409,
        message:
          "Request Creation For Materials already exists with the same details",
      };
    }

    let assignedRequestNumber = requestNumber;

    if (!requestNumber) {

      const lastOrder = await RequestCreationForMaterials.findOne()
        .sort({ createdAt: -1 }) 
        .select("requestNumber");

      if (lastOrder && lastOrder.requestNumber) {
        const lastNumber = parseInt(lastOrder.requestNumber.match(/\d+$/), 10);
        assignedRequestNumber = `FRN/RCM/${(lastNumber || 0) + 1}`;
      } else {
        assignedRequestNumber = "FRN/RCM/1";
      }
    }
    const newData = new RequestCreationForMaterials({
      requestNumber:assignedRequestNumber,
      materials,
      requiredDate,
      finishedGoodsName,
      status
    });

    await newData.save();
    return {
      status: 201,
      message: "New Request Creation For Materials added successfully",
      data: newData,
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at adding Request Creation For Materials in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in adding Request Creatio nFor Materials in admin services",
    });
  }
};

requestCreationMaterialService.editRequestCreationForMaterials = async (
  requestCreationData
) => {
  try {
    const {
      authPassword,
      requestMaterialsId,
      requestNumber,
      materials,
      requiredDate,
      finishedGoodsName,
      status
    } = requestCreationData;
    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }

    const existingRequestNumber= await RequestCreationForMaterials.findOne({
      requestNumber,
        _id: { $ne: requestMaterialsId }, 
      });
      
      if (existingRequestNumber) {
        return {
          status: 409,
          message: "Request Number already exists",
        };
      }

    const existing = await RequestCreationForMaterials.findOne({
      $and: [
        { requestNumber: requestNumber },
        { materials: materials },
        { requiredDate: requiredDate },
        { status: status },
        { finishedGoodsName: finishedGoodsName },
      ],
    });
    const currentRequestMaterialsOrder =
      await RequestCreationForMaterials.findOne({
        $and: [
          { _id: requestMaterialsId },
          { requestNumber: requestNumber},
          {materials: materials},
          { requiredDate: requiredDate },
          { status: status },
          { finishedGoodsName: finishedGoodsName },
        ],
      });

      let assignedRequestNumber = requestNumber;

      if (!requestNumber) {
  
        const lastOrder = await RequestCreationForMaterials.findOne()
          .sort({ createdAt: -1 }) 
          .select("requestNumber");
  
        if (lastOrder && lastOrder.requestNumber) {
          const lastNumber = parseInt(lastOrder.requestNumber.match(/\d+$/), 10);
          assignedRequestNumber = `FRN/RCM/${(lastNumber || 0) + 1}`;
        } else {
          assignedRequestNumber = "FRN/RCM/1";
        }
      }
    if (existing && !currentRequestMaterialsOrder) {
      return {
        status: 409,
        message:
          " Request Materials Order already exists with the same details",
      };
    } else {
      const requestMaterialsUpdate =
        await RequestCreationForMaterials.findByIdAndUpdate(
          requestMaterialsId,
          {
            requestNumber:assignedRequestNumber,
            materials,
            requiredDate,
            finishedGoodsName,
            status
          },
          {
            new: true,
            runValidators: true,
          }
        );
    }

    return {
      status: 201,
      message: "Request Materials Creation Order Edited Successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at editing Request Materials Order",
      error.message
    );
    res.status(500).json({
      info: "An error occured in editing Request Materials Order services",
    });
  }
};

requestCreationMaterialService.removeRequestCreationForMaterials = async (
  requestCreationId
) => {
  try {
    const requestCreationForMaterials =
      await RequestCreationForMaterials.findByIdAndDelete(requestCreationId);

    if (!requestCreationForMaterials) {
      return {
        status: 201,
        message:
          "Request creation for materials not found or can't able to delete right now,Please try again later",
        token: "sampleToken",
      };
    }
    if (requestCreationForMaterials) {
      return {
        status: 201,
        message: "Request creation for materials deleted successfully",
        token: "sampleToken",
      };
    }
  } catch (error) {
    console.log(
      "An error occured at request creation for materials remove",
      error.message
    );
    res.status(500).json({
      info: "An error occured in request creation for materials remove in current stock services",
    });
  }
};
module.exports = requestCreationMaterialService;
