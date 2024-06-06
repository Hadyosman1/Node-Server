const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
const {
  getAllUsers,
  register,
  logIn,
  editUser,
  deleteUser,
  logOut,
} = require("../controllers/users-controller");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, "user-" + Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const type = file.mimetype.split("/")[0];
  if (type === "image") {
    cb(null, true);
  } else {
    cb("file must be an image", false);
  }
};

const upload = multer({ storage, fileFilter });

router.route("/").get(verifyToken, getAllUsers);
router.route("/register").post(upload.single("avatar"), register);
router.route("/login").post(logIn);

router.route("/logout/:id").post(verifyToken, logOut);

router
  .route("/:id")
  .put(verifyToken, upload.single("avatar"), editUser)
  .delete(verifyToken, deleteUser);

module.exports = router;
