

const BillOfMaterials = require('../../models/billOfMaterials');
let billOfMaterialsService = {};


billOfMaterialsService.fetchbillOfMaterials = async () => {
    try {
      const data = await BillOfMaterials.find({}).sort({createdAt:-1})
  
      return {
        status: 200,
        data: data,
      };
    } catch (error) {
      console.log("An error occured at fetching bill Of Materials in admin service", error.message);
      res.status(500).json({ info: "An error occured in fetching bill Of Materials in admin services" });
    }
  };
  billOfMaterialsService.newBillOfMaterials = async (bomData) => {
    try {
      const {
        bomNumber,
        productName,
        materialsList
      } = bomData;
  
      const existing = await BillOfMaterials.findOne({
        $and: [
          { bomNumber: bomNumber },
          { productName: productName },
          { materialsList: materialsList },
        ],
      });
  
      if (existing) {
        return {
          status: 409,
          message: " Bill of materials already exists with the same details",
        };
      }
  
      const newData = new BillOfMaterials({
        bomNumber,
        productName,
        materialsList
      });
  
      await newData.save();
      return {
        status: 201,
        message: "New Bill of materials added successfully",
        data: newData,
        token: "sampleToken",
      };
    } catch (error) {
      console.log("An error occured at adding new Bill Of Materials in admin service", error.message);
      res.status(500).json({ info: "An error occured in adding Bill Of Materials in admin services" });
    }
  };
  
  module.exports = billOfMaterialsService