const { getWeatherByCoordinates } = require("../services/weatherService");
const { getNearbyPlaces } = require("../services/placesService");
const { generateSuggestion } = require("../services/openaiService");
const { getAddressFromCoordinates } = require("../services/locationService");
const { CATEGORIES } = require("../config/places");

async function getSuggestion(req, res) {
  const { userId } = req.user;
  const { latitude, longitude, radius = 5000 } = req.body;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  try {
    // Get address from coordinates
    const address = await getAddressFromCoordinates(latitude, longitude);

    // Get weather data
    const weatherData = await getWeatherByCoordinates(latitude, longitude);

    // Get places for each category with delay
    const placesByCategory = {};
    for (const category of CATEGORIES) {
      try {
        const places = await new Promise((resolve, reject) => {
          setTimeout(async () => {
            try {
              const result = await getPlacesWithDelay(
                latitude,
                longitude,
                category,
                radius, // 5km radius
                5 // limit to 5 places
              );
              resolve(result);
            } catch (err) {
              reject(err);
            }
          }, 600); // 600ms delay
        });

        placesByCategory[category] = places;
      } catch (error) {
        console.warn(
          `Failed to fetch places for category '${category}':`,
          error.message
        );
      }
    }

    const suggestion = await generateSuggestion(
      userId,
      weatherData,
      placesByCategory
    );

    // Return suggestion with address included
    res.json({
      suggestion: {
        ...suggestion,
        address,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getSuggestion,
};
