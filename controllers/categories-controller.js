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

    const categoryName = req.body.name.trim();

    const category = new Category({
      name: `${categoryName[0].toUpperCase()}${categoryName.slice(1)}`,
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const cat = await Category.findOne({ _id: req.params.id });

    if (!cat) {
      return res.status(400).json({ msg: "category not found!" });
    }
    const linkedProduct = await Product.find({ category: cat.name });

    //check if any product has same category before delete
    if (linkedProduct.length !== 0) {
      return res.status(400).json({
        msg: "can't delete this category because there are products associated with it !",
      });
    }

    const data = await Category.deleteOne({ _id: req.params.id });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editCategory = async (req, res) => {
  try {
    const cat = await Category.find({ _id: req.params.id });

    //update product with same category
    await Product.updateMany(
      { category: cat[0].name },
      { $set: { category: req.body.name } }
    );

    //update category
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
