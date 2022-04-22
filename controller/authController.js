var jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { addAdmin, fetchAdmin } = require("../controller/adminController");
const { addBuyer } = require("../controller/buyerController");

const signJWT = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_WEB_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, res) => {
  var token = signJWT(user.userId);
    console.log(user,"user");
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
    var user = await User.create(req.body);

    let profile = {
      userName: user.userName,
      email: user.email,
      userId: user._id,
    };

    let userProfile = null;

    if (user.role === "admin") {
      userProfile = await addAdmin(profile);
    }
    if (user.role === "buyer") {
      userProfile = await addBuyer(profile);
    }

    createAndSendToken(userProfile, res);
  } catch (error) {
    console.log("error.message : ", error.message);
    res.status(404).json({ status: "error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    var { email, password } = req.body;
    // check if user & email exits
    if (!email || !password) {
      return res
        .status(404)
        .json({ status: "error", error: "please enter email & password" });
    }

    // fetch user whose email is given

    // var user = await User.findOne({ email });
    // yahan pa hum na .select('+password') is lia use kia hai kun ka hum password ki field chah rahe hain response ma jo ka DB ma save hai for password verification purpose but hum na User model ka ander password field ma aak check lagaya howa hai
    // select false ka to usko override karna ka lia hum na asa kia

    var user = await User.findOne({ email }).select("+password");
    console.log(user,"user");
    // verify password
    // var passwordVerified = await bcrypt.compare(password, user.password);
    if (!(await user.passwordVerification(password, user.password)) || !user) {
      return res
        .status(401)
        .json({ status: "error", error: "invalid email or password" });
    }

    var userProfile = null;

    if (user.role === "admin") userProfile = await fetchAdmin(user._id);
    if (user.role === "buyer") userProfile = await fetchBuyer(user._id);

    // createAndSendToken(user, res);
    createAndSendToken(userProfile, res);
  } catch (error) {
    console.log("error.message : ", error.message);
    res.status(404).json({ status: "error", error: error.message });
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
