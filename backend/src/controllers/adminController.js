const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get Admin Dashboard Analytics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardAnalytics = async (req, res) => {
  try {
    // 1. Total revenue (from paid orders)
    const paidOrders = await Order.find({ isPaid: true });
    const totalSales = paidOrders.reduce((acc, order) => acc + order.totalPrice, 0);

    // 2. Count metrics
    const totalOrdersCount = await Order.countDocuments();
    const paidOrdersCount = paidOrders.length;
    const totalProductsCount = await Product.countDocuments();
    const totalUsersCount = await User.countDocuments({ role: 'customer' });

    // 3. Inventory warnings (low stock < 5)
    const lowStockProducts = await Product.find({ stock: { $lt: 5 } }).select('name stock price category');

    // 4. Sales by category
    // Let's aggregate sales by product category
    const categorySales = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$productDetails.category',
          totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } },
          totalQty: { $sum: '$orderItems.qty' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // 5. Recent Orders
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
  getDashboardAnalytics
};
