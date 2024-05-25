const Product = require("../models/productModal");
const Category = require("../models/categoriesModal");

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}, { __v: false });
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const addCategory = async (req, res) => {
  try {
    const oldCat = await Category.findOne(req.body);

    if (oldCat) {
      throw new Error("category already exists!");
    }

    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const data = await Category.deleteOne({ _id: req.params.id });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editCategory = async (req, res) => {
  try {
    const data = await Category.findByIdAndUpdate(
      req.params.id,
      {
        $set: { ...req.body },
      },
      { new: true }
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getAllCategories,
  addCategory,
  deleteCategory,
  editCategory,
};
