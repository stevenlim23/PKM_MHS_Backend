// Sequelize
const { DataTypes } = require("sequelize");
const { v4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
  const expense = sequelize.define(
    "tbl_expense",
    {
      expenseId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: v4,
      },
      refNumber: {
        type: DataTypes.INTEGER,
      },
      date: {
        type: DataTypes.DATE,
      },
      name: {
        type: DataTypes.STRING,
      },
      total: {
        type: DataTypes.INTEGER,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return expense;
};