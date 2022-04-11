const { Schema, model } = require("mongoose");
const product = require("./ProductModel");

// console.log("schema:", Schema.schemaName);
// console.log("schema:", { type: Schema.Types.ObjectId});
const reviewsSchema = new Schema(
  {
    // productId: { type: Schema.Types.ObjectId, ref: "product" },
    // _id: [{Schema.ObjectId}],
    description: String,
  },
  {
    timestamps: true,
  }
);

const review = new model("review", reviewsSchema);

module.exports = review;
