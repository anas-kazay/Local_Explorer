// src/server.js
const app = require("./app"); // Import app.js
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config(); // Ensure environment variables are loaded before using them

const PORT = process.env.PORT || 3000; // Default port is 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
