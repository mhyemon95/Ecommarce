const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, updateCartQuantity } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const { validateAddToCart, validateUpdateCartQty } = require('../middleware/validateMiddleware');

// GET    /api/cart        — fetch current user's cart
// POST   /api/cart        — add item to cart (or update qty if exists)
// PUT    /api/cart        — explicitly update quantity of a cart item
router.route('/')
  .get(protect, getCart)
  .post(protect, validateAddToCart, addToCart)
  .put(protect, validateUpdateCartQty, updateCartQuantity);

// DELETE /api/cart/:productId  — remove a specific item from cart
router.route('/:productId')
  .delete(protect, removeFromCart);

module.exports = router;
