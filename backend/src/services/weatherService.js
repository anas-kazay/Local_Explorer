const axios = require("axios");
const { apiKey, baseUrl } = require("../config/weather");

async function getWeatherByCoordinates(latitude, longitude) {
  try {
    const response = await axios.get(baseUrl, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: apiKey,
        units: "metric", // Use "imperial" for Fahrenheit
      },
    });

    return response.data; // Weather data returned from OpenWeatherMap
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    throw new Error("Failed to fetch weather data");
  }
}

module.exports = { getWeatherByCoordinates };
