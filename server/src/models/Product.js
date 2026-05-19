const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true }, // We keep string/number for flex, let's make it Number! Number is much better for sorting! Let's make it Number!
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: 0 },
  images: [{ type: String }],
  category: { 
    type: String, 
    required: true,
    enum: ['Facewash', 'Serum', 'Cream', 'Sunscreen'] 
  },
  stock: { type: Number, required: true, default: 0 },
  rating: { type: Number, default: 0 },
  reviews: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Review' 
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
