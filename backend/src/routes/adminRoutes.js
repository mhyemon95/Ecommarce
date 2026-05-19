const express = require('express');
const router = express.Router();
const { getDashboardAnalytics } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/dashboard')
  .get(protect, admin, getDashboardAnalytics);

module.exports = router;
