import { connect } from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const mongoURI =process.env.MONGO_URI;

const connectDB = async () => {
  try {
    // Connect to MongoDB
    
    await connect(mongoURI, {
     
      serverSelectionTimeoutMS: 30000, 
    });

    console.log('MongoDB Atlas connected');

  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

 export default connectDB ;
