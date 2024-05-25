require("dotenv").config();

const cors = require("cors");

const express = require("express");

const app = express();

app.use(cors());

app.use(express.json());

const mongoose = require("mongoose");
const url = process.env.MONGO_URL;
mongoose
  .connect(url)
  .then(() => {
    console.log("db connected");
  })
  .catch(() => {
    console.log("db not connected");
  });

const productsRouter = require("./routes/products-rout");

app.use("/api/products", productsRouter);

app.all("*", (req, res) => {
  return res.status(404).json({
    status: "Error",
    msg: "not found",
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server runing on port 3000");
});
