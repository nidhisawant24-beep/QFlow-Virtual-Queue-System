const express = require('express');
const router = express.Router();
const { getBusinessAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('business'), getBusinessAnalytics);

module.exports = router;
