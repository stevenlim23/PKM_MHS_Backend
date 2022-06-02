const express = require("express");
const router = express.Router();
// Controller
const storeController = require("../controllers/store.controller");

// Helper
const { authJwt } = require("../middleware");
const { requestValidator } = require("../middleware/requestValidator");

// get all Store List
router.get("/", [authJwt.verifyToken], storeController.getStoreList);

// get Store Details By ID
router.get("/:id", [authJwt.verifyToken], storeController.getStoreById);

// create new Store
// router.post(
//   "/",
//   [
//     authJwt.verifyToken,
//     requestValidator.storeSchema,
//     requestValidator.validateRequest,
//   ],
//   storeController.createStore
// );

// update Store
router.put(
  "/:id",
  [
    authJwt.verifyToken,
    requestValidator.storeSchema,
    requestValidator.validateRequest,
  ],
  storeController.updateStore
);

// delete Store
// router.delete("/:id", [authJwt.verifyToken], storeController.deleteStore);

module.exports = router;
