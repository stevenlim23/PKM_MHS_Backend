const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config");

// const Model = require("../models");
// const User = Model.User;

// const { errorHandler } = require("../middleware");

verifyToken = (req, res, next) => {
  let token = req.headers["authtoken"];
  if (!token) {
    return res.status(403).send("Tidak Ada Token !");
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send("Tidak ada Akses");
    }

    req.userId = decoded.id;
    req.storeId = decoded.storeId;
    next();
  });
};

// Reference : https://www.bezkoder.com/node-js-jwt-authentication-mysql/

// isAdmin = (req, res, next) => {
//   User.findByPk(req.userId).then((user) => {
//     user.getRoles().then((roles) => {
//       for (let i = 0; i < roles.length; i++) {
//         if (roles[i].name === "admin") {
//           next();
//           return;
//         }
//       }
//       res.status(403).send({
//         message: "Require Admin Role!",
//       });
//       return;
//     });
//   });
// };

const authJwt = {
  verifyToken: verifyToken,
  // isAdmin: isAdmin,
  // isModerator: isModerator,
};
module.exports = authJwt;
