const { sendEmail } = require("../helpers/sendEmail");
const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    const { username, email, phone } = req.body;

    console.log("Received registration request:", { username, email, phone }); // Debug log

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

    // Phone Validation - handle all possible cases
    let validatedPhone = "No phone number provided";

    // Only validate phone if it exists and isn't empty
    if (phone) {
      // Convert to string in case it's passed as a number
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

    // Create New User with default address
    const userData = {
      username,
      email,
      phone: validatedPhone,
      address: "Nand nagri",
    };

    console.log("Creating new user with data:", userData); // Debug log

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

    try {
      await sendEmail(
        email,
        "Your OIL CLIMATE ACADEMY Certificate",
        certificateData
      );
      console.log("✅ Certificate email sent successfully");
    } catch (emailError) {
      console.error("⚠️ Error sending certificate email:", emailError);
      // Continue with success response even if email fails
    }

    res.status(201).json({
      success: true,
      message:
        "Registration successful! Certificate has been sent to your email.",
    });
  } catch (error) {
    console.error("❌ Error occurred during registration:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: "An error occurred during registration. Please try again.",
    });
  }
};

module.exports = { registerUser };

// const { sendEmail } = require("../helpers/sendEmail");
// const { sendSMS } = require("../helpers/sendSMS");
// const User = require("../models/User");

// const registerUser = async (req, res) => {
//   try {
//     const { username, email, phone } = req.body;

//     console.log("Received registration request:", { username, email, phone }); // Debug log

//     // Input Validation
//     if (!username || !email) {
//       return res.status(400).json({
//         success: false,
//         message: "Username and email are required.",
//       });
//     }

//     // Email Validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid email format.",
//       });
//     }

//     // Phone Validation
//     let validatedPhone = null;
//     if (phone) {
//       const phoneStr = phone.toString().trim();
//       if (phoneStr.length > 0) {
//         if (!/^\d{10}$/.test(phoneStr)) {
//           return res.status(400).json({
//             success: false,
//             message: "Phone number must be exactly 10 digits.",
//           });
//         }
//         validatedPhone = phoneStr;
//       }
//     }

//     // Check for Existing User
//     const checkExistingEmail = await User.findOne({ email });
//     if (checkExistingEmail) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is already registered. Please use a different email.",
//       });
//     }

//     // Create New User with default address
//     const userData = {
//       username,
//       email,
//       phone: validatedPhone,
//       address: "Nand nagri",
//     };

//     console.log("Creating new user with data:", userData); // Debug log

//     const newUser = new User(userData);
//     await newUser.save();

//     console.log("✅ New user created successfully with ID:", newUser._id);

//     // Prepare certificate data
//     const certificateData = {
//       name: username,
//       email,
//       certificateId: newUser._id.toString(),
//       registrationDate: new Date().toLocaleDateString(),
//     };

//     try {
//       await sendEmail(
//         email,
//         "Your OIL CLIMATE ACADEMY Certificate",
//         certificateData
//       );
//       console.log("✅ Certificate email sent successfully");
//     } catch (emailError) {
//       console.error("⚠️ Error sending certificate email:", emailError);
//     }

//     // Send SMS if phone number is provided
//     if (validatedPhone) {
//       const smsMessage = `Hello ${username},

// Thank you for attending the Townhall Meeting on Oil's Environmental Strategy held on 19th February 2025 at Duliajan Club, Assam. We truly appreciate your participation and commitment to a sustainable future.

// As a token of our appreciation, we are pleased to present you with an e-plant gift, symbolizing our shared dedication to environmental stewardship.

// Please check your email for your Token of our Gratitude and more details!

// Looking forward to our continued journey toward a carbon-neutral future!

// Best regards,
// Team HSE & ESG`;

//       await sendSMS(`+91${validatedPhone}`, smsMessage);
//     }

//     res.status(201).json({
//       success: true,
//       message:
//         "Registration successful! Certificate has been sent to your email.",
//     });
//   } catch (error) {
//     console.error("❌ Error occurred during registration:", error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred during registration. Please try again.",
//     });
//   }
// };

// module.exports = { registerUser };
