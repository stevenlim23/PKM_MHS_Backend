const express = require("express");
const router = express.Router();

// Controller
const purchaseController = require("../controllers/purchase.controller");

// Helper
const { requestValidator } = require("../middleware/requestValidator");
const {
  authJwt,
  verifyStore,
  verifySupplier,
  verifyPaymentMethod,
  verifyPurchase,
} = require("../middleware");

// get Purchase List
router.get("/", [authJwt.verifyToken], purchaseController.getPurchaseList);

// Get Purchase Detail
router.get("/:id", [authJwt.verifyToken], purchaseController.getPurchaseDetail);

// Get Purchase Payment Detail
router.get(
  "/payment/:id",
  [authJwt.verifyToken],
  purchaseController.getPaymentDetail
);

// Create Purchase
router.post(
  "/",
  [
    requestValidator.purchaseSchema,
    requestValidator.validateRequest,
    verifyStore.checkStoreId,
    verifySupplier.checkSupplierId,
    authJwt.verifyToken,
  ],
  purchaseController.createNewPurchase
);

// Create Purchase
router.post(
  "/payment",
  [
    requestValidator.purchasePaymentSchema,
    requestValidator.validateRequest,
    verifyPurchase.checkPurchaseId,
    verifyPurchase.checkPurchasePayment,
    verifyPaymentMethod.checkPaymentMethodId,
    authJwt.verifyToken,
  ],
  purchaseController.createNewPurchasePayment
);

module.exports = router;
