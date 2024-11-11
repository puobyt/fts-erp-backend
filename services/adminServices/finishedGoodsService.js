

const FinishedGoods = require('../../models/finishedGoods')

let finishedGoodsService = {};


finishedGoodsService.fetchFinishedGoods = async () => {
    try {
      const data = await FinishedGoods.find({}).sort({createdAt:-1})
  
      return {
        status: 200,
        data: data,
      };
    } catch (error) {
      console.log("An error occured at fetching Finished Goods in admin service", error.message);
      res.status(500).json({ info: "An error occured in fetching Finished Goods in admin services" });
    }
  };


  finishedGoodsService.newFinishedGoods = async (finishedGoodsData) => {
    try {
      const {
        finishedGoodsName, 
        batchNumber, 
        productionDate, 
        quantityProduced 
      } = finishedGoodsData;
  
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
        quantityProduced 
      });
  
      await newData.save();
      return {
        status: 201,
        message: "New Finished Goods added successfully",
        data: newData,
        token: "sampleToken",
      };
    } catch (error) {
      console.log("An error occured at adding new Finished Goods in admin service", error.message);
      res.status(500).json({ info: "An error occured in adding  Finished Goods in admin services" });
    }
  };
  
  module.exports = finishedGoodsService