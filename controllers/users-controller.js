const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
  const limit = req.query.limit;
  const page = req.query.page;
  const skip = (page - 1) * limit;

  try {
    let users;

    if (limit || page) {
      users = await User.find({}, { __v: false, password: false })
        .limit(limit)
        .skip(skip);
    } else {
      users = await User.find({}, { __v: false, password: false });
    }
    res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

const register = async (req, res) => {
  let { firstName, lastName, password, email } = req.body;
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(400).json({ msg: "user already exists !" });
    }

    password = await bcrypt.hash(password, 10);

    const newUser = new User({ firstName, lastName, password, email });

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "120d" }
    );

    newUser.token = token;

    const data = await newUser.save();

    return res.status(201).json(data);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    const matchedPass = await bcrypt.compare(password, user.password);

    if (user && matchedPass) {
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "120d" }
      );

      return res.status(200).json({ token });
    }

    return res.status(400).json({ msg: "wrong email or password" });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getAllUsers,
  register,
  logIn,
};
