const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Define search route
router.post('/search', searchController.search);

module.exports = router;