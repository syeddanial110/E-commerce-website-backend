const { Schema, model } = require("mongoose");

const buyerSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "username is required"],
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lower: true,
    },
    displayPicture: {
      type: String,
      default: "default.png",
    },
    userId: {
      type: Schema.ObjectId,
      required: [true, "user id is required!"],
    },
    role: {
      type: String,
      default: "buyer",
    },
    address: {
      country: String,
      city: String,
      street: String,
      state: String,
      zip: String,
    },
  },
  {
    timestamps: true,
  }
);

const Buyer = new model("Buyer", buyerSchema);

module.exports = Buyer;
