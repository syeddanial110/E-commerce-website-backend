// const express = require('express');
const mongoose = require("mongoose");
const product = require("../models/ProductModel");
const multer = require("multer");

// Disk storage
const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: Storage,
}).any();

exports.createProduct = async (req, res) => {
  try {
    // const data = await product.create(req.body);
    const dataWithImage = new product({
      title: req.body.title,
      productName: req.body.productName,
      comapnyName: req.body.comapnyName,
      price: req.body.price,
      image: {
        data: req.file.filename,
        contentType: "image/png",
      },
    });
    dataWithImage
      .save()
      .then(() => {
        res.status(200).json({ status: "success", data: { dataWithImage } });
      })
      .catch((error) => {
        console.log(error);
      });
    // console.log(data);
    res.setHeader("content-type", "application/json");
    // res.status(201).json({
    //   status: "succes",
    //   data: { data },
    // });
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
    const data = await product.find().sort({ price: "asc" });
    const filters = req.query;
    // const filteredUsers = data.filter((user) => {
    //   let isValid = true;
    //   for (key in filters) {
    //     console.log(key, user[key], filters[key]);
    //     isValid = isValid && user[key] == filters[key];
    //  }
    //   return isValid;
    // });
    // console.log("filteredUsers",filteredUsers);

    // const data = await product.find().limit(1);
    // const page = product.paginate(
    //   2,
    //   4,
    //   function (error, pageCount, paginatedResults) {
    //     if (error) {
    //       console.error(error);
    //     } else {
    //       console.log("Pages:", pageCount);
    //       console.log(paginatedResults);
    //     }
    //   }
    // );

    console.log("req.query", req.query);

    res.setHeader("content-type", "application/json");
    res.status(200).json({
      status: "success",
      count: data.length,
      // pages:   parseInt(req.query.page, 10),
      // pages: page,
      data: { data },
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
