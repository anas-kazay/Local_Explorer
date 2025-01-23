// src/server.js
const app = require("./app"); // Import app.js
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config(); // Ensure environment variables are loaded before using them

// Log environment variables to verify they're loaded correctly
console.log("Loaded environment variables:");
console.log("LOCATIONIQ_API_KEY:", process.env.LOCATIONIQ_API_KEY); // Log the API key
console.log("OPENWEATHER_API_KEY:", process.env.OPEN_WEATHER_API_KEY); // Log the API key

const PORT = process.env.PORT || 3000; // Default port is 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
