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

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, "product-pic-" + Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const type = file.mimetype.split("/")[0];
  if (type === "image") {
    cb(null, true);
  } else {
    cb("file must be an image", false);
  }
};

const upload = multer({ storage, fileFilter });

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
