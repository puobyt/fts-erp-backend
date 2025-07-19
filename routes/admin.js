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
const invoiceCreationController = require('../controllers/adminController/invoiceCreationController');
const adminController = require('../controllers/adminController/adminController');
const mainStockController = require('../controllers/adminController/mainStockController');
const processOrderController = require('../controllers/adminController/processOrderController');
const { createRequestSchema } = require('../middleware/createRequestSchema');
const validate = require('../middleware/validate');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files in uploads/ folder
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // e.g. .jpg, .pdf
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

// ✅ Accept only images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Only images and PDFs are allowed!'), false); // Reject file
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


adminRouter.get('/vendorManagement',vendorController.vendorManagement);
adminRouter.get('/purchaseOrderCreation',purchaseOrderController.fetchPurchaseOrderCreation);
adminRouter.get('/gateEntry',gateEntryController.fetchGateEntry);
adminRouter.get('/currentStock',currentStockController.fetchCurrentStock);
adminRouter.get('/qualityCheck',qualityCheckController.fetchQualityCheck);
adminRouter.get('/qc-parameters',qualityCheckController.fetchQcParams);
adminRouter.get('/mainStock',mainStockController.fetchMainStock);
adminRouter.get('/outOfStock',mainStockController.fetchOutOfStock);
adminRouter.get('/processOrder',processOrderController.fetchProcessOrder);
adminRouter.get('/rework',reworkController.fetchRework);
adminRouter.get('/productionOrderCreation',productionOrderCreationController.fetchProductOrderCreation);
adminRouter.get('/productionOrderCreationOutput',productionOrderCreationController.fetchProductOrderCreationOutput);
adminRouter.get('/requestCreationForMaterials',requestCreationMaterialController.fetchRequestCreationForMaterials);
adminRouter.get('/materialAssignment',materialAssignmentController.fetchMaterialAssignment);
adminRouter.get('/billOfMaterials',billOfMaterialsController.fetchbillOfMaterials);
adminRouter.get('/qualityInpsection',qualityInspectionController.fetchQualityInspection);
adminRouter.get('/finishedGoods',finishedGoodsController.fetchFinishedGoods);
adminRouter.get('/search/materials',adminController.tracebilitySearch);
adminRouter.get('/search/finishedGoods',adminController.tracebilityFinishedGoodsSearch);
adminRouter.get('/purchase-orders',purchaseOrderController.getAllPurchaseOrders);
adminRouter.get('/purchase-orders/:poId/production-orders', productionOrderCreationController.fetchProductionOrderForPO);
adminRouter.get('/production-orders/:prodOrderId/materials', productionOrderCreationController.fetchMaterialsForProductionOrder);
// adminRouter.get('/firms',purchaseOrderController.fetchFirms);
adminRouter.get('/search/production',adminController.tracebilityProductionSearch);
adminRouter.get('/search/packing&shipping',adminController.tracebilityPackingAndShipping);
adminRouter.get('/invoiceCreations',invoiceCreationController.fetchInvoiceCreations);
adminRouter.get('/current-stock/:id/pdf-data',adminController.fetchPDFData);
adminRouter.post('/newVendorManagmenent',vendorController.newVendorManagement); 
adminRouter.post('/newPurchaseOrderCreation',purchaseOrderController.newPurchaseOrderCreation);
adminRouter.post('/newGateEntry',upload.none(),gateEntryController.newGateEntry);
adminRouter.post('/newGateExit',upload.array('qcDocuments'),gateEntryController.newGateExit);
adminRouter.post('/newQcReturnEntry',upload.array('qcDocuments'),gateEntryController.newQcReturnEntry);
adminRouter.patch('/newQcReturn/:id',gateEntryController.updateQcStatus);
adminRouter.post('/newCurrentStock',currentStockController.newCurrentStock);
adminRouter.post('/newQualityCheck',qualityCheckController.newQualityCheck);
adminRouter.post('/qc-parameters',qualityCheckController.addQcParams);
adminRouter.post('/newMainStock',mainStockController.newMainStock);
adminRouter.post('/newProcessOrder',processOrderController.newProcessOrder); 
adminRouter.post('/processOrder/import-data',processOrderController.excelImportData); 
adminRouter.post('/newRework',reworkController.newRework);
adminRouter.post('/newProductionOrderCreation',productionOrderCreationController.newProductionOrderCreation);
adminRouter.post('/newProductionOrderCreationOutput',productionOrderCreationController.newProductionOrderCreationOutput);
adminRouter.post('/newRequestCreationForMaterials',validate(createRequestSchema),requestCreationMaterialController.newRequestCreationForMaterials);
adminRouter.post('/newMaterialAssignment',materialAssignmentController.newMaterialAssignment);
adminRouter.post('/newBillOfMaterials',billOfMaterialsController.newBillOfMaterials);
adminRouter.post('/newQualityInspection',qualityInspectionController.newQualityInspection);
adminRouter.post('/newFinishedGoods',finishedGoodsController.newFinishedGoods);
adminRouter.post('/newInvoiceCreation',invoiceCreationController.newInvoiceCreation);

