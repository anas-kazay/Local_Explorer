const Preferences = require("../models/preferences");
const { getWeatherData } = require("../controllers/weatherController");

const convertWeatherData = (weatherData) => {
  const { main, weather, dt } = weatherData;

  // Convert temperature to category
  let temperatureCategory;
  if (main.temp <= 10) {
    temperatureCategory = "cold";
  } else if (main.temp >= 25) {
    temperatureCategory = "hot";
  } else {
    temperatureCategory = "medium";
  }

  // Convert time to category based on timestamp
  const hours = new Date(dt * 1000).getHours();
  let timeCategory;
  if (hours >= 5 && hours < 12) {
    timeCategory = "morning";
  } else if (hours >= 12 && hours < 17) {
    timeCategory = "noon";
  } else if (hours >= 17 && hours < 21) {
    timeCategory = "evening";
  } else if (hours >= 21 || hours < 1) {
    timeCategory = "night";
  } else {
    timeCategory = "after midnight";
  }

  // Convert weather condition to category
  const weatherCondition = weather[0].main.toLowerCase();

  return {
    temperature: temperatureCategory,
    weather: weatherCondition,
    time: timeCategory,
  };
};

// Create or Update Preferences
exports.createPreferences = async (req, res) => {
  const { weatherData, activity, placeName, latitude, longitude, address } =
    req.body;

  const { userId } = req.user;
  console.log("address", address);

  try {
    // Check if preference with same placeName already exists
    const existingPreference = await Preferences.findOne({ userId, placeName });

    if (existingPreference) {
      return res.status(400).json({
        message: "A preference for this place already exists",
        preference: existingPreference,
      });
    }

    // Transform weather data
    const transformedData = convertWeatherData(weatherData);

    // Create a new preference entry with transformed data
    const newPreference = new Preferences({
      userId,
      weather: transformedData.weather,
      temperature: transformedData.temperature,
      activity,
      time: transformedData.time,
      placeName,
      latitude,
      longitude,
      address,
    });

    await newPreference.save();
    return res.status(201).json({
      message: "Preference created successfully",
      preference: newPreference,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Preferences for a User
exports.getPreferences = async (req, res) => {
  const { userId } = req.user; // Get userId from JWT token

  try {
    const preferences = await Preferences.find({ userId });

    if (!preferences || preferences.length === 0) {
      return res.status(200).json({
        message: "No preferences found for this user",
        preferences: [],
      });
    }

    return res.status(200).json({
      message: "Preferences retrieved successfully",
      preferences,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Preference by ID
exports.deletePreference = async (req, res) => {
  const { userId } = req.user; // Get userId from JWT token
  const { id } = req.params; // Get preference ID from URL params

  try {
    // Find the preference and ensure it belongs to the current user
    const preference = await Preferences.findOne({ _id: id, userId });

    if (!preference) {
      return res.status(404).json({
        message:
          "Preference not found or you don't have permission to delete it",
      });
    }

    // Delete the preference
    await Preferences.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Preference deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid preference ID format" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getPreferencesByWeather = async (req, res) => {
  const { userId } = req.user; // Get userId from JWT token

  try {
    // Fetch the current weather data using getWeather
    const weatherData = await getWeatherData(req, res);

    // Convert weather data to categories
    const { temperature, weather, time } = convertWeatherData(weatherData);
    console.log("Converted weather data:", { temperature, weather, time });

    // Find preferences based on any of the matching attributes
    const preferences = await Preferences.find({
      userId,
      $or: [{ temperature }, { weather }, { time }],
    });

    if (!preferences || preferences.length === 0) {
      return res.status(200).json({
        message: "No preferences match the current weather conditions",
        preferences: [],
      });
    }

    return res.status(200).json({
      message: "Preferences retrieved successfully based on weather",
      preferences,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
