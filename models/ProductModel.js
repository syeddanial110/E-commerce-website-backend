const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const productSchema = new Schema(
  {
    title: String,
    productName: String,
    comapnyName: String,
    price: String,
    description: String,
    // image:{
    //   data: Buffer,
    //   contentType:String
    // }
    image: String,
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(mongoosePaginate);

const product = new model("product", productSchema);

module.exports = product;