adminRouter.put('/editInvoiceCreation',invoiceCreationController.editInvoiceCreation);
adminRouter.put('/editVendorManagmenent',vendorController.editVendorManagement);
adminRouter.put('/editPurchaseOrderCreation',purchaseOrderController.editPurchaseOrderCreation);
adminRouter.put('/editGateEntry',gateEntryController.editGateEntry);
adminRouter.put('/editCurrentStock',currentStockController.editCurrentStock);
adminRouter.put('/editQualityCheck',qualityCheckController.editQualityCheck);
adminRouter.put('/qc-parameters/:id',qualityCheckController.editQcParams);
adminRouter.put('/editMainStock',mainStockController.editMainStock);
adminRouter.put('/getfirststocks/:materialName',mainStockController.getFirstStocks);
adminRouter.put('/editProcessOrder',processOrderController.editProcessOrder);
adminRouter.put('/editRework',reworkController.editRework);
adminRouter.put('/editProductionOrderCreation',productionOrderCreationController.editProductionOrderCreation);
adminRouter.put('/editProductionOrderCreationOutput',productionOrderCreationController.editProductionOrderCreationOutput);
adminRouter.put('/editRequestCreationForMaterials',requestCreationMaterialController.editRequestCreationForMaterials);
adminRouter.put('/editMaterialAssignment',materialAssignmentController.editMaterialAssignment);
adminRouter.put('/editBillOfMaterials',billOfMaterialsController.editBillOfMaterials);
adminRouter.put('/editQualityInspection',qualityInspectionController.editQualityInspection);
adminRouter.put('/editFinishedGoods',finishedGoodsController.editFinishedGoods);

adminRouter.delete('/removeVendorManagement',vendorController.removeVendorManagement);
adminRouter.delete('/removePurchaseOrderCreation',purchaseOrderController.removePurchaseOrderCreation);
adminRouter.delete('/removeGateEntry',gateEntryController.removeGateEntry);
adminRouter.delete('/removeCurrentStock',currentStockController.removeCurrentStock);
adminRouter.delete('/removeQualityCheck',qualityCheckController.removeQualityCheck);
adminRouter.delete('/qc-parameters/:id',qualityCheckController.deleteQcParams);
adminRouter.delete('/removeMainStock',mainStockController.removeMainStock);
adminRouter.delete('/removeRework',reworkController.removeRework);
adminRouter.delete('/removeProcessOrder',processOrderController.removeProcessOrder);
adminRouter.delete('/removeProductionOrderCreation',productionOrderCreationController.removeProductionOrderCreation);
adminRouter.delete('/removeProductionOrderCreationOutput',productionOrderCreationController.removeProductionOrderCreationOutput);
adminRouter.delete('/removeRequestCreationForMaterials',requestCreationMaterialController.removeRequestCreationForMaterials);
adminRouter.delete('/removeMaterialAssignment',materialAssignmentController.removeMaterialAssignment);
adminRouter.delete('/removeBillOfMaterials',billOfMaterialsController.removeBillOfMaterials);
adminRouter.delete('/removeFinalQualityInspection',qualityInspectionController.removeFinalQualityInspection);
adminRouter.delete('/removeFinishedGoods',finishedGoodsController.removeFinishedGoods);
adminRouter.delete('/removeInvoiceCreation',invoiceCreationController.removeInvoiceCreation);
adminRouter.post('/signIn',adminController.signIn);
adminRouter.post('/signUp',adminController.signUp);
adminRouter.post('/verifyOtp',adminController.verifyOtp);
// adminRouter.post('/otpSignUp',adminController.otpSignUp);


module.exports = adminRouter;