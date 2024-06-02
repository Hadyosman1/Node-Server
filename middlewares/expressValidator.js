const { body } = require("express-validator");
const addProductValidator = [
  body("title")
    .notEmpty()
    .withMessage("title can't be empty")
    .isLength({ min: 2 })
    .withMessage("title should be greater than 1 digit"),
  body("category")
    .notEmpty()
    .withMessage("category can't be empty")
    .isLength({ min: 2 })
    .withMessage("category should be greater than 1 digit"),
];

module.exports = {
  addProductValidator,
};
