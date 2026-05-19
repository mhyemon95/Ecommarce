const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { createProductReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateProduct } = require('../middleware/validateMiddleware');

// GET  /api/products        — list all (public, with filters & pagination)
// POST /api/products        — create new product (admin only, validated)
router.route('/')
  .get(getProducts)
  .post(protect, admin, validateProduct, createProduct);

// GET    /api/products/:id  — product detail (public)
// PUT    /api/products/:id  — update product (admin only, validated)
// DELETE /api/products/:id  — remove product (admin only)
router.route('/:id')
  .get(getProductById)
  .put(protect, admin, validateProduct, updateProduct)
  .delete(protect, admin, deleteProduct);

// POST /api/products/:id/reviews — submit a review (logged-in customers)
router.post('/:id/reviews', protect, createProductReview);

module.exports = router;
