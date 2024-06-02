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

router.route("/").get(getAllProducts).post(addProductValidator, addProduct);

router
  .route("/:id")
  .get(getSingleProduct)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
