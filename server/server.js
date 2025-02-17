// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToDB = require("./database/db");
const authRoutes = require("./routes/auth-routes");

const app = express();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
    credentials: true,
  })
);
app.use(express.json());

// Test route to verify API is working
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

// Mount auth routes
app.use("/api/auth", authRoutes);

// 404 handler - keep this last
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.url, // This will help debug which route was not found
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Only start server if not in production (Vercel handles this in production)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
