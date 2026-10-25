const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/promptvault';

  try {
    // Attempt connecting to the configured MongoDB URI
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database] Could not connect to primary MongoDB at ${uri}: ${error.message}`);
    
    // In development or test, fall back to in-memory MongoDB if available
    try {
      console.log('[Database] Starting MongoMemoryServer fallback for local development...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[Database] In-memory MongoDB Connected successfully: ${memUri}`);
      console.log('[Database] Ready for local development and testing!');
      return conn;
    } catch (memErr) {
      console.error(`[Database] In-memory MongoDB failed to start: ${memErr.message}`);
      console.error('[Database] Please provide a valid MONGO_URI in backend/.env (e.g. MongoDB Atlas or local MongoDB service)');
      throw error;
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};

module.exports = { connectDB, disconnectDB };
