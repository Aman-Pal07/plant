const express = require("express");
const { registerUser } = require("../controllers/auth-controller");
const router = express.Router();

//all routes are related to authentication & authorization
router.post("/register", registerUser);

// Add a test route in auth routes
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes are working" });
});

module.exports = router;
