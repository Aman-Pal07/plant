const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter your name!"],
    },
    email: {
      type: String,
      required: true,
      unique: true, // Only email is unique
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (value) {
          // Check if the phone number is exactly 10 digits
          return /^\d{10}$/.test(value);
        },
        message: "Phone number must be exactly 10 digits.",
      },
    },
    address: {
      type: String,
      default: "Nand nagri",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
