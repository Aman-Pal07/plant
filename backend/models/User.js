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
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          // If no phone number provided, return true (validation passes)
          if (!value || value === "No phone number provided") return true;
          // Otherwise check if it's exactly 10 digits
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
