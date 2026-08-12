const mongoose = require("mongoose");

// Attempts to connect to MongoDB using MONGODB_URI. If no URI is provided,
// or the connection fails (e.g. no local Mongo running during development),
// the app falls back to the in-memory mock data layer in /data so the whole
// product still works end-to-end for demos.
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log("ℹ️  No MONGODB_URI set — running on in-memory mock data layer.");
    global.USE_MOCK_DB = true;
    return;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log("✅ MongoDB connected");
    global.USE_MOCK_DB = false;
  } catch (err) {
    console.warn("⚠️  MongoDB connection failed — falling back to in-memory mock data layer.");
    console.warn(`   Reason: ${err.message}`);
    global.USE_MOCK_DB = true;
  }
}

module.exports = connectDB;
