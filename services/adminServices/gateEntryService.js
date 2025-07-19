const GateEntry = require("../../models/gateEntry");
const rework = require("../../models/rework");
const VendorManagement = require("../../models/vendorManagement");
const moment = require("moment");
let gateEntryService = {};
require("dotenv").config();
let adminAuthPassword = process.env.ADMIN_AUTH_PASS;


gateEntryService.newGateExit = async (gateExitData) => {
  try {
    const {
      exitTime,
      materials,
      docNumber,
      originalDocNumber,
      vehicleNumber,
      vendorName,
      date,
      returnReason,
      returnedBy,
      qcStatus = 'pending',
      qcDocuments = []
    } = gateExitData;

    console.log("newGateExit", gateExitData);

    if (!exitTime || !docNumber || !vehicleNumber) {
      return {
        status: 400,
        message: "Missing required exit fields"
      };
    }

    const gateExit = new GateEntry({
      gateType: 'return_exit',
      exitTime,
      materials: materials.map(mat => ({
        ...mat,
        qcStatus,
        originalQuantity: mat.quantity
      })),
      docNumber,
      originalDocNumber,
      vehicleNumber,
      vendorName,   
      date,
      returnReason,
      returnedBy,
      qcDocuments
    });

    const savedExit = await gateExit.save();

    return {
      status: 201,
      message: "Gate exit recorded successfully",
      data: savedExit
    };
  } catch (error) {
    console.error("Error in newGateExit:", error.message);
    return {
      status: 500,
      message: "Failed to record gate exit"
    };
  }
};


  gateEntryService.newQcReturnEntry = async (qcReturnData) => {
    try {
      const {
        entryTime,
        materials,
        docNumber,
        originalDocNumber,
        vehicleNumber,
        vendorName,
        date,
        returnReason,
        returnedBy,
        qcStatus = 'pending',
        qcDocuments = []
      } = qcReturnData;
      console.log('qc return data',qcReturnData)
      if (!originalDocNumber || !returnReason || !returnedBy) {
        return {
          status: 400,
          message: "Missing required QC return fields"
        };
      }

      const newQcReturn = new GateEntry({
        gateType: 'qc_return_entry',
        entryTime,
        materials: materials.map(mat => ({
          ...mat,
          qcStatus,
          originalQuantity: mat.quantity
        })),
        docNumber,
        originalDocNumber,
        vehicleNumber,
        vendorName,
        date,
        returnReason,
        returnedBy,
        qcDocuments
      });

      await newQcReturn.save();
      for (const material of materials) {
  const reworkData = new rework({
    batchNumber: material.batchNumber || '',
    materialName: material.materialName,
    issueDescription: returnReason,               // Reason the item was returned
    proposedReworkAction: 'Rework Qc Failed',                     // Leave blank for now
    reworkStatus: 'Pending',
    quantityForRework: material.quantity?.toString(),
    createdBy: qcReturnData.createdBy || null,
    assigned: qcReturnData.assigned || null,
    // inspectionDate and inspectorName intentionally left blank
  });

  await reworkData.save();
}
      return {
        status: 201,
        message: "QC return entry recorded successfully",
        data: newQcReturn
      };
    } catch (error) {
      console.error("Error in newQcReturnEntry:", error.message);
      return {
        status: 500,
        message: "Failed to record QC return"
      };
    }
  };


gateEntryService.updateQcStatus = async (updateData) => {
  try {
    const { gateEntryId, materialIndex, qcStatus, qcRemarks } = updateData;

    const gateEntry = await GateEntry.findById(gateEntryId);
    if (!gateEntry) {
      return {
        status: 404,
        message: "Gate entry not found"
      };
    }

    if (gateEntry.materials[materialIndex]) {
      gateEntry.materials[materialIndex].qcStatus = qcStatus;
      gateEntry.materials[materialIndex].qcRemarks = qcRemarks;
    }

    await gateEntry.save();
    return {
      status: 200,
      message: "QC status updated successfully",
      data: gateEntry
    };
  } catch (error) {
    console.error("Error in updateQcStatus:", error.message);
    return {
      status: 500,
      message: "Failed to update QC status"
    };
  }
};


