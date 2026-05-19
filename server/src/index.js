const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');

// Route imports
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cartRoutes = require('./routes/cartRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

dotenv.config();

// Connect Mongoose Database
connectDB();

const app = express();

// ----------------------------------------------------
// SECURITY MIDDLEWARES (Phase 4)
// ----------------------------------------------------
// 1. Helmet to secure headers
app.use(helmet({
  crossOriginResourcePolicy: false // Allow loading local uploads in browser
}));

// 2. CORS — whitelist only the frontend client origin
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// 3. Parser Limit
app.use(express.json({ limit: '10mb' }));

// 4. Rate Limiting for Auth routes to prevent brute-force
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Too many authentication attempts from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/users/login', authRateLimiter);
app.use('/api/users/register', authRateLimiter);

// ----------------------------------------------------
// ROUTES & SERVING STATIC FILES
// ----------------------------------------------------
// Serve local image uploads statically
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Mount API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/upload', uploadRoutes);

// Base Status Route
app.get('/api', (req, res) => {
  res.json({ message: 'AuraGlow Premium Skincare API is operational, secure, and ready.' });
});

// Cloud Database Seeder Route (Temporary)
const { seedDatabaseAPI } = require('./seeder');
app.get('/api/seed', async (req, res) => {
  try {
    const result = await seedDatabaseAPI();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Fallback Route error handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'API endpoint route not found' });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`[SERVER] Express Server running securely on port ${PORT}`);
  });
}

// Export the app for Vercel Serverless deployment
module.exports = app;
