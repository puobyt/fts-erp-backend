const express = require('express');
const adminRouter = express.Router();
const vendorController = require('../controllers/adminController/vendorController');
const purchaseOrderController = require('../controllers/adminController/purchaseOrderController');
const gateEntryController = require('../controllers/adminController/gateEntryController');
const currentStockController = require('../controllers/adminController/currentStockController');
const qualityCheckController = require('../controllers/adminController/qualityCheckController');
const reworkController = require('../controllers/adminController/reworkController');
const productionOrderCreationController = require('../controllers/adminController/productionOrderCreationController');
const requestCreationMaterialController = require('../controllers/adminController/requestCreationMaterialController');
const materialAssignmentController = require('../controllers/adminController/materialAssignmentController');
const billOfMaterialsController = require('../controllers/adminController/billOfMaterialsController');
const qualityInspectionController = require('../controllers/adminController/qualityInspectionController');
const finishedGoodsController = require('../controllers/adminController/finishedGoodsController');

adminRouter.get('/vendorManagement',vendorController.vendorManagement);
adminRouter.get('/purchaseOrderCreation',purchaseOrderController.fetchPurchaseOrderCreation);
adminRouter.get('/gateEntry',gateEntryController.fetchGateEntry);
adminRouter.get('/currentStock',currentStockController.fetchCurrentStock);
adminRouter.get('/qualityCheck',qualityCheckController.fetchQualityCheck);
adminRouter.get('/rework',reworkController.fetchRework);
adminRouter.get('/productionOrderCreation',productionOrderCreationController.fetchProductOrderCreation);
adminRouter.get('/requestCreationForMaterials',requestCreationMaterialController.fetchRequestCreationForMaterials);
adminRouter.get('/materialAssignment',materialAssignmentController.fetchMaterialAssignment);
adminRouter.get('/billOfMaterials',billOfMaterialsController.fetchbillOfMaterials);
adminRouter.get('/qualityInpsection',qualityInspectionController.fetchQualityInspection);
adminRouter.get('/finishedGoods',finishedGoodsController.fetchFinishedGoods);
adminRouter.get('/firms',purchaseOrderController.fetchFirms);

adminRouter.post('/newVendorManagmenent',vendorController.newVendorManagement); 
adminRouter.post('/newPurchaseOrderCreation',purchaseOrderController.newPurchaseOrderCreation);
adminRouter.post('/newGateEntry',gateEntryController.newGateEntry);
adminRouter.post('/newCurrentStock',currentStockController.newCurrentStock);
adminRouter.post('/newQualityCheck',qualityCheckController.newQualityCheck);
adminRouter.post('/newRework',reworkController.newRework);
adminRouter.post('/newProductionOrderCreation',productionOrderCreationController.newProductionOrderCreation);
adminRouter.post('/newRequestCreationForMaterials',requestCreationMaterialController.newRequestCreationForMaterials);
adminRouter.post('/newMaterialAssignment',materialAssignmentController.newMaterialAssignment);
adminRouter.post('/newBillOfMaterials',billOfMaterialsController.newBillOfMaterials);
adminRouter.post('/newQualityInspection',qualityInspectionController.newQualityInspection);
adminRouter.post('/newFinishedGoods',finishedGoodsController.newFinishedGoods);

adminRouter.put('/editVendorManagmenent',vendorController.editVendorManagement);
adminRouter.put('/editPurchaseOrderCreation',purchaseOrderController.editPurchaseOrderCreation);
adminRouter.put('/editGateEntry',gateEntryController.editGateEntry);
adminRouter.put('/editCurrentStock',currentStockController.editCurrentStock);
adminRouter.put('/editQualityCheck',qualityCheckController.editQualityCheck);
adminRouter.put('/editRework',reworkController.editRework);
adminRouter.put('/editProductionOrderCreation',productionOrderCreationController.editProductionOrderCreation);
adminRouter.put('/editRequestCreationForMaterials',requestCreationMaterialController.editRequestCreationForMaterials);



module.exports = adminRouter;