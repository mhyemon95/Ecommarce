const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard metrics & analytics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getAdminAnalytics = async (req, res) => {
  try {
    const totalProductsCount = await Product.countDocuments({});
    const totalUsersCount = await User.countDocuments({ role: 'customer' });

    const orders = await Order.find({});
    const totalOrdersCount = orders.length;
    const paidOrders = orders.filter(o => o.paymentStatus === 'Paid');
    const paidOrdersCount = paidOrders.length;
    const totalSales = paidOrders.reduce((acc, o) => acc + o.totalPrice, 0);

    // Low stock warnings
    const lowStockProducts = await Product.find({ stock: { $lt: 5 } });

    // Category Sales breakdown
    // We aggregate manually for simplicity & safety
    const categorySalesMap = {};
    for (const order of paidOrders) {
      // populate products details manually
      for (const item of order.products) {
        const prod = await Product.findById(item.product);
        const cat = prod ? prod.category : 'General';
        const itemPrice = prod ? prod.price : 0;
        categorySalesMap[cat] = (categorySalesMap[cat] || 0) + (itemPrice * item.qty);
      }
    }

    const categorySales = Object.entries(categorySalesMap).map(([name, val]) => ({
      _id: name,
      totalRevenue: val
    }));

    const recentOrders = await Order.find({})
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      summary: {
        totalSales,
        totalOrdersCount,
        paidOrdersCount,
        totalProductsCount,
        totalUsersCount
      },
      lowStockProducts,
      categorySales,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminAnalytics
};
