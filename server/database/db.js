const mongoose = require("mongoose");
const User = require("../models/User");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");

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
  } catch (e) {
    console.error("❌ MongoDB connection failed:", e);
    process.exit(1);
  }
};

module.exports = connectToDB;
