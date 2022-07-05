const express = require("express");
const cors = require("cors");

// create express app
const app = express();
// setup the server port
const port = process.env.PORT || 5000;

// parse request data content type application/json
app.use(express.json());
// parse request data content type application/x-www-form-rulencoded
app.use(express.urlencoded({ extended: true }));

// CORS Library (to Prevent Blocked by CORS Policy)
app.use(
  cors({
    origin: "*",
    methods: "*",
  })
);

// import routes
const authRoutes = require("./src/routes/auth.route");
const userRoutes = require("./src/routes/user.route");
const dashboardRoutes = require("./src/routes/dashboard.route");
const storeRoutes = require("./src/routes/store.route");
const supplierRoutes = require("./src/routes/supplier.route");
const inventoryRoutes = require("./src/routes/inventory.route");
const paymentMethodRoutes = require("./src/routes/paymentMethod.route");
const expenseRoutes = require("./src/routes/expense.route");
const purchaseRoutes = require("./src/routes/purchase.route");
const salesRoutes = require("./src/routes/sales.route");
const stockOpnameRoutes = require("./src/routes/stockOpname.route");
// const reportRoutes = require("./src/routes/report.route");

// User Routes
app.use("/user", userRoutes);

// Auth Routes
app.use("/auth", authRoutes);

// Dashboard Routes
app.use("/dashboard", dashboardRoutes);

// Store Routes
app.use("/store", storeRoutes);

// Supplier Routes
app.use("/supplier", supplierRoutes);

// Inventory Routes
app.use("/inventory", inventoryRoutes);

// Payment Method
app.use("/payment-method", paymentMethodRoutes);

// Expense
app.use("/expense", expenseRoutes);

// Purchase
app.use("/purchase", purchaseRoutes);

// Sales
app.use("/sales", salesRoutes);

// Stock Opname
app.use("/stock-opname", stockOpnameRoutes);

// Report
// app.use("/report", reportRoutes);

// Error Routes
app.use((error, req, res, next) => {
  let { message = "Something went wrong", status = 500 } = error;
  if (error.parent && error.parent.errno === 1265) {
    return res.status(400).send("Invalid data, please recheck your data");
  }
  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      msg: error.errors.map((e) => e.message),
    });
  }
  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      success: false,
      msg: error.errors.map((e) => e.message),
    });
  }
  if (error.name === "SequelizeDatabaseError") {
    return res.status(400).json({
      success: false,
      msg: error.errors.map((e) => e.message),
    });
  }

  res.status(status).json({ error: message });
});

// listen to the port
app.listen(port, () => {
  console.log(`NodeJs is running at port ${port}`);
});
