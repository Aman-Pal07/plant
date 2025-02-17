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
    origin: "https://plant-x14y-20r77kooh-aman-creations-projects.vercel.app/",
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is now listening on PORT ${PORT}`);
});
