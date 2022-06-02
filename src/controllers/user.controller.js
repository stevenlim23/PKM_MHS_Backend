const Model = require("../models");
const User = Model.User;

// Library
const bcrypt = require("bcryptjs");

const fieldAttributes = [
  "userId",
  "storeId",
  "roleId",
  "firstName",
  "lastName",
  "email",
  "address",
  "contact",
  "profile",
];

// Helper
const { errorHandler } = require("../middleware");

// get all user list
exports.getUserList = errorHandler.wrapAsync(async (req, res) => {
  const user = await User.findAll({
    where: {
      is_deleted: 0,
    },
    attributes: fieldAttributes,
  });

  if (!user.length)
    throw new errorHandler.ExpressError(404, "User Tidak Ditemukan");

  res.send(user);
});

// get user by ID
exports.getUserById = errorHandler.wrapAsync(async (req, res) => {
  const { id } = req.params;
  const userById = await User.findOne({
    where: {
      userId: id,
      is_deleted: 0,
    },
    attributes: fieldAttributes,
  });

  if (!userById)
    throw new errorHandler.ExpressError(404, "User Tidak Ditemukan");

  res.send(userById);
});

exports.createNewUser = errorHandler.wrapAsync(async (req, res) => {
  const newUserData = req.body;

  // Validate request
  if (!Object.keys(newUserData).length) {
    throw new errorHandler.ExpressError(400, "Bad Request");
  } else {
    const newData = {
      ...newUserData,
      password: bcrypt.hashSync(req.body.password, 8),
    };

    User.create(newData);

    res.send("User Berhasil Dibuat");
  }
});

exports.updateUser = errorHandler.wrapAsync(async (req, res) => {
  const { id } = req.params;
  const updatedUserData = req.body;

  // Validate request
  if (!Object.keys(updatedUserData).length) {
    throw new errorHandler.ExpressError(400, "Bad Request");
  } else {
    const newData = {
      ...updatedUserData,
      password: bcrypt.hashSync(req.body.password, 8),
    };

    User.update(newData, { where: { userId: id } }).then((data) => {
      if (data == 1) {
        res.send("User Berhasil Diupdate");
      } else {
        res.status(400).send({
          message: "Akun Gagal Diupdate",
        });
      }
    });
  }
});

exports.deleteUser = errorHandler.wrapAsync(async (req, res) => {
  const { id } = req.params;

  User.update({ is_deleted: 1 }, { where: { userId: id, is_deleted: 0 } }).then(
    (data) => {
      if (data == 1) {
        res.send("User Berhasil dihapus");
      } else {
        res.status(400).send({
          message: "User Gagal Dihapus",
        });
      }
    }
  );
});
