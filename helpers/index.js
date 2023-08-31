var jwt = require("jsonwebtoken");

const isTokenVerify = (req, res) => {
  const secretKey = "secretkey";
  return jwt.verify(req.token, secretKey, (err, authData) => {
    console.log("authData", authData);
    if (err) {
      return false;
    } else {
      return true;
    }
  });
};

module.exports = {
  isTokenVerify,
};
