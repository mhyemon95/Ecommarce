const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/auraglow');
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DATABASE WARNING] MongoDB connection failed: ${error.message}`);
    console.log(`[DATABASE WARNING] Continuing execution with local mock client integrations.`);
  }
};

module.exports = connectDB;
