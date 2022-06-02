const express = require("express");
const router = express.Router();
// Controller
const userController = require("../controllers/user.controller");

// Helper
const { authJwt, verifySignUp } = require("../middleware");
const { requestValidator } = require("../middleware/requestValidator");

// get all users
router.get("/", [authJwt.verifyToken], userController.getUserList);

// // get user by ID
router.get("/:id", [authJwt.verifyToken], userController.getUserById);

// create new user
router.post(
  "/",
  [
    authJwt.verifyToken,
    requestValidator.userSchema,
    requestValidator.validateRequest,
    verifySignUp.checkDuplicateEmail,
  ],
  userController.createNewUser
);

// // update user
router.put(
  "/:id",
  [
    authJwt.verifyToken,
    requestValidator.userSchema,
    requestValidator.validateRequest,
    verifySignUp.checkDuplicateEmail,
  ],
  userController.updateUser
);

// // delete user
router.delete("/:id", [authJwt.verifyToken], userController.deleteUser);

module.exports = router;
