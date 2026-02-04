import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables. Check Vercel Settings.");
    }

    console.log(`Connecting to MongoDB... (URI starts with: ${process.env.MONGODB_URI.substring(0, 15)}...)`);

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    // Do not exit process in serverless updates, just let the request fail
    // process.exit(1);
    throw new Error(error.message);
  }
};

export default connectDB;
