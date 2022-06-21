const dbConfig = require("../../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

// DB Import Model
db.User = require("./user.model")(sequelize, Sequelize);
db.Auth = require("./auth.model")(sequelize, Sequelize);
db.Store = require("./store.model")(sequelize, Sequelize);
db.Supplier = require("./supplier.model")(sequelize, Sequelize);
db.Inventory = require("./inventory.model")(sequelize, Sequelize);
db.PaymentMethod = require("./paymentMethod.model")(sequelize, Sequelize);
db.Saldo = require("./saldo.model")(sequelize, Sequelize);
db.Expense = require("./expense.model")(sequelize, Sequelize);
// Purchase
db.Purchase = require("./purchase.model")(sequelize, Sequelize);
db.PurchaseDetail = require("./purchaseDetail.model")(sequelize, Sequelize);
db.PurchasePayment = require("./purchasePayment.model")(sequelize, Sequelize);
// Sales
db.Sales = require("./sales.model")(sequelize, Sequelize);
db.SalesDetail = require("./salesDetail.model")(sequelize, Sequelize);
db.SalesPayment = require("./salesPayment.model")(sequelize, Sequelize);

module.exports = db;
