// Sequelize
const { DataTypes } = require("sequelize");
const { v4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
  const paymentMethod = sequelize.define(
    "tbl_payment_method",
    {
      methodId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: v4,
      },
      name: {
        type: DataTypes.STRING,
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

  return paymentMethod;
};
