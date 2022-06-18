// Sequelize
const { DataTypes } = require("sequelize");
const { v4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
  const purchasePayment = sequelize.define(
    "tbl_purchase_payment",
    {
      purchasePaymentId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: v4,
      },
      purchaseId: {
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

  return purchasePayment;
};