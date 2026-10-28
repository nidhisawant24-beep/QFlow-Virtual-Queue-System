require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const User = require('../models/User');
const Queue = require('../models/Queue');
const Token = require('../models/Token');
const { seedDataIfEmpty } = require('./seedData');

const runManualSeed = async () => {
  try {
    console.log('[Seed Runner] Connecting to database...');
    await connectDB();

    console.log('[Seed Runner] Clearing old data if any...');
    await User.deleteMany({});
    await Queue.deleteMany({});
    await Token.deleteMany({});

    console.log('[Seed Runner] Re-seeding database...');
    await seedDataIfEmpty();

    console.log('[Seed Runner] Finished successfully! Exiting.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Runner] Error while seeding:', error);
    process.exit(1);
  }
};

runManualSeed();
