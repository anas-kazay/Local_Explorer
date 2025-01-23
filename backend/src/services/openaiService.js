const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getTemperatureCategory, getTimeOfDay } = require("../utils/timeUtils");
const Preferences = require("../models/preferences");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const suggestionHistory = {};

async function generateSuggestion(userId, weatherData, placesByCategory) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const history = getSuggestionHistory(userId);
    const userPreferences = await getPreferencesByWeatherMethod(
      userId,
      weatherData
    );

    const prompt = `Analyze the following weather conditions, user preferences, and nearby places to provide ONE personalized recommendation:
**Current Weather:**
- Temperature: ${weatherData.main.temp}°C (${getTemperatureCategory(
      weatherData.main.temp
    )})
- Conditions: ${weatherData.weather[0].description}
- Humidity: ${weatherData.main.humidity}%
- Wind Speed: ${weatherData.wind.speed} m/s
- Feels Like: ${weatherData.main.feels_like}°C
- Time of Day: ${getTimeOfDay(weatherData.dt, weatherData.timezone)}

${
  userPreferences.length > 0
    ? "**User Preferences:**\n" +
      userPreferences
        .map(
          (p) =>
            `- Prefers ${p.activity} during ${p.weather} weather at ${p.time} (${p.temperature})`
        )
        .join("\n")
    : ""
}

**Available Places within 5km:**
${formatPlacesWithCategories(placesByCategory)}

**Previous Suggestions (DO NOT REPEAT THESE):**
${
  history.length > 0
    ? history.map((s) => `- ${s.name} (${s.tag})`).join("\n")
    : "None"
}

**DO NOT GIVE SUGGESTIONS WITH THESE TAGS:**
${
  history.length > 0
    ? Array.from(new Set(history.map((s) => s.tag)))
        .map((tag) => `- (${tag})`)
        .join("\n")
    : "None"
}

**Recommendation Guidelines:**
1. Prioritize user preferences when relevant to current conditions
2. Select ONE best option considering all factors
3. Never suggest places from previous suggestions
4. Match place tags to weather conditions and preferences:
   - café/restaurant for cold/rainy or user preferences
   - beach/pool for hot days or user preferences
   - park/viewpoints for mild weather or user preferences
5. Suggest opening time based on type:
   - Restaurants/cafes: Appropriate meal times
   - Nature spots: Best daylight hours for current weather
6. Consider current time zone (${weatherData.timezone})

**Required Response Format:**
{
  "name": "Place Name",
  "distance": 0.27,
  "tag": "cafe",
  "activity_to_do": "Relaxing in a cozy cafe",
  "reason": "Combined weather and preference justification",
  "position": {
    "lat": 40.7481846,
    "lon": -73.985687
  },
  "suggestedTime": "8:00-22:00"
}`;

    const result = await model.generateContent(prompt);
    const responseText = (await result.response.text())
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const suggestion = JSON.parse(responseText);

    // Validate response
    if (!validateSuggestion(suggestion, placesByCategory)) {
      throw new Error("Invalid suggestion format from AI");
    }

    // Update suggestion history
    addToSuggestionHistory(userId, suggestion);

    return suggestion;
  } catch (error) {
    throw new Error(`Failed to generate suggestion: ${error.message}`);
  }
}

// Memory storage functions
function getSuggestionHistory(userId) {
  return suggestionHistory[userId] || [];
}

function addToSuggestionHistory(userId, suggestion) {
  if (!suggestionHistory[userId]) {
    suggestionHistory[userId] = [];
  }

  // Keep only last 5 suggestions
  suggestionHistory[userId].unshift(suggestion);
  if (suggestionHistory[userId].length > 5) {
    suggestionHistory[userId].pop();
  }
}

function validateSuggestion(suggestion, placesByCategory) {
  return (
    suggestion &&
    typeof suggestion === "object" &&
    suggestion.name &&
    suggestion.distance !== undefined &&
    Object.keys(placesByCategory).includes(suggestion.tag) &&
    suggestion.position &&
    suggestion.position.lat &&
    suggestion.position.lon &&
    suggestion.suggestedTime
  );
}

function formatPlacesWithCategories(placesByCategory) {
  return Object.entries(placesByCategory)
    .map(([tag, places]) => {
      return `[${tag.toUpperCase()}]\n${places
        .map(
          (place) =>
            `- ${place.name} (${place.distance.toFixed(2)}km)\n` +
            `  Position: ${place.lat},${place.lon}`
        )
        .join("\n")}`;
    })
    .join("\n\n");
}

const getPreferencesByWeatherMethod = async (userId, weatherData) => {
  try {
    // Convert weather data to categories
    const { temperature, weather, time } = convertWeatherData(weatherData);

    // Get last 5 preferences matching any weather attributes
    const preferences = await Preferences.find({
      userId,
      $or: [{ temperature }, { weather }, { time }],
    })
      .sort({ createdAt: -1 }) // Get newest first
      .limit(3); // Only return last 5

    if (!preferences || preferences.length === 0) {
      return {
        status: 200,
        message: "No preferences match the current weather conditions",
        preferences: [],
      };
    }

    return {
      status: 200,
      message: "Preferences retrieved successfully based on weather",
      preferences,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Server error",
      error: error.message,
      preferences: [],
    };
  }
};

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

module.exports = {
  generateSuggestion,
};
