require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToDB = require("./database/db");
const authRoutes = require("./routes/auth-routes");

connectToDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from frontend running on this URL
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is now listening on PORT ${PORT}`);
});
