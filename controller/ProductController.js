// const express = require('express');
const mongoose = require("mongoose");
const product = require("../models/ProductModel");

exports.createProduct = async (req, res) => {
  try {
    const data = await product.create(req.body);
    console.log(data);
    res.setHeader("content-type", "application/json");
    res.status(201).json({
      status: "succes",
      data: { data },
    });
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
    const data = await product.find();
    res.setHeader("content-type", "application/json");
    res.status(200).json({
      status: "success",
      count: data.length,
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

exports.getProduct= async (req,res)=>{
  const id= req.params.productId;
  try {
    const specificProduct= await product.findById(id)
    res.status(200).json({
      status:"success",
      data:{specificProduct}
    })
    
  } catch (error) {
    res.status(404).json({
      status:"error",
      data:{msg:"something went wrong"}
    })
  }

}

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
