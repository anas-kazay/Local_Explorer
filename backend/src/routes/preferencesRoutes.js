const express = require("express");
const router = express.Router();
const preferencesController = require("../controllers/preferencesController");
const authMiddleware = require("../middleware/authMiddleware"); // JWT middleware for auth

router.post("/", authMiddleware, preferencesController.createPreferences);
router.get("/", authMiddleware, preferencesController.getPreferences);
router.delete("/:id", authMiddleware, preferencesController.deletePreference);
router.get(
  "/by-weather",
  authMiddleware,
  preferencesController.getPreferencesByWeather
);
module.exports = router;
