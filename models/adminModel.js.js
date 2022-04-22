const { Schema, model } = require("mongoose");

const adminSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
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


const Admin= new model("admin", adminSchema)

module.exports = Admin
