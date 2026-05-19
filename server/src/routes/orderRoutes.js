const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderToPaid,
  verifyPayment,
  getOrders
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateOrder } = require('../middleware/validateMiddleware');

// POST /api/orders        — create a new order (validated)
// GET  /api/orders        — list all orders (admin only)
router.route('/')
  .post(protect, validateOrder, addOrderItems)
  .get(protect, admin, getOrders);

// GET  /api/orders/myorders         — logged-in user's order history
router.get('/myorders', protect, getMyOrders);

// GET  /api/orders/:id              — single order detail
router.get('/:id', protect, getOrderById);

// PUT  /api/orders/:id/status       — admin updates delivery status
router.put('/:id/status', protect, admin, updateOrderStatus);

// PUT  /api/orders/:id/pay          — mark order as paid (gateway callback)
router.put('/:id/pay', protect, updateOrderToPaid);

// POST /api/orders/:id/verify-payment — verify a payment transaction ID
router.post('/:id/verify-payment', protect, verifyPayment);

module.exports = router;
