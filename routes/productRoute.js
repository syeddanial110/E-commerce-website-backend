const express = require('express');
const router= express.Router();
const {upload,createProduct, getAllProducts, deleteProduct,updateProduct,getProduct}= require("../controller/ProductController")

router.post("/", createProduct)
router.get("/", getAllProducts)
router.get("/:productId", getProduct)
router.put("/:productId", updateProduct)
router.delete("/:productId", deleteProduct)


module.exports= router