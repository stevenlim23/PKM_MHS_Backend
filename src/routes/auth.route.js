const express = require("express");
const router = express.Router();

// Controller
const authController = require("../controllers/auth.controller");

// Helper
const { verifySignUp } = require("../middleware");
const { requestValidator } = require("../middleware/requestValidator");

// get all users
router.post(
  "/login",
  [requestValidator.loginSchema, requestValidator.validateRequest],
  authController.loginUser
);

// get all users
router.post(
  "/signup",

  [
    requestValidator.signupSchema,
    requestValidator.validateRequest,
    verifySignUp.checkDuplicateEmail,
  ],
  authController.signupUser
);

module.exports = router;
