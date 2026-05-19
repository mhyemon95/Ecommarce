const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const users = [
  {
    name: 'Admin User',
    email: 'admin@ecommarce.com',
    password: 'password123',
    role: 'admin',
    isVerified: true
  },
  {
    name: 'Customer User',
    email: 'customer@ecommarce.com',
    password: 'password123',
    role: 'customer',
    isVerified: true
  }
];

const products = [
  {
    name: 'Salicylic Acid Foaming Facewash',
    description: 'A deep-cleansing foaming face wash containing 2% Salicylic Acid to gently exfoliate, unclog pores, and remove acne-causing impurities while keeping the skin hydrated.',
    price: 499,
    category: 'Facewash',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60',
    rating: 4.5,
    numReviews: 0
  },
  {
    name: 'Hydrating Ceramide Cleanser',
    description: 'Formulated with three essential ceramides and hyaluronic acid to cleanse, hydrate, and restore the skin protective barrier without stripping away vital moisture.',
    price: 550,
    category: 'Facewash',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=500&auto=format&fit=crop&q=60',
    rating: 4.8,
    numReviews: 0
  },
  {
    name: '10% Niacinamide Glowing Serum',
    description: 'A lightweight concentrated serum with Niacinamide and Zinc PCA that significantly minimizes large pores, refines uneven texture, fades dark spots, and reduces redness.',
    price: 799,
    category: 'Serum',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60',
    rating: 4.7,
    numReviews: 0
  },
  {
    name: 'Pure Retinol Youthful Serum',
    description: 'An advanced anti-aging serum powered by encapsulated retinol to accelerate cellular turnover, fade fine lines and deep wrinkles, and restore radiant skin elasticity.',
    price: 950,
    category: 'Serum',
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=60',
    rating: 4.6,
    numReviews: 0
  },
  {
    name: 'Ultra Hydrating Water Gel Cream',
    description: 'An oil-free, non-comedogenic water gel cream that delivers intense, 48-hour hydration to dry skin. Formulated with hyaluronic acid for a plump, dewy look.',
    price: 650,
    category: 'Cream',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=500&auto=format&fit=crop&q=60',
    rating: 4.9,
    numReviews: 0
  },
  {
    name: 'Centella Barrier Repair Cream',
    description: 'A soothing moisturizing cream enriched with 70% Centella Asiatica extract and panthenol to calm irritated skin, reduce inflammation, and rebuild damaged skin barrier.',
    price: 720,
    category: 'Cream',
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&auto=format&fit=crop&q=60',
    rating: 4.7,
    numReviews: 0
  },
  {
    name: 'Matte Finish Sunscreen SPF 50+',
    description: 'A lightweight, non-greasy, broad-spectrum sunscreen that provides strong UV protection with a smooth matte finish. Sweat-proof, waterproof, and leaves zero white cast.',
    price: 599,
    category: 'Sunscreen',
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=60',
    rating: 4.8,
    numReviews: 0
  },
  {
    name: 'Hyaluronic Acid Airy Sun Stick',
    description: 'A highly portable broad-spectrum chemical sunscreen stick that applies invisibly over makeup. Glides smoothly with 8 types of hyaluronic acid to hydrate on the go.',
    price: 850,
    category: 'Sunscreen',
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=60',
    rating: 4.9,
    numReviews: 0
  }
];

const coupons = [
  {
    code: 'WELCOME10',
    discount: 10,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
    isActive: true
  },
  {
    code: 'SKINCARE20',
    discount: 20,
    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days expiry
    isActive: true
  }
];

const importData = async () => {
  try {
    // Clear the database
    await User.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();

    console.log('Database cleared!');

    // Import users
    await User.insertMany(users);
    console.log('Test Users seeded successfully!');

    // Import products
    await Product.insertMany(products);
    console.log('Premium Products seeded successfully!');

    // Import coupons
    await Coupon.insertMany(coupons);
    console.log('Promo Coupons seeded successfully!');

    console.log('Data Import Complete!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error.message);
    process.exit(1);
  }
};

importData();
