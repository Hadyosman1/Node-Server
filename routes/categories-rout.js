const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  addCategory,
  deleteCategory,
  editCategory,
} = require("../controllers/categories-controller");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");

router
  .route("/")
  .get(getAllCategories)
  .post(verifyToken, allowedTo("MANAGER", "ADMIN"), addCategory);

router
  .route("/:id")
  .delete(verifyToken, allowedTo("MANAGER", "ADMIN"), deleteCategory)
  .put(verifyToken, allowedTo("MANAGER", "ADMIN"), editCategory);

module.exports = router;
