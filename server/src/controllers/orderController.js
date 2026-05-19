const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  try {
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Convert frontend structure to match schema's user reference and products layout
    const products = orderItems.map((item) => ({
      product: item.product,
      qty: item.qty
    }));

    const order = new Order({
      user: req.user._id,
      products,
      totalPrice,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      deliveryStatus: 'Pending',
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || 'Bangladesh',
        phone: shippingAddress.phone
      }
    });

    const createdOrder = await order.save();

    // Deduct stock levels in MongoDB
    for (const item of orderItems) {
      const prod = await Product.findById(item.product);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.qty);
        await prod.save();
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('products.product', 'title price images');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.deliveryStatus = status;
      if (status === 'Delivered') {
        order.paymentStatus = 'Paid';
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid (Stripe / SSLCommerz gateway)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.paymentStatus = 'Paid';
      order.paymentResult = {
        id: req.body.id || 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        status: req.body.status || 'success',
        update_time: req.body.update_time || new Date().toISOString()
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Order Payment Transaction
// @route   POST /api/orders/:id/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
  const { transactionId } = req.body;

  if (!transactionId) {
    return res.status(400).json({ message: 'Please provide a transaction reference ID' });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.paymentStatus = 'Paid';
      order.deliveryStatus = 'Processing';
      order.paymentResult = {
        id: transactionId,
        status: 'verified_success',
        update_time: new Date().toISOString()
      };

      const updatedOrder = await order.save();
      res.json({
        message: 'Payment verified and transaction approved!',
        order: updatedOrder
      });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name')
      .populate('products.product', 'title price')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderToPaid,
  verifyPayment,
  getOrders
};
