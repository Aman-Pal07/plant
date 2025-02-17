const express = require("express");
const { registerUser } = require("../controllers/auth-controller");
const router = express.Router();

//all routes are related to authentication & authorization
router.post("/register", registerUser);

module.exports = router;
