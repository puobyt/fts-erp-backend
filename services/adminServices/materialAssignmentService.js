
const MaterialAssignment = require('../../models/materialAssignment');
let materialAssignmentService = {};


materialAssignmentService.fetchMaterialAssignment = async () => {
    try {
      const data = await MaterialAssignment.find({}).sort({createdAt:-1})
  
      return {
        status: 200,
        data: data,
      };
    } catch (error) {
      console.log("An error occured at fetching Material Assignment in admin service", error.message);
      res.status(500).json({ info: "An error occured in fetching Material Assignment in admin services" });
    }
  };
  materialAssignmentService.newMaterialAssignment = async (materialData) => {
    try {
      const {
        assignmentNumber,
        materialName,
        assignedQuantity,
        assignedTo
      } = materialData;
  
      const existing = await MaterialAssignment.findOne({
        $and: [
          { assignmentNumber: assignmentNumber },
          { materialName: materialName },
          { assignedQuantity: assignedQuantity },
          { assignedTo: assignedTo },
        ],
      });
  
      if (existing) {
        return {
          status: 409,
          message: " Material Assignment already exists with the same details",
        };
      }
  
      const newData = new MaterialAssignment({
        assignmentNumber,
        materialName,
        assignedQuantity,
        assignedTo
      });
  
      await newData.save();
      return {
        status: 201,
        message: "New Material Assignment added successfully",
        data: newData,
        token: "sampleToken",
      };
    } catch (error) {
      console.log("An error occured at adding new Material Assignment in admin service", error.message);
      res.status(500).json({ info: "An error occured in adding new Material Assignment in admin services" });
    }
  };
  
  module.exports = materialAssignmentService