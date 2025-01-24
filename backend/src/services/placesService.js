const axios = require("axios");
const { apiKey, baseUrl } = require("../config/places");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getNearbyPlaces = async (lat, lon, tag, radius = 500, limit = 10) => {
  try {
    const response = await axios.get(baseUrl, {
      params: {
        key: apiKey,
        lat: lat,
        lon: lon,
        tag: tag,
        radius: radius,
        limit: limit,
        format: "json",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching nearby places:",
      error.response ? error.response.data : error.message
    );
    throw new Error(`Error fetching nearby places: ${error.message}`);
  }
};

const getPlacesWithDelay = async (placesRequests) => {
  const results = [];
  for (const request of placesRequests) {
    try {
      const result = await getNearbyPlaces(
        request.lat,
        request.lon,
        request.tag,
        request.radius,
        request.limit
      );
      results.push({ tag: request.tag, data: result });
    } catch (error) {
      console.warn(
        `Failed to fetch places for category '${request.tag}':`,
        error.message
      );
      results.push({
        tag: request.tag,
        data: { message: `Error fetching data for '${request.tag}'` },
      });
    }
    // Add a delay to ensure no more than 2 requests per second
    await delay(600); // 500ms delay (2 requests per second)
  }
  return results;
};

module.exports = {
  getNearbyPlaces,
  getPlacesWithDelay,
};
