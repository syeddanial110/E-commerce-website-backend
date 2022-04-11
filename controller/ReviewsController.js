const { set } = require("express/lib/application");
const mongoose = require("mongoose");
const review = require("../models/ReviewsModel");

exports.createReviews = async (req, res) => {
  try {
    const data = await review.create(req.body);
    res.setHeader("content-type", "application/json");
    res.status(201).json({ status: "success", data: { data } });
  } catch (error) {
    console.log(error);
    res
      .status(201)
      .json({ status: "error", data: { msg: `${error.message}` } });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const data = await review.find();
    res.setHeader("content-type", "application/json");
    res.status(200).json({ status: "success", data: { data } });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", data: { msg:`${error.message}` } });
  }
};
