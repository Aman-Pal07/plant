// 📁 controllers/userController.js

const { sendEmail } = require("../helpers/sendEmail");
const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    const { username, email, phone, address } = req.body;

    // Input Validation
    if (!username || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and phone are required.",
      });
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    // Phone Validation
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be exactly 10 digits.",
      });
    }

    // Check for Existing User
    const checkExistingEmail = await User.findOne({ email });
    if (checkExistingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered. Please use a different email.",
      });
    }

    // Create New User
    const newUser = new User({
      username,
      email,
      phone,
      address: address || "Nand nagri",
    });
    await newUser.save();
    console.log("✅ New user created successfully!");

    // Prepare certificate data
    const certificateData = {
      name: username,
      email,
      phone,
      certificateId: newUser._id.toString(),
      registrationDate: new Date().toLocaleDateString(),
    };

    // Send Certification Email with PDF
    await sendEmail(
      email,
      "Your OIL CLIMATE ACADEMY Certificate",
      certificateData
    );

    res.status(201).json({
      success: true,
      message:
        "Registration successful! Certificate has been sent to your email.",
    });
  } catch (error) {
    console.error("❌ Error occurred during registration:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred! Please try again.",
    });
  }
};

module.exports = { registerUser };
