const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboard.controller');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// Routes
router.get('/stats', getStats);

module.exports = router;
