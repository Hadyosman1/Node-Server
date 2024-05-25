const { Schema, Model } = require("mongoose");

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = new Model("Category", schema);
