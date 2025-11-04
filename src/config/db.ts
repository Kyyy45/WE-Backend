import mongoose from 'mongoose';
import { getEnv } from '../utils/env';
import { logger } from '../utils/logger';

const MONGO_URI = getEnv('MONGO_URI');

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('✅ MongoDB connected');
  } catch (err) {
    logger.error('MongoDB connection error: ' + (err as Error).message);
    throw err;
  }
};

export default connectDB;
