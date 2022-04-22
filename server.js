require("dotenv").config();
const productRoute = require("./routes/productRoute");
const ReviewsRoute = require("./routes/ReviewsRoute");
const authRoute = require("./routes/authRoute");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser= require("body-parser")

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
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}))

app.get("/", (req, res) => {
//  res.sendFile(__dirname+ '/index.html')

  res.send("Hello World")
});

app.use("/api/products", productRoute);
app.use("/api/reviews", ReviewsRoute);
app.use("/api/auth", authRoute )



app.listen(PORT, () => {
  console.log(`Server is successfully running at http://localhost:${PORT}`);
});
