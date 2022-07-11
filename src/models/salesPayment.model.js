// Sequelize
const { DataTypes } = require("sequelize");
const { v4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
  const salesPayment = sequelize.define(
    "tbl_sales_payment",
    {
      salesPaymentId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: v4,
      },
      salesId: {
        type: DataTypes.STRING,
      },
      storeId: {
        type: DataTypes.STRING,
      },
      methodId: {
        type: DataTypes.STRING,
      },
      date: {
        type: DataTypes.DATE,
      },
      nominal: {
        type: DataTypes.INTEGER,
      },
      code: {
        type: DataTypes.INTEGER,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return salesPayment;
};
