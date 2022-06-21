const express = require("express");
const router = express.Router();

// Controller
const salesController = require("../controllers/sales.controller");

// Helper
const { requestValidator } = require("../middleware/requestValidator");
const {
  authJwt,
  verifyStore,
  verifySupplier,
  verifyPaymentMethod,
  verifyPurchase,
  verifySales,
} = require("../middleware");

// get Purchase List
router.get("/", [authJwt.verifyToken], salesController.getSalesList);

// Get Purchase Detail
router.get("/:id", [authJwt.verifyToken], salesController.getSalesDetail);

// Get Purchase Payment Detail
router.get(
  "/payment/:id",
  [authJwt.verifyToken],
  salesController.getPaymentDetail
);

// Create Purchase
router.post(
  "/",
  [
    requestValidator.salesSchema,
    requestValidator.validateRequest,
    verifyStore.checkStoreId,
    authJwt.verifyToken,
  ],
  salesController.createNewSales
);

// Create Purchase
router.post(
  "/payment",
  [
    requestValidator.salesPaymentSchema,
    requestValidator.validateRequest,
    verifySales.verifySalesId,
    verifyPaymentMethod.checkPaymentMethodId,
    authJwt.verifyToken,
  ],
  salesController.createNewSalesPayment
);

module.exports = router;
