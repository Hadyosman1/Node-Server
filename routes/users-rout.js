const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  getAllUsers,
  register,
  logIn,
} = require("../controllers/users-controller");

router.route("/").get(verifyToken, getAllUsers);
router.route("/register").post(register);
router.route("/login").post(logIn);

module.exports = router;
