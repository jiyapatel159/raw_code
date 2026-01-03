const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },
    phone:{
      type: String,
      default:''
    },
    address:{
      type: String,
      default:''
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
