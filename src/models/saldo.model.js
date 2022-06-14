// Sequelize
const { DataTypes } = require("sequelize");
const { v4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
  const saldo = sequelize.define(
    "tbl_saldo",
    {
      saldoId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: v4,
      },
      date: {
        type: DataTypes.DATE,
      },
      value: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return saldo;
};
