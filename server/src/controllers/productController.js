const Product = require('../models/Product');
const Review = require('../models/Review');

// @desc    Fetch all products with sorting & keyword filter
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 8;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
          $or: [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } }
          ]
        }
      : {};

    const categoryFilter = req.query.category
      ? { category: req.query.category }
      : {};

    const query = { ...keyword, ...categoryFilter };

    // Determine Sort options
    let sortOption = {};
    if (req.query.sort === 'priceAsc') {
      sortOption = { price: 1 };
    } else if (req.query.sort === 'priceDesc') {
      sortOption = { price: -1 };
    } else if (req.query.sort === 'rating') {
      sortOption = { rating: -1 };
    } else {
      sortOption = { createdAt: -1 }; // newest
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: 'reviews',
      populate: { path: 'user', select: 'name' }
    });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const { title, price, description, images, category, stock } = req.body;

  try {
    const product = new Product({
      title,
      price: Number(price),
      user: req.user._id,
      images: images || [],
      category,
      stock: Number(stock),
      description,
      rating: 0,
      reviews: []
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { title, price, description, images, category, stock } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.title = title || product.title;
      product.price = price !== undefined ? Number(price) : product.price;
      product.description = description || product.description;
      product.images = images || product.images;
      product.category = category || product.category;
      product.stock = stock !== undefined ? Number(stock) : product.stock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Remove all linked reviews as well
      await Review.deleteMany({ product: req.params.id });
      await Product.findByIdAndDelete(req.params.id);
      
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
