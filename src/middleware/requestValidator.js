const { body, validationResult } = require("express-validator");
const Model = require("../models");
const Inventory = Model.Inventory;

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

const supplierSchema = [
  body("name").not().isEmpty().withMessage("Supplier Name Cannot Empty !"),
  body("telephone")
    .not()
    .isEmpty()
    .withMessage("Telephone Cannot Empty !")
    .isInt()
    .withMessage("Telephone Harus Angka !"),
  body("address").not().isEmpty().withMessage("Address Cannot Empty !"),
  body("email").not().isEmpty().withMessage("Email Cannot Empty !"),
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

const expenseSchema = [
  body("refNumber")
    .not()
    .isEmpty()
    .withMessage("Ref Number Cannot Empty !")
    .isInt()
    .withMessage("Ref Number Harus Angka !"),
  body("storeId").not().isEmpty().withMessage("Store ID Cannot Empty !"),
  body("date").not().isEmpty().withMessage("Date Cannot Empty !"),
  body("name").not().isEmpty().withMessage("Expense Name Cannot Empty !"),
  body("total")
    .not()
    .isEmpty()
    .withMessage("Total No Cannot Empty !")
    .isInt()
    .withMessage("Total Harus Angka !"),
];

const purchaseSchema = [
  body("supplierId").not().isEmpty().withMessage("Supplier ID Cannot Empty !"),
  body("storeId").not().isEmpty().withMessage("Store ID Cannot Empty !"),
  body("refNumber").not().isEmpty().withMessage("RefNumber Cannot Empty !"),
  body("transDate")
    .not()
    .isEmpty()
    .withMessage("Transaction Date Cannot Empty !"),
  body("dueDate").not().isEmpty().withMessage("Due Date Cannot Empty !"),
  body("dueNominal")
    .not()
    .isEmpty()
    .withMessage("Due Nominmal Cannot Empty !")
    .isInt()
    .withMessage("Due Nominmal Harus Angka !"),
  body("status")
    .not()
    .isEmpty()
    .withMessage("Status Cannot Empty !")
    .isInt({ min: 1, max: 3 })
    .withMessage("Status is 1, 2 or 3 !"),
  body("totalPayment")
    .not()
    .isEmpty()
    .withMessage("Total Payment Cannot Empty !")
    .isInt()
    .withMessage("Total Payment Harus Angka !"),
  // Check Item Detail
  // body("itemDetail")
  //   .isArray()
  //   .withMessage("Item Detail Must Array")
  //   .not()
  //   .isEmpty()
  //   .withMessage("Item Detail Cannot Empty !"),
  body("itemDetail.*.inventoryId")
    // .custom((value, { req, loc, path }) => {
    //   for (let i = 0; i < req.body.itemDetail.length; i++) {
    //     return Inventory.findOne({
    //       where: {
    //         inventoryId: req.body.itemDetail[i].inventoryId,
    //       },
    //     }).then((data) => {
    //       if (!data) {
    //         return res.status(400).send("Inventory ID Tidak Ditemukan !");
    //       }
    //     });
    //   }
    // })
    .not()
    .isEmpty()
    .withMessage("Inventory ID Cannot Empty !"),
  body("itemDetail.*.quantity")
    .not()
    .isEmpty()
    .withMessage("Quantity Cannot Empty !")
    .isInt()
    .withMessage("Quantity Harus Angka !"),
  body("itemDetail.*.pricePerUnit")
    .not()
    .isEmpty()
    .withMessage("Price Per Unit Cannot Empty !")
    .isInt()
    .withMessage("Price Per Unit Harus Angka !"),
  body("itemDetail.*.discount")
    .not()
    .isEmpty()
    .withMessage("Discount Cannot Empty !")
    .isInt()
    .withMessage("Discount Harus Angka !"),
];

const purchasePaymentSchema = [
  body("purchaseId").not().isEmpty().withMessage("Purchase ID Cannot Empty !"),
  body("methodId").not().isEmpty().withMessage("Method ID Cannot Empty !"),
  body("date").not().isEmpty().withMessage("Date Cannot Empty !"),
  body("nominal")
    .not()
    .isEmpty()
    .withMessage("Nominal Cannot Empty !")
    .isInt()
    .withMessage("Nominal Harus Angka !"),
  body("code").not().isEmpty().withMessage("Code Cannot Empty !"),
];

const requestValidator = {
  // Validator (Passing Error state)
  validateRequest: validateRequest,
  // Auth
  signupSchema: signupSchema,
  loginSchema: loginSchema,
  // User
  userSchema: userSchema,
  // Supplier
  supplierSchema: supplierSchema,
  // Store
  storeSchema: storeSchema,
  // Inventory
  inventorySchema: inventorySchema,
  // Expense
  expenseSchema: expenseSchema,
  // Purchase
  purchaseSchema: purchaseSchema,
  purchasePaymentSchema,
  purchasePaymentSchema,
};

module.exports = {
  requestValidator,
};
