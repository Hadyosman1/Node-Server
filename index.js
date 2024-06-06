require("dotenv").config();
const url = process.env.MONGO_URL;
const port = process.env.PORT;
const cors = require("cors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
const usersRouter = require("./routes/users-rout");

app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/users", usersRouter);

app.get("/", (req, res) => {
  res.send(`
  <h1 style="
  text-align:center;
  color:orange;
  font:900 2rem Arial;
  ">
  my first api => { E-commerce Api }
  </h1>
  `);
});

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "Error",
    msg: "Not Found",
  });
  next();
});

app.listen(port || 3000, () => {
  console.log(`server runing on port ${port}`);
});
