const Coupon = require('../models/Coupon');

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res) => {
  const { code } = req.body;

  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    // Check expiry
    const now = new Date();
    if (now > coupon.expiryDate) {
      return res.status(400).json({ message: 'Coupon code has expired' });
    }

    res.json({
      code: coupon.code,
      discount: coupon.discount,
      message: `Coupon applied! You got ${coupon.discount}% off.`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  validateCoupon
};
