const Model = require("../models");
const config = require("../../config/auth.config");

const Auth = Model.Auth;
const Store = Model.Store;
const User = Model.User;

Store.hasOne(Auth, { foreignKey: "storeId" });
Auth.belongsTo(Store, { foreignKey: "storeId" });

// Encrypt Library
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper
const { errorHandler } = require("../middleware");

// get all user list
exports.loginUser = errorHandler.wrapAsync(async (req, res) => {
  const loginData = req.body;

  const user = await Auth.findOne({
    include: [
      {
        model: Store,
      },
    ],
    where: {
      email: loginData.email,
    },
  });

  // check password
  bcrypt.compare(loginData.password, user.password, (bErr, bResult) => {
    // wrong password
    if (bErr) {
      return res.status(401).send("Password Tidak Sesuai !");
    }

    if (bResult) {
      const authToken = jwt.sign(
        { id: user.userId, storeId: user.storeId },
        config.secret,
        {
          expiresIn: "24h",
        }
      );

      return res.status(200).send({
        msg: "Login Berhasil !",
        authToken,
        user: {
          userId: user.userId,
          name: user.firstName + " " + user.lastName,
          email: user.email,
          storeId: user.storeId,
          is_setup: user.tbl_store ? user.tbl_store.setup : 0,
        },
      });
    }

    return res.status(401).send("Username atau password Tidak Sesuai !");
  });
});

exports.signupUser = errorHandler.wrapAsync(async (req, res) => {
  const newUserData = req.body;
  var lastStoreId = null;

  // Validate request
  if (!Object.keys(newUserData).length) {
    return res.status(400).send("Bad Request!");
  } else {
    await Store.create().then((result) => {
      lastStoreId = result.storeId;
    });

    const newData = {
      ...newUserData,
      password: bcrypt.hashSync(req.body.password, 8),
      storeId: lastStoreId,
    };

    await User.create(newData);

    await res.send("Registrasi Berhasil");
  }
});