gateEntryService.fetchGateEntry = async (type) => {
  try {
    const query = type ? { gateType: type } : {};
    const gateEntries = await GateEntry.find(query).sort({ createdAt: -1 });
    const firmNames = await VendorManagement.distinct("nameOfTheFirm");
    
    return {
      status: 200,
      firmNames,
      data: gateEntries
    };
  } catch (error) {
    console.error("Error fetching gate entries:", error.message);
    return {
      status: 500,
      message: "Failed to fetch gate entries"
    };
  }
};

gateEntryService.newGateEntry = async (entryData) => {
  try {
    const { entryTime, materials, docNumber, vehicleNumber, vendorName, date } = entryData;

    console.log("new gate entry service", entryData);

    // Basic validation
    if (!entryTime || !docNumber || !vehicleNumber || !materials?.length) {
      return {
        status: 400,
        message: "Missing required fields",
      };
    }

    // You can't compare arrays directly in MongoDB. Instead, check using unique fields like docNumber + vehicleNumber + entryTime
    const existing = await GateEntry.findOne({
      entryTime,
      docNumber,
      vehicleNumber,
      vendorName,
      date,
    });

    if (existing) {
      return {
        status: 409,
        message: "Gate entry already exists with the same details",
      };
    }

    const newEntry = new GateEntry({
      entryTime,
      materials,
      docNumber,
      vehicleNumber,
      vendorName,
      date,
    });

    const savedEntry = await newEntry.save();

    return {
      status: 201,
      message: "Gate entry added successfully",
      data: savedEntry,
      token: "sampleToken", // Replace this with real token logic if needed
    };

  } catch (error) {
    console.error("Error in newGateEntry service:", error.message);
    return {
      status: 500,
      message: "Failed to add gate entry",
    };
  }
};



gateEntryService.editGateEntry = async (gateEntryData) => {
  try {
    const {
      authPassword,
      gateEntryId,
      materials,
      docNumber,
      entryTime,
      vehicleNumber,
      vendorName,
      date,
    } = gateEntryData;

    if (adminAuthPassword !== authPassword) {
      return {
        status: 401,
        message: "Authorization Password is Invalid",
      };
    }

    const existing = await GateEntry.findOne({
      $and: [
        { entryTime: entryTime },
        { materials: materials },
        { docNumber: docNumber },
        { vehicleNumber: vehicleNumber },
        { vendorName: vendorName },
        { date: date },
      ],
    });

    const currentGateEntry = await GateEntry.findOne({
      $and: [
        { _id: gateEntryId },
        { entryTime: entryTime },
        { materials: materials },
        { docNumber: docNumber },
        { vehicleNumber: vehicleNumber },
        { vendorName: vendorName },
        { date: date },
      ],
    });

    if (existing && !currentGateEntry) {
      return {
        status: 409,
        message: "Gate Entry already exists with the same details",
      };
    }

    const formatTo12Hour = (time24) => moment(time24, "HH:mm").format("h:mm A");
    const formattedTime = formatTo12Hour(entryTime);
    const gateEntry = await GateEntry.findByIdAndUpdate(
      gateEntryId,
      {
        entryTime: formattedTime,
        materials,
        docNumber,
        vehicleNumber,
        vendorName,
        date,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return {
      status: 201,
      message: "Gate Entry Edited Successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log("An error occured at editing Gate Entry", error.message);
    res.status(500).json({
      info: "An error occured in Gate Entry management services",
    });
  }
};

gateEntryService.removeGateEntry = async (gateEntryId) => {
  try {
    const gateEntry = await GateEntry.findByIdAndDelete(gateEntryId);

    return {
      status: 201,
      message: "Gate Entry deleted successfully",
      token: "sampleToken",
    };
  } catch (error) {
    console.log("An error occured at Gate entry remove", error.message);
    res.status(500).json({
      info: "An error occured in Gate entry remove in gate entry services",
    });
  }
};

module.exports = gateEntryService;
