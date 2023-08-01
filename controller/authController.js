var jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { addAdmin, fetchAdmin } = require("../controller/adminController");
const { addBuyer } = require("../controller/buyerController");
const bcrypt = require("bcrypt");

const signJWT = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_WEB_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, res) => {
  var token = signJWT(user.userId);
  console.log(user, "user");
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + parseInt(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    secure: process.env.NODE_ENV === "development" ? false : true, // this will only valid for HTTPS connection
    httpOnly: process.env.NODE_ENV === "development" ? false : true, // transfer only in http/https protocols
  });

  res.status(200).json({
    status: "success",
    token,
    data: { user },
  });
};

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email: email.toLowerCase(),
      password: hashPassword,
    });

    res.status(200).json({
      status: "success",
      data: { user },
    });

    // Create user in our database
  } catch (error) {
    console.log("error.message : ", error.message);
    res.status(404).json({ status: "error", error: error.message });
  }
};

function validateUser(hash, password) {
  return bcrypt.compare(password, hash);
}

exports.login = async (req, res) => {
  const secretKey = "secretkey";
  try {
    var { email, password } = req.body;

    var users = await User.find();
    console.log("users", users);

    // check if user & email exits
    if (!email || !password) {
      return res
        .status(404)
        .json({ status: "error", error: "please enter email & password" });
    }

    const filteredUser = users.find((item) => item.email == email);
    console.log("filteredUser", filteredUser);

    if (!filteredUser) {
      return res.json({ message: "User not found" });
    }

    try {
      const isUserPasswordMatched = await validateUser(
        filteredUser.password,
        password
      );

      if (isUserPasswordMatched) {
        const user = {
          email,
          password,
        };
        jwt.sign({ user }, secretKey, { expiresIn: "30000s" }, (err, token) => {
          if (err) {
            return res
              .status(500)
              .json({ status: "error", error: "Error signing token" });
          }
          res.json({
            token,
            message: "token",
          });
        });
      } else {
        res.json({
          message: "Password does not match",
        });
      }
    } catch (error) {
      console.log("error.message : ", error.message);
      res
        .status(500)
        .json({ status: "error", error: "Error during password validation" });
    }
  } catch (error) {
    console.log("error.message : ", error.message);
    res.status(404).json({ status: "error", error: error.message });
  }
};

exports.verifyToken = async (req, res, next) => {
  const baererHeader = req.headers["authorization"];
  if (typeof baererHeader !== "undefined") {
    const bearer = baererHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.send({
      message: "Token is invalid",
    });
  }
};

exports.fetchUsers = async (req, res) => {
  try {
    var users = await User.find();
    res.status(200).json({ status: "success", data: users });
  } catch (error) {
    console.log("error.message : ", error.message);
    res.status(404).json({ status: "error", error: error.message });
  }
};
