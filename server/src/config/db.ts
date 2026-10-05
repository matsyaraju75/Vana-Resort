import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/vana_resort';
    await mongoose.connect(connStr);
    console.log(`[Database] MongoDB Connected to ${connStr}`);
  } catch (error) {
    console.warn('[Database] MongoDB connection error:', error);
    console.warn('[Database] Running with in-memory / service mock fallback.');
  }
};
