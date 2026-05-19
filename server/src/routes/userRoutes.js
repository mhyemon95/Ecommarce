const express = require('express');
const router = express.Router();
const {
  registerUser,
  verifyOTP,
  authUser,
  logoutUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  updateUserProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', authUser);
router.post('/logout', protect, logoutUser);
router.post('/refresh', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
