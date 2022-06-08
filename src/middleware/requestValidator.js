const { body, validationResult } = require("express-validator");

validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }
  next();
};

const loginSchema = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid Email Input !")
    .not()
    .isEmpty()
    .withMessage("Email Cannot Empty !"),
  body("password").not().isEmpty().withMessage("Password Cannot Empty !"),
];

const signupSchema = [
  body("firstName").not().isEmpty().withMessage("First Name Cannot Empty !"),
  body("lastName").not().isEmpty().withMessage("Last Name Cannot Empty !"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid Email Input !")
    .not()
    .isEmpty()
    .withMessage("Email Cannot Empty !"),
  body("password").not().isEmpty().withMessage("Password Cannot Empty !"),
];

const userSchema = [
  body("firstName").not().isEmpty().withMessage("First Name Cannot Empty !"),
  body("lastName").not().isEmpty().withMessage("First Name Cannot Empty !"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid Email Input !")
    .not()
    .isEmpty()
    .withMessage("Email Cannot Empty !"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long !")
    .not()
    .isEmpty()
    .withMessage("Password Cannot Empty !"),
  body("address").not().isEmpty().withMessage("Address Cannot Empty !"),
  body("contact").not().isEmpty().withMessage("Contact Cannot Empty !"),
  body("profile").not().isEmpty().withMessage("Profile Cannot Empty !"),
];

const storeSchema = [
  body("name").not().isEmpty().withMessage("Store Name Cannot Empty !"),
  body("region").not().isEmpty().withMessage("Region Cannot Empty !"),
  body("currency").not().isEmpty().withMessage("Currency Cannot Empty !"),
  body("type")
    .not()
    .isEmpty()
    .withMessage("Type Cannot Empty !")
    .isInt({ min: 0, max: 1 })
    .withMessage("Type is 0 or 1 !"),
];

const inventorySchema = [
  body("name").not().isEmpty().withMessage("Store Name Cannot Empty !"),
  body("quantity")
    .not()
    .isEmpty()
    .withMessage("Quantity No Cannot Empty !")
    .isInt()
    .withMessage("Quantity Harus Angka !"),
  body("sellingPrice")
    .not()
    .isEmpty()
    .withMessage("Selling Price No Cannot Empty !")
    .isInt()
    .withMessage("Selling Price Harus Angka !"),
];

const requestValidator = {
  // Validator (Passing Error state)
  validateRequest: validateRequest,
  // Auth
  signupSchema: signupSchema,
  loginSchema: loginSchema,
  // User
  userSchema: userSchema,
  // Store
  storeSchema: storeSchema,
  // Inventory
  inventorySchema: inventorySchema,
};

module.exports = {
  requestValidator,
};
