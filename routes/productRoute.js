const express = require("express");
const router = express.Router();
const {
  upload,
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getProduct,
  searchProduct,
} = require("../controller/ProductController");
const { verifyToken, isTokenVerify } = require("../controller/authController");

router.post("/add", createProduct);
router.get("/search", searchProduct);
router.get("/", getAllProducts);
router.get("/:productId", getProduct);
router.put("/:productId", updateProduct);
router.delete("/:productId", deleteProduct);

module.exports = router;
