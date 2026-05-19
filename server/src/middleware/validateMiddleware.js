/**
 * Input Validation Middleware — Phase 4 Security
 * Validates all incoming request bodies before hitting controllers.
 * Returns 400 Bad Request with a descriptive error message on failure.
 */

const mongoose = require('mongoose');

// Helper: return a 400 response and stop execution
const fail = (res, message) => res.status(400).json({ message });

// Helper: simple email format check
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Helper: check if string is a valid Mongo ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ---------------------------------------------------------
// AUTH VALIDATORS
// ---------------------------------------------------------

/**
 * POST /api/users/register
 * Requires: name, email (valid), password (>=6 chars), phone
 */
const validateRegister = (req, res, next) => {
  const { name, email, password, phone } = req.body;

  if (!name || name.trim().length < 2) {
    return fail(res, 'Name must be at least 2 characters long.');
  }
  if (!email || !isValidEmail(email)) {
    return fail(res, 'A valid email address is required.');
  }
  if (!password || password.length < 6) {
    return fail(res, 'Password must be at least 6 characters long.');
  }
  if (!phone || phone.trim().length < 7) {
    return fail(res, 'A valid phone number is required (minimum 7 digits).');
  }

  next();
};

/**
 * POST /api/users/login
 * Requires: email (valid), password (non-empty)
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !isValidEmail(email)) {
    return fail(res, 'A valid email address is required.');
  }
  if (!password || password.trim() === '') {
    return fail(res, 'Password is required.');
  }

  next();
};

/**
 * POST /api/users/forgot-password
 * Requires: email (valid)
 */
const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;

  if (!email || !isValidEmail(email)) {
    return fail(res, 'A valid email address is required.');
  }

  next();
};

/**
 * POST /api/users/reset-password
 * Requires: token (non-empty), password (>=6 chars)
 */
const validateResetPassword = (req, res, next) => {
  const { token, password } = req.body;

  if (!token || token.trim() === '') {
    return fail(res, 'A valid reset token is required.');
  }
  if (!password || password.length < 6) {
    return fail(res, 'New password must be at least 6 characters long.');
  }

  next();
};

// ---------------------------------------------------------
// PRODUCT VALIDATORS
// ---------------------------------------------------------

const VALID_CATEGORIES = ['Facewash', 'Serum', 'Cream', 'Sunscreen'];

/**
 * POST /api/products  &  PUT /api/products/:id
 * Requires: title, price (positive number), category (enum),
 *           stock (non-negative integer), description
 */
const validateProduct = (req, res, next) => {
  const { title, price, category, stock, description } = req.body;

  if (!title || title.trim().length < 3) {
    return fail(res, 'Product title must be at least 3 characters long.');
  }
  if (price === undefined || price === null || isNaN(Number(price)) || Number(price) <= 0) {
    return fail(res, 'Price must be a positive number.');
  }
  if (!category || !VALID_CATEGORIES.includes(category)) {
    return fail(res, `Category must be one of: ${VALID_CATEGORIES.join(', ')}.`);
  }
  if (stock === undefined || stock === null || isNaN(Number(stock)) || Number(stock) < 0) {
    return fail(res, 'Stock must be a non-negative integer.');
  }
  if (!description || description.trim().length < 10) {
    return fail(res, 'Product description must be at least 10 characters long.');
  }

  next();
};

// ---------------------------------------------------------
// CART VALIDATORS
// ---------------------------------------------------------

/**
 * POST /api/cart  (Add to cart)
 * Requires: productId (valid ObjectId), qty (positive integer)
 */
const validateAddToCart = (req, res, next) => {
  const { productId, qty } = req.body;

  if (!productId || !isValidObjectId(productId)) {
    return fail(res, 'A valid product ID is required.');
  }
  if (qty === undefined || qty === null || isNaN(Number(qty)) || Number(qty) < 1) {
    return fail(res, 'Quantity must be a positive integer of at least 1.');
  }

  next();
};

/**
 * PUT /api/cart  (Update cart quantity)
 * Requires: productId (valid ObjectId), qty (positive integer)
 */
const validateUpdateCartQty = (req, res, next) => {
  const { productId, qty } = req.body;

  if (!productId || !isValidObjectId(productId)) {
    return fail(res, 'A valid product ID is required.');
  }
  if (qty === undefined || qty === null || isNaN(Number(qty)) || Number(qty) < 1) {
    return fail(res, 'Quantity must be a positive integer of at least 1.');
  }

  next();
};

// ---------------------------------------------------------
// ORDER VALIDATORS
// ---------------------------------------------------------

/**
 * POST /api/orders
 * Requires: orderItems (non-empty array), shippingAddress (street, city,
 *           postalCode, phone), totalPrice (positive number)
 */
const validateOrder = (req, res, next) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;

  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    return fail(res, 'Order must contain at least one item.');
  }

  // Validate each order item
  for (let i = 0; i < orderItems.length; i++) {
    const item = orderItems[i];
    if (!item.product || !isValidObjectId(item.product)) {
      return fail(res, `Order item at index ${i} has an invalid product ID.`);
    }
    if (!item.qty || isNaN(Number(item.qty)) || Number(item.qty) < 1) {
      return fail(res, `Order item at index ${i} must have a valid quantity (>=1).`);
    }
  }

  if (!shippingAddress) {
    return fail(res, 'A shipping address is required.');
  }
  const { street, city, postalCode, phone } = shippingAddress;
  if (!street || street.trim() === '') {
    return fail(res, 'Shipping address must include a street.');
  }
  if (!city || city.trim() === '') {
    return fail(res, 'Shipping address must include a city.');
  }
  if (!postalCode || postalCode.trim() === '') {
    return fail(res, 'Shipping address must include a postal code.');
  }
  if (!phone || phone.trim().length < 7) {
    return fail(res, 'Shipping address must include a valid phone number.');
  }

  if (totalPrice === undefined || totalPrice === null || isNaN(Number(totalPrice)) || Number(totalPrice) <= 0) {
    return fail(res, 'Total price must be a positive number.');
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateProduct,
  validateAddToCart,
  validateUpdateCartQty,
  validateOrder
};
