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
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword
} = require('../middleware/validateMiddleware');

// Auth routes — validation runs BEFORE the controller
router.post('/register',        validateRegister,       registerUser);
router.post('/verify-otp',                              verifyOTP);
router.post('/login',           validateLogin,          authUser);
router.post('/logout',          protect,                logoutUser);
router.post('/refresh',                                 refreshAccessToken);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password',  validateResetPassword,  resetPassword);
router.put('/profile',          protect,                updateUserProfile);

module.exports = router;
