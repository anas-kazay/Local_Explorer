const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  apiKey: process.env.OPEN_WEATHER_API_KEY, // Store this in your .env file
  baseUrl: "https://api.openweathermap.org/data/2.5/weather",
};
