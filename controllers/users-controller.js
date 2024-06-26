const { User, roles } = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { firebaseStorage } = require("../config/firebase.conofig");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const deletePicFromStorage = require("../utils/deletePicFromStorage");

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

const getSingleUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findOne({ _id: id });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

const getRoles = async (req, res) => {
  try {
    res.status(200).json(roles);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, _id, password } = req.body;

    const newPassword = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { email, _id },
      { $set: { password: newPassword } },
      { new: true }
    );

    if (user) {
      return res
        .status(200)
        .json({ msg: "Password Updated Successfully...", user });
    }

    return res.status(400).json({ msg: "Internal Server Error!" });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

const getSingleUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email }, { __v: false });

    if (user) {
      return res.status(200).json(user);
    }

    return res
      .status(400)
      .json({ msg: "There is no user have this email...!" });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

const register = async (req, res) => {
  let { firstName, lastName, password, email, role } = req.body;

  try {
    let publicUrl;
    if (req.file) {
      const storageRef = ref(
        firebaseStorage,
        `images/${Date.now()}-${req.file.originalname}`
      );

      await uploadBytes(storageRef, req.file.buffer);
      publicUrl = await getDownloadURL(storageRef);
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(400).json({ msg: "user already exists !" });
    }

    password = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      password,
      email,
      role,
      avatar: publicUrl,
    });

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "100 days" }
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
        { email: user.email, id: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "100 days" }
      );

      const data = await User.findOneAndUpdate(
        { email },
        { $set: { token } },
        { new: true }
      );
      return res.status(200).json(data);
    }

    return res.status(400).json({ msg: "wrong email or password" });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

const logOut = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await User.findOne({ _id: id });

    if (data) {
      return res
        .status(201)
        .json({ message: "user logged out successfully..." });
    }

    return res.status(400).json({ msg: "Internal Server Error!" });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

const editUser = async (req, res) => {
  try {
    let publicUrl;

    const user = await User.findById(req.params.id);
    if (req.file) {
      // delete picture from firebase storage
      if (user) {
        deletePicFromStorage(user.avatar);
      }

      const storageRef = ref(
        firebaseStorage,
        `images/${Date.now()}-${req.file.originalname}`
      );

      await uploadBytes(storageRef, req.file.buffer);
      publicUrl = await getDownloadURL(storageRef);
    }

    if (req.body.email) {
      return res.status(400).json({ msg: "you can't edit your email !" });
    }

    if (req.body.password && req.body.oldPassword) {
      const matchedPass = await bcrypt.compare(
        req.body.oldPassword,
        user.password
      );

      if (!matchedPass) {
        return res.status(400).json({ msg: "Wrong Old Password !" });
      }

      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const data = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body, avatar: publicUrl } },
      { new: true }
    );

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    // delete picture from firebase storage
    const user = await User.findById(req.params.id);
    if (user) {
      deletePicFromStorage(user.avatar);
    }

    const data = await User.findByIdAndDelete(req.params.id);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  getRoles,
  getSingleUserByEmail,
  register,
  logIn,
  editUser,
  resetPassword,
  deleteUser,
  logOut,
};
