// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToDB = require("./database/db");

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration with multiple origins
const allowedOrigins = [
  "http://localhost:5173", // Development
  "https://your-frontend-domain.vercel.app", // Add your deployed frontend URL here
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectToDB().catch(console.error);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "API is running successfully" });
});

app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Only start the server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
