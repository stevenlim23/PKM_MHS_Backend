// Sequelize
const { DataTypes } = require("sequelize");
const { v4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
  const sales = sequelize.define(
    "tbl_sales",
    {
      salesId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: v4,
      },
      storeId: {
        type: DataTypes.STRING,
      },
      refNumber: {
        type: DataTypes.STRING,
      },
      transDate: {
        type: DataTypes.DATE,
      },
      dueDate: {
        type: DataTypes.DATE,
      },
      dueNominal: {
        type: DataTypes.INTEGER,
      },
      totalPayment: {
        type: DataTypes.INTEGER,
      },
      discount: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
      },
      is_deleted: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return sales;
};
