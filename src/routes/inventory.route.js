const express = require("express");
const router = express.Router();
// Controller
const inventoryController = require("../controllers/inventory.controller");

// Helper
const { authJwt, verifyStore } = require("../middleware");
const { requestValidator } = require("../middleware/requestValidator");

// get all Inventory
router.get("/", [authJwt.verifyToken], inventoryController.getInventoryList);

// // get Inventory by ID
router.get(
  "/:id",
  [authJwt.verifyToken],
  inventoryController.getInventoryListById
);

// create new Inventory
router.post(
  "/",
  [
    authJwt.verifyToken,
    requestValidator.inventorySchema,
    requestValidator.validateRequest,
    verifyStore.checkStoreId,
  ],
  inventoryController.createNewInventory
);

// // update Inventory
router.put(
  "/:id",
  [
    authJwt.verifyToken,
    requestValidator.inventorySchema,
    requestValidator.validateRequest,
    verifyStore.checkStoreId,
  ],
  inventoryController.updateInventory
);

// // delete Inventory
router.delete(
  "/:id",
  [authJwt.verifyToken],
  inventoryController.deleteInventory
);

module.exports = router;
