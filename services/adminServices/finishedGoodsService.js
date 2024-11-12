const FinishedGoods = require("../../models/finishedGoods");

let finishedGoodsService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;
finishedGoodsService.fetchFinishedGoods = async () => {
  try {
    const data = await FinishedGoods.find({}).sort({ createdAt: -1 });

    return {
      status: 200,
      data: data,
    };
  } catch (error) {
    console.log(
      "An error occured at fetching Finished Goods in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in fetching Finished Goods in admin services",
    });
  }
};

finishedGoodsService.newFinishedGoods = async (finishedGoodsData) => {
  try {
    const { finishedGoodsName, batchNumber, productionDate, quantityProduced } =
      finishedGoodsData;

    const existing = await FinishedGoods.findOne({
      $and: [
        { finishedGoodsName: finishedGoodsName },
        { batchNumber: batchNumber },
        { productionDate: productionDate },
        { quantityProduced: quantityProduced },
      ],
    });

    if (existing) {
      return {
        status: 409,
        message: "Finished Goods already exists with the same details",
      };
    }

    const newData = new FinishedGoods({
      finishedGoodsName,
      batchNumber,
      productionDate,
      quantityProduced,
    });

    await newData.save();
    return {
      status: 201,
      message: "New Finished Goods added successfully",
      data: newData,
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at adding new Finished Goods in admin service",
      error.message
    );
    res.status(500).json({
      info: "An error occured in adding  Finished Goods in admin services",
    });
  }
};

finishedGoodsService.editFinishedGoods = async (finishedGoodsData) => {
  try {
    const {
      authPassword,
      finishedGoodsId,
      finishedGoodsName,
      batchNumber,
      productionDate,
      quantityProduced,
    } = finishedGoodsData;

    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }

    const existing = await FinishedGoods.findOne({
      $and: [
        { finishedGoodsName: finishedGoodsName },
        { batchNumber: batchNumber },
        { productionDate: productionDate },
        { quantityProduced: quantityProduced },
      ],
    });

    const currentFinishedGoods = await FinishedGoods.findOne({
      $and: [
        { _id: finishedGoodsId },
        { finishedGoodsName: finishedGoodsName },
        { batchNumber: batchNumber },
        { productionDate: productionDate },
        { quantityProduced: quantityProduced },
      ],
    });

    if (existing && !currentFinishedGoods) {
      return {
        status: 409,
        message: "Finished Goods already exists with the same details",
      };
    } else {
      const FinishedGoodsUpdate = await FinishedGoods.findByIdAndUpdate(
        finishedGoodsId,
        {
          finishedGoodsName,
          batchNumber,
          productionDate,
          quantityProduced,
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    return {
      status: 201,
      message: "Finished Goods Edited Successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log("An error occured at editing finished goods", error.message);
    res.status(500).json({
      info: "An error occured in editing Finished Goods management services",
    });
  }
};



finishedGoodsService.removeFinishedGoods = async (
  finishedGoodsId
) => {
  try {
    const finishedGoods = await FinishedGoods.findByIdAndDelete(
      finishedGoodsId
    );

    if(!finishedGoods){
      return {
        status: 201,
        message: "Finished Goods not found or can't able to delete right now,Please try again later",
        token: "sampleToken",
      };
    }
    return {
      status: 201,
      message: "Finished Goods  deleted successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log(
      "An error occured at Finished Goods remove",
      error.message
    );
    res
      .status(500)
      .json({
        info: "An error occured in Finished Goods  remove in Finished Goods  services",
      });
  }
};

module.exports = finishedGoodsService;
