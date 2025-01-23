const axios = require("axios");

async function getAddressFromCoordinates(latitude, longitude) {
  const apiKey = process.env.LOCATIONIQ_API_KEY;
  const url = `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json`;

  try {
    const response = await axios.get(url);
    return response.data.display_name;
  } catch (error) {
    console.error("Error getting address:", error.message);
    throw new Error("Failed to get address from coordinates");
  }
}

module.exports = {
  getAddressFromCoordinates,
};
