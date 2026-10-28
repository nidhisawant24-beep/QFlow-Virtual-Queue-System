const mongoose = require('mongoose');

let mongoMemoryServerInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/qflow';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] MongoDB Connected to host: ${conn.connection.host}`);
    return conn;
  } catch (primaryError) {
    console.warn(`[Database] Could not connect to primary MongoDB at ${uri}: ${primaryError.message}`);
    console.log('[Database] Initializing in-memory MongoDB fallback for instant out-of-the-box development...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServerInstance = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServerInstance.getUri();

      const conn = await mongoose.connect(memoryUri);
      console.log(`[Database] Connected to In-Memory MongoDB at: ${memoryUri}`);

      // Seed data automatically if in memory
      try {
        const { seedDataIfEmpty } = require('../seeds/seedData');
        if (typeof seedDataIfEmpty === 'function') {
          await seedDataIfEmpty();
        }
      } catch (seedErr) {
        console.warn(`[Database] Note on auto-seeding: ${seedErr.message}`);
      }

      return conn;
    } catch (fallbackError) {
      console.error('[Database] Failed to initialize in-memory MongoDB fallback:', fallbackError.message);
      console.error('[Database] Please ensure MongoDB is running or specify a valid MONGODB_URI in backend/.env');
      // Do not crash the entire process so that API endpoints can report DB status
      return null;
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServerInstance) {
    await mongoMemoryServerInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };
