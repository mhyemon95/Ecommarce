const Product = require('../models/Product');
const Review = require('../models/Review');

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  const { rating, comment, name } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Find if review by user already exists
      const alreadyReviewed = await Review.findOne({
        user: req.user._id,
        product: req.params.id
      });

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed by you' });
      }

      // Create standalone review
      const review = await Review.create({
        user: req.user._id,
        product: req.params.id,
        rating: Number(rating),
        comment
      });

      // Link to product
      product.reviews.push(review._id);
      await product.save();

      // Recalculate average rating
      const allProductReviews = await Review.find({ product: req.params.id });
      product.rating =
        allProductReviews.reduce((acc, r) => acc + r.rating, 0) /
        allProductReviews.length;
      
      await product.save();

      res.status(201).json({ message: 'Review added successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProductReview
};
