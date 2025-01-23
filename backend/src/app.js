const express = require("express");
const app = express();
const cors = require("cors");
const weatherRoutes = require("./routes/weatherRoutes");
const placesRoutes = require("./routes/placesRoutes");
const suggestionRoutes = require("./routes/suggestionRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const preferencesRoutes = require("./routes/preferencesRoutes"); // Import preferences routes

const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables from .env file
dotenv.config();

// Middleware
app.use(express.json()); // For parsing application/json

// const corsOptions = {
//   origin: "http://localhost:8080", // Allow requests from the frontend (host machine)
//   optionsSuccessStatus: 200,
// };
app.use(cors()); // Allow cross-origin requests

// Define Routes
app.use("/api/weather", weatherRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/suggestion", suggestionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/preferences", preferencesRoutes); // Add preferences routes

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

// Simple Route to Check if App is Running
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

module.exports = app;
