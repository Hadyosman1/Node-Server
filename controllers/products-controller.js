const { validationResult } = require("express-validator");
const Product = require("../models/productModal.js");
const { firebaseStorage } = require("../config/firebase.conofig");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const deletePicFromStorage = require("../utils/deletePicFromStorage.js");

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
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const data = await Product.findOne({ _id: req.params.id }, { __v: false });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    if (req.file) {
      // delete picture from firebase storage
      const product = await Product.findById(req.params.id);
      if (product) {
        deletePicFromStorage(product.image);
      }

      const storageRef = ref(
        firebaseStorage,
        `images/${Date.now()}-${req.file.originalname}`
      );

      await uploadBytes(storageRef, req.file.buffer);
      const publicUrl = await getDownloadURL(storageRef);
      req.body.image = publicUrl;
    }

    const data = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: { ...req.body },
      },
      { new: true }
    );
    res.status(202).json(data);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const addProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  try {
    if (req.file) {
      const storageRef = ref(
        firebaseStorage,
        `images/${Date.now()}-${req.file.originalname}`
      );

      await uploadBytes(storageRef, req.file.buffer);
      const publicUrl = await getDownloadURL(storageRef);
      req.body.image = publicUrl;
    }

    const newProduct = new Product(req.body);
    const data = await newProduct.save();
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    // delete picture from firebase storage
    const product = await Product.findById(req.params.id);
    if (product) {
      deletePicFromStorage(product.image);
    }

    const data = await Product.findByIdAndDelete(req.params.id);
    res.status(202).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  addProduct,
};
