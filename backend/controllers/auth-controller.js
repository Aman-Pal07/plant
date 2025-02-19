const { sendEmail } = require("../helpers/sendEmail");
const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    const { username, email, phone } = req.body;

    console.log("Received registration request:", { username, email, phone });

    // Input Validation
    if (!username || !email) {
      return res.status(400).json({
        success: false,
        message: "Username and email are required.",
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
    let validatedPhone = "No phone number provided";
    if (phone) {
      const phoneStr = phone.toString().trim();
      if (phoneStr.length > 0) {
        if (!/^\d{10}$/.test(phoneStr)) {
          return res.status(400).json({
            success: false,
            message: "Phone number must be exactly 10 digits.",
          });
        }
        validatedPhone = phoneStr;
      }
    }

    // Check for Existing User
    const checkExistingEmail = await User.findOne({ email });
    if (checkExistingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered. Please use a different email.",
      });
    }

    // Create New User (without address)
    const userData = {
      username,
      email,
      phone: validatedPhone, // Address is not included
    };

    console.log("Creating new user with data:", userData);

    const newUser = new User(userData);
    await newUser.save();

    console.log("✅ New user created successfully with ID:", newUser._id);

    // Prepare certificate data
    const certificateData = {
      name: username,
      email,
      certificateId: newUser._id.toString(),
      registrationDate: new Date().toLocaleDateString(),
    };

    // Email subject
    const subject = `Certificate of Appreciation – OIL’s Environmental Strategy Townhall`;

    try {
      await sendEmail(email, subject, certificateData);
      console.log("✅ Certificate email sent successfully");
    } catch (emailError) {
      console.error("⚠️ Error sending certificate email:", emailError);
    }

    res.status(201).json({
      success: true,
      message:
        "Registration successful! Certificate has been sent to your email.",
    });
  } catch (error) {
    console.error("❌ Error occurred during registration:", error);

    res.status(500).json({
      success: false,
      message: "An error occurred during registration. Please try again.",
    });
  }
};

module.exports = { registerUser };
