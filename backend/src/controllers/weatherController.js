const {
  getWeatherByCoordinates,
} = require('../services/weatherService');

async function getWeather(req, res) {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ error: 'Latitude and longitude are required' });
  }

  try {
    const weatherData = await getWeatherByCoordinates(
      latitude,
      longitude
    );
    res.json(weatherData); // Return the weather data to the client
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getWeatherData(req) {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    throw new Error('Latitude and longitude are required');
  }

  try {
    // Fetch weather data (e.g., from an API or database)
    const weatherData = await getWeatherByCoordinates(
      latitude,
      longitude
    );
    return weatherData; // Return the weather data
  } catch (error) {
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
}

module.exports = { getWeather, getWeatherData };
