// src/routes/placesRoutes.js
const express = require("express");
const placesController = require("../controllers/placesController");

const router = express.Router();

// Define the route to get nearby places
router.get("/nearby", placesController.getNearbyPlaces);

module.exports = router;
