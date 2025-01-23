// src/controllers/placesController.js
const placesService = require("../services/placesService");
const { handleError } = require("../utils/errorHandler");

const getNearbyPlaces = async (req, res) => {
  const { lat, lon, tag, radius, limit } = req.query; // Get params from query string

  if (!lat || !lon || !tag) {
    return res
      .status(400)
      .json({ message: "Missing required parameters: lat, lon, tag" });
  }

  try {
    // Call the places service to get nearby places
    const places = await placesService.getNearbyPlaces(
      lat,
      lon,
      tag,
      radius,
      limit
    );
    return res.json(places); // Return the result to the client
  } catch (error) {
    handleError(res, error); // Handle error with a utility function
  }
};

module.exports = {
  getNearbyPlaces,
};
