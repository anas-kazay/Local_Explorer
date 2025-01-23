const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.put("/preferences", authMiddleware, userController.updatePreferences);
router.get("/username", authMiddleware, userController.getUsernameByToken);

module.exports = router;
