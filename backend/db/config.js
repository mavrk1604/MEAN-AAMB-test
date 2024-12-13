const mongoose = require('mongoose');
const mongoUrl = process.env.MONGO_URL;

const connectDatabase = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;
