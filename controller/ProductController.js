// const express = require('express');
const mongoose = require("mongoose");
const product = require("../models/ProductModel");
const multer = require("multer");
const { RestData } = require("../models/data");
const { isTokenVerify } = require("../helpers");
var jwt = require("jsonwebtoken");
const helper = require("../helpers/index");

// Disk storage

// const Storage = multer.diskStorage({
//   destination: "uploads",
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

const Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + " - " + file.filename);
  },
});

exports.upload = multer({
  storage: Storage,
});

exports.createProduct = async (req, res) => {
  try {
    // const dataWithImage = new product({
    //   title: req.body.title,
    //   productName: req.body.productName,
    //   comapnyName: req.body.comapnyName,
    //   price: req.body.price,
    //   // image: {
    //   //   data: req.file.filename,
    //   //   contentType: "image/png",
    //   // },
    //   image:req.file
    // });

    // console.log(dataWithImage);
    //   console.log(req.file);
    //  await dataWithImage
    //     .save()
    //     .then(() => {
    //       res.status(200).json({ status: "success", data: { dataWithImage } });
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    const { title, productName, comapnyName, price, description } = req.body;
    if (title && productName && comapnyName && price && description) {
      const data = await product.create(req.body);
      // console.log(data);
      res.setHeader("content-type", "application/json");
      res.status(201).json({
        status: "succes",
        data: { data },
      });
    } else {
      res.setHeader("content-type", "application/json");
      res.status(201).json({
        status: "succes",
        message: "Fill the corect keys",
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "error",
      data: { msg: "error occured" },
    });
    console.log(error.message);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const secretKey = "secretkey";
    const x = helper.isTokenVerify(req, res);
    if (x) {
      const pageNumber = req.query.page || 1;
      const pageSize = 2;

      const data = await product.find().sort({ price: "asc" });
      const filters = req.query;

      product.paginate(
        {},
        { page: pageNumber, limit: pageSize },
        (err, result) => {
          if (err) {
            return res.status(500).json({
              status: "error",
              data: { msg: "Error while paginating products" },
            });
          }
          const { docs, total, limit, page, pages } = result;
          res.json({
            status: "success",
            users: docs,
            total,
            limit,
            page,
            pages,
            data: { data },
            token: "token is verified",
          });
        }
      );
    } else {
      res.json({
        status: false,
        token: "Invalid token",
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "error",
      data: { msg: "error to fetch data" },
    });
    console.log(error.message);
  }
};

exports.searchProduct = async (req, res) => {
  try {
    const filters = req.query;
    const data = await product.find();
    const x = await product.find({
      title: { $regex: new RegExp(filters.filter, "i") },
    });
    console.log("filters", x);

    res.setHeader("content-type", "application/json");
    res.status(200).json({
      status: "success",
      count: data.length,
      // pages:   parseInt(req.query.page, 10),
      // pages: page,
      data: { data },
      // data: RestData,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      data: { msg: "error to fetch data" },
    });
    console.log(error.message);
  }
};

exports.getProduct = async (req, res) => {
  const id = req.params.productId;
  try {
    const specificProduct = await product.findById(id);
    res.status(200).json({
      status: "success",
      data: { specificProduct },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      data: { msg: "something went wrong" },
    });
  }
};

exports.deleteProduct = async (req, res) => {
  const id = req.params.productId;
  console.log(id);
  try {
    const deletedProduct = await product.findByIdAndDelete(id);
    console.log(deletedProduct);
    res.status(200).json({
      status: "success",
      data: {
        deletedProduct,
        msg: `product is successfully deleted with id ${id}`,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      data: { msg: "something went wrong" },
    });
  }
};

exports.updateProduct = async (req, res) => {
  const id = req.params.productId;
  try {
    const { title, productName, comapnyName, price, description } = req.body;
    const updatedProduct = await product.updateOne(
      { _id: id },
      {
        $set: req.body,
      }
    );
    res.status(201).json({
      status: "success",
      data: { updatedProduct },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      data: { msg: "something went wrong" },
    });
  }
};
