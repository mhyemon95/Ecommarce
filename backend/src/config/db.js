const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommarce');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[WARNING] MongoDB Connection failed: ${error.message}`);
    console.warn(`[WARNING] Backend running without active database connection. Set MONGO_URI in .env to connect to your database.`);
  }
};

module.exports = connectDB;
