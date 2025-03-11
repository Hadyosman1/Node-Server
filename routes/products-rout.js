const express = require("express");
const router = express.Router();
const { addProductValidator } = require("../middlewares/expressValidator");

const {
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  addProduct,
  getProductsCount,
} = require("../controllers/products-controller");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const upload = require("../middlewares/multer");

router
  .route("/")
  .get(getAllProducts)
  .post(
    verifyToken,
    allowedTo("MANAGER", "ADMIN"),
    upload.single("image"),
    addProductValidator,
    addProduct
  );

router.route("/count").get(getProductsCount);

router
  .route("/:id")
  .get(getSingleProduct)
  .put(
    verifyToken,
    allowedTo("MANAGER", "ADMIN"),
    upload.single("image"),
    updateProduct
  )
  .delete(verifyToken, allowedTo("MANAGER", "ADMIN"), deleteProduct);

module.exports = router;
