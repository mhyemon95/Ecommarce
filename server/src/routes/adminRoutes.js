const express = require('express');
const router = express.Router();
const { getAdminAnalytics } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, admin, getAdminAnalytics);

module.exports = router;
