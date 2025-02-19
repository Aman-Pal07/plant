// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToDB = require("./database/db");

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://plant-frontend.onrender.com",
      "https://plantatrees-org-in.onrender.com",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb", timeout: 60000 })); // Increase request timeout to 60 sec

app.use(express.urlencoded({ extended: true }));

// Database connection with error handling
let dbConnection = null;
const connectDatabase = async () => {
  try {
    if (!dbConnection) {
      dbConnection = await connectToDB();
    }
    return dbConnection;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy" });
});

// Wrap routes in async middleware to ensure DB connection
const withDB = (handler) => async (req, res, next) => {
  try {
    await connectDatabase();
    await handler(req, res, next);
  } catch (error) {
    console.error("Route error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Routes with DB connection wrapper
app.use(
  "/api/auth",
  withDB((req, res, next) => {
    require("./routes/auth-routes")(req, res, next);
  })
);

// Error handling
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
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

// Development server
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
