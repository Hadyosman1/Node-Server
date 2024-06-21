const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  getSingleUserByEmail,
  register,
  logIn,
  editUser,
  deleteUser,
  logOut,
} = require("../controllers/users-controller");

const multer = require("multer");
const fileFilter = (req, file, cb) => {
  const type = file.mimetype.split("/")[0];
  if (type === "image") {
    cb(null, true);
  } else {
    cb("file must be an image", false);
  }
};
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
});

router.route("/").get(verifyToken, getAllUsers);
router.route("/register").post(upload.single("avatar"), register);
router.route("/login").post(logIn);

router.route("/logout/:id").post(logOut);
router.route("/forgetpassword").get(getSingleUserByEmail);

router
  .route("/:id")
  .get(getSingleUser)
  .put(upload.single("avatar"), editUser)
  .delete(verifyToken, deleteUser);

module.exports = router;
