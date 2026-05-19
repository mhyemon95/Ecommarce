const express = require('express');
const router = express.Router();
const {
  registerUser,
  verifyOTP,
  resendOTP,
  authUser,
  getUserProfile,
  updateUserProfile,
  addUserAddress,
  deleteUserAddress
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', authUser);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/address').post(protect, addUserAddress);
router.route('/address/:id').delete(protect, deleteUserAddress);

module.exports = router;
