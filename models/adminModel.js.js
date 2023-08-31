const { hash } = require("bcrypt");
const { Schema, model } = require("mongoose");

const adminSchema = new Schema(
  {
    name: {
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
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = new model("admin", adminSchema);

module.exports = Admin;
