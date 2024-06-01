const { body, validationResult } = require("express-validator");

const Product = require("../models/productModal.js");

//get all products
const getAllProducts = async (req, res) => {
  const limit = req.query.limit;
  const page = req.query.page;
  const skip = (page - 1) * limit;

  try {
    let products;
    if (limit || page) {
      products = await Product.find({}, { __v: false }).limit(limit).skip(skip);
    } else {
      products = await Product.find({}, { __v: false });
    }
    res.json(products);
  } catch (error) {
    res.status(400).json(error);
  }
};

// get single product
const getSingleProduct = async (req, res) => {
  try {
    const data = await Product.findOne({ _id: req.params.id }, { __v: false });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};

//updata product
const updateProduct = async (req, res) => {
  try {
    const data = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: { ...req.body },
      },
      { new: true }
    );
    res.status(202).json(data);
  } catch (error) {
    res.status(404).json(error);
  }
};

//add product
const addProduct = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  try {
    const newProduct = new Product(req.body);
    const data = await newProduct.save();
    console.log(data);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//delete product
const deleteProduct = async (req, res) => {
  try {
    const data = await Product.findByIdAndDelete(req.params.id);
    res.status(202).json(data);
  } catch (e) {
    res.status(400).json(e);
  }
};

const addProductValidator = [
  body("title")
    .notEmpty()
    .withMessage("title can't be empty")
    .isLength({ min: 2 })
    .withMessage("title should be greater than 1 digit"),
  body("category")
    .notEmpty()
    .withMessage("category can't be empty")
    .isLength({ min: 2 })
    .withMessage("category should be greater than 1 digit"),
];
module.exports = {
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  addProduct,
  addProductValidator,
};
