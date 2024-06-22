const { Schema, model } = require("mongoose");

const validator = require("validator");

const rolesEnum = ["USER", "ADMIN", "MANAGER"];

const schema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Please fill a valid email address"],
  },
  token: {
    type: String,
    unique: false,
    sparse: true,
    required: false,
  },
  role: {
    type: String,
    default: "USER",
    enum: rolesEnum,
  },
  avatar: {
    type: String,
    default:
      "https://firebasestorage.googleapis.com/v0/b/react-e-commerce-55519.appspot.com/o/images%2Fanonymous_user.webp?alt=media&token=f3e71284-9fa5-4529-9ca9-66f09331f1ea",
  },
});

module.exports = { User: model("User", schema), roles: rolesEnum };
