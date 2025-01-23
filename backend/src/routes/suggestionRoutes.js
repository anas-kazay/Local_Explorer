// src/routes/suggestionRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getSuggestion,
} = require('../controllers/suggestionController');

router.post('/', authMiddleware, getSuggestion);

module.exports = router;
