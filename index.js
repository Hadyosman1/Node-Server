require("dotenv").config();

const cors = require("cors");

const express = require("express");

const app = express();

app.use(cors());

app.use(express.json());

const mongoose = require("mongoose");
const url = process.env.MONGO_URL;
const port = process.env.PORT;
mongoose
  .connect(url)
  .then(() => {
    console.log("db connected");
  })
  .catch(() => {
    console.log("db not connected");
  });

const productsRouter = require("./routes/products-rout");
const categoriesRouter = require("./routes/categories-rout");

app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);

app.get("/", (req, res) => {
  res.send(`
  <h1 style="
  text-align:center;
  color:orange;
  font:900 2rem Arial;
  ">
  my first api => { E-commerce Api }</h1>
  `);
});

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "Error",
    msg: "not found",
  });
  next();
});

app.listen(port || 3000, () => {
  console.log(`server runing on port ${port}`);
});
