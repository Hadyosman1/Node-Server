const { Schema, model } = require("mongoose");

const validator = require("validator");

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
  },
  role: {
    type: String,
    default: "USER",
    enum: ["USER", "ADMIN", "MANAGER"],
  },
});

module.exports = model("User", schema);
