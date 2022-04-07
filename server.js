require("dotenv").config();
const productRoute = require("./routes/productRoute");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const cors = require("cors");

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Successfully connected with mongoose");
  })
  .catch((error) => {
    console.log("Mongoose connection error", error);
  });

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/products", productRoute);

app.listen(PORT, () => {
  console.log(`Server is successfully running at http://localhost:${PORT}`);
});
