const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product', 'title price images stock');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, cartItems: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add or update item quantity in cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  const { productId, qty } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (qty > product.stock) {
      return res.status(400).json({ message: `Insufficient stock. Only ${product.stock} left.` });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, cartItems: [] });
    }

    // Check if product already exists in cart
    const itemIndex = cart.cartItems.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      // Update quantity
      cart.cartItems[itemIndex].qty = Number(qty);
    } else {
      // Push new item
      cart.cartItems.push({ product: productId, qty: Number(qty) });
    }

    await cart.save();
    
    // Return fully populated cart
    const populatedCart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product', 'title price images stock');
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.cartItems = cart.cartItems.filter(item => item.product.toString() !== productId);
      await cart.save();
    }
    
    const populatedCart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product', 'title price images stock');
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update quantity of an existing cart item
// @route   PUT /api/cart
// @access  Private
const updateCartQuantity = async (req, res) => {
  const { productId, qty } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (qty > product.stock) {
      return res.status(400).json({ message: `Insufficient stock. Only ${product.stock} left.` });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found. Add item first.' });
    }

    const itemIndex = cart.cartItems.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not in cart. Use add-to-cart first.' });
    }

    cart.cartItems[itemIndex].qty = Number(qty);
    await cart.save();

    const populatedCart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product', 'title price images stock');
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity
};
