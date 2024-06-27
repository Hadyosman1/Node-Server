const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
const {
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
router.route("/roles").get(verifyToken, getRoles);
router.route("/register").post(upload.single("avatar"), register);
router.route("/login").post(logIn);

router.route("/get_user_by_email/:email").get(getSingleUserByEmail);
router.route("/logout/:id").post(logOut);
router.route("/reset_password").post(resetPassword);

router
  .route("/:id")
  .get(getSingleUser)
  .put(upload.single("avatar"), editUser)
  .get(getSingleUser)
  .delete(verifyToken, deleteUser);

module.exports = router;
