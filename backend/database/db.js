// database/db.js
const mongoose = require("mongoose");
const User = require("../models/User");

let isConnected = false;

const connectToDB = async () => {
  if (isConnected) {
    console.log("📡 Using existing database connection");
    return;
  }

  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    isConnected = true;
    console.log("✅ MongoDB connected successfully");

    // Index management
    try {
      // Check existing indexes
      const indexes = await User.collection.indexes();

      // Drop unique index on username if it exists
      if (indexes.some((index) => index.name === "username_1")) {
        await User.collection.dropIndex("username_1");
        console.log("✅ Dropped unique index on username");
      }

      // Drop unique index on phone if it exists
      if (indexes.some((index) => index.name === "phone_1")) {
        await User.collection.dropIndex("phone_1");
        console.log("✅ Dropped unique index on phone");
      }

      // Sync indexes to only keep email as unique
      await User.syncIndexes();
      console.log("✅ Indexes synchronized successfully");
    } catch (indexError) {
      console.error("⚠️ Index management error:", indexError);
      // Don't exit process on index error, just log it
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    isConnected = false;

    // In production, don't exit the process
    if (process.env.NODE_ENV === "development") {
      process.exit(1);
    } else {
      throw error; // Let the error be handled by the route error handler
    }
  }
};

// Handle connection events
mongoose.connection.on("connected", () => {
  isConnected = true;
  console.log("🔗 MongoDB connection established");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
  isConnected = false;
});

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  console.log("❌ MongoDB disconnected");
});

// Clean up on application termination
process.on("SIGINT", async () => {
  if (isConnected) {
    await mongoose.connection.close();
    console.log("MongoDB connection closed through app termination");
    process.exit(0);
  }
});

module.exports = connectToDB;
