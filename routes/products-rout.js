const express = require("express");
const router = express.Router();
const { addProductValidator } = require("../middlewares/expressValidator");

const {
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  addProduct,
} = require("../controllers/products-controller");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");

router
  .route("/")
  .get(getAllProducts)
  .post(
    verifyToken,
    allowedTo("MANAGER", "ADMIN"),
    addProductValidator,
    addProduct
  );

router
  .route("/:id")
  .get(getSingleProduct)
  .put(verifyToken, allowedTo("MANAGER", "ADMIN"), updateProduct)
  .delete(verifyToken, allowedTo("MANAGER", "ADMIN"), deleteProduct);

module.exports = router;
