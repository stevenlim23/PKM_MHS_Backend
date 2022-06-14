const express = require("express");
const router = express.Router();
// Controller
const supplierController = require("../controllers/supplier.controller");

// Helper
const { authJwt, verifyStore } = require("../middleware");
const { requestValidator } = require("../middleware/requestValidator");

// get all Supplier
router.get("/", [authJwt.verifyToken], supplierController.getSupplierList);

// // get Supplier by ID
router.get(
  "/:id",
  [authJwt.verifyToken],
  supplierController.getSupplierListById
);

// create new Supplier
router.post(
  "/",
  [
    authJwt.verifyToken,
    requestValidator.supplierSchema,
    requestValidator.validateRequest,
    verifyStore.checkStoreId,
  ],
  supplierController.createNewSupplier
);

// // update Supplier
router.put(
  "/:id",
  [
    authJwt.verifyToken,
    requestValidator.supplierSchema,
    requestValidator.validateRequest,
    verifyStore.checkStoreId,
  ],
  supplierController.updateSupplier
);

// // delete Supplier
router.delete("/:id", [authJwt.verifyToken], supplierController.deleteSupplier);

module.exports = router;
