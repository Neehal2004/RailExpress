import mongoose from 'mongoose';

export let isMongoConnected = false;

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rtbs';
    const isAtlas = mongoURI.includes('mongodb+srv://');

    console.log(`Attempting to connect to ${isAtlas ? 'MongoDB Atlas Cloud' : 'Local MongoDB'}...`);

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: isAtlas ? 10000 : 3000
    });

    isMongoConnected = true;
    console.log('=========================================================');
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`Database Host: ${conn.connection.host}`);
    console.log(`Database Mode: ${isAtlas ? 'MongoDB Atlas (Cloud)' : 'Localhost Database'}`);
    console.log('=========================================================');
  } catch (error) {
    isMongoConnected = false;
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rtbs';
    const isAtlas = mongoURI.includes('mongodb+srv://');

    console.log('---------------------------------------------------------');
    console.log(`MongoDB Connection Notice: ${error.message}`);
    if (isAtlas) {
      console.log('⚠️ Could not connect to MongoDB Atlas. Check your username, password, IP Whitelist, or MONGO_URI in backend/.env');
    } else {
      console.log('ℹ️ Localhost MongoDB service not detected on mongodb://127.0.0.1:27017');
    }
    console.log('Running in Hybrid In-Memory Mode until database connects.');
    console.log('---------------------------------------------------------');
  }
};

export default connectDB;
