const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');
const Review = require('./models/Review');
const Order = require('./models/Order');

dotenv.config();
connectDB();

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@ecommarce.com',
    password: 'password123',
    role: 'admin',
    phone: '01711111111',
    isVerified: true
  },
  {
    name: 'Customer User',
    email: 'customer@ecommarce.com',
    password: 'password123',
    role: 'customer',
    phone: '01722222222',
    isVerified: true
  }
];

const seedProducts = [
  {
    title: 'Salicylic Acid Foaming Facewash',
    description: 'A deep-cleansing foaming face wash containing 2% Salicylic Acid to gently exfoliate, unclog pores, and remove acne-causing impurities while keeping the skin hydrated.',
    price: 499,
    discountPrice: 449,
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60'],
    category: 'Facewash',
    stock: 25,
    rating: 4.5,
    reviews: []
  },
  {
    title: 'Hydrating Ceramide Cleanser',
    description: 'Formulated with three essential ceramides and hyaluronic acid to cleanse, hydrate, and restore the skin protective barrier without stripping away vital moisture.',
    price: 550,
    discountPrice: 0,
    images: ['https://images.unsplash.com/photo-1608248597481-496100c80836?w=500&auto=format&fit=crop&q=60'],
    category: 'Facewash',
    stock: 30,
    rating: 4.8,
    reviews: []
  },
  {
    title: '10% Niacinamide Glowing Serum',
    description: 'A lightweight concentrated serum with Niacinamide and Zinc PCA that significantly minimizes large pores, refines uneven texture, fades dark spots, and reduces redness.',
    price: 799,
    discountPrice: 699,
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60'],
    category: 'Serum',
    stock: 15,
    rating: 4.7,
    reviews: []
  },
  {
    title: 'Pure Retinol Youthful Serum',
    description: 'An advanced anti-aging serum powered by encapsulated retinol to accelerate cellular turnover, fade fine lines and deep wrinkles, and restore radiant skin elasticity.',
    price: 950,
    discountPrice: 899,
    images: ['https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=60'],
    category: 'Serum',
    stock: 8,
    rating: 4.6,
    reviews: []
  },
  {
    title: 'Ultra Hydrating Water Gel Cream',
    description: 'An oil-free, non-comedogenic water gel cream that delivers intense, 48-hour hydration to dry skin. Formulated with hyaluronic acid for a plump, dewy look.',
    price: 650,
    discountPrice: 0,
    images: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=500&auto=format&fit=crop&q=60'],
    category: 'Cream',
    stock: 20,
    rating: 4.9,
    reviews: []
  },
  {
    title: 'Centella Barrier Repair Cream',
    description: 'A soothing moisturizing cream enriched with 70% Centella Asiatica extract and panthenol to calm irritated skin, reduce inflammation, and rebuild damaged skin barrier.',
    price: 720,
    discountPrice: 0,
    images: ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&auto=format&fit=crop&q=60'],
    category: 'Cream',
    stock: 12,
    rating: 4.7,
    reviews: []
  },
  {
    title: 'Matte Finish Sunscreen SPF 50+',
    description: 'A lightweight, non-greasy, broad-spectrum sunscreen that provides strong UV protection with a smooth matte finish. Sweat-proof, waterproof, and leaves zero white cast.',
    price: 599,
    discountPrice: 549,
    images: ['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=60'],
    category: 'Sunscreen',
    stock: 40,
    rating: 4.8,
    reviews: []
  },
  {
    title: 'Hyaluronic Acid Airy Sun Stick',
    description: 'A highly portable broad-spectrum chemical sunscreen stick that applies invisibly over makeup. Glides smoothly with 8 types of hyaluronic acid to hydrate on the go.',
    price: 850,
    discountPrice: 0,
    images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&auto=format&fit=crop&q=60'],
    category: 'Sunscreen',
    stock: 18,
    rating: 4.9,
    reviews: []
  }
];

const seedCoupons = [
  { code: 'WELCOME10', discount: 10, expiryDate: new Date('2026-12-31') },
  { code: 'SKINCARE20', discount: 20, expiryDate: new Date('2026-12-31') }
];

const importData = async () => {
  try {
    // Clear old collections
    await User.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();

    console.log('[SEEDER] Cleaned up existing database collections.');

    // Seed Users (will hash password on pre-save hook)
    for (const u of seedUsers) {
      await User.create(u);
    }
    console.log('[SEEDER] Seeded administrative and customer users.');

    // Seed Coupons
    await Coupon.insertMany(seedCoupons);
    console.log('[SEEDER] Seeded promotional discount codes.');

    // Seed Products
    await Product.insertMany(seedProducts);
    console.log('[SEEDER] Seeded organic skincare catalog items.');

    console.log('[SEEDER] Database seeding successfully finalized!');
    process.exit(0);
  } catch (error) {
    console.error(`[SEEDER ERROR] Database seeder failed: ${error.message}`);
    process.exit(1);
  }
};

// Start seeding with standard safe delays to let database connect
setTimeout(() => {
  importData();
}, 2000);
