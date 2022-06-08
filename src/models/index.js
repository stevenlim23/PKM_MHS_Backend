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
db.Inventory = require("./inventory.model")(sequelize, Sequelize);
db.PaymentMethod = require("./paymentMethod.model")(sequelize, Sequelize);

module.exports = db;