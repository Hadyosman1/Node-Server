const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  addCategory,
  deleteCategory,
  editCategory,
} = require("../controllers/categories-controller");

router.route("/").get(getAllCategories).post(addCategory);

router.route("/:id").delete(deleteCategory).put(editCategory);

module.exports = router;
