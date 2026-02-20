const mongoose = require('mongoose');

// Default local fallback (used when SRV/DNS resolution fails)
const LOCAL_FALLBACK = 'mongodb://localhost:27017/jan-suvidha';
const SERVER_SELECTION_TIMEOUT_MS = 5000; // fail fast when DB is unreachable

/**
 * Attempts to connect to MongoDB and, on failure, tries a local fallback (to avoid crashing
 * when SRV/DNS resolution to Atlas fails). If both attempts fail the function starts a
 * background retry loop so the app keeps running while connectivity is restored.
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || LOCAL_FALLBACK;

  // Debug: show masked URI for troubleshooting (do not reveal passwords in logs)
  try {
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', mongoURI.replace(/:[^:@]+@/, ':****@'));
  } catch (e) {
    // ignore logging errors
  }

  let isConnecting = false;

  const tryConnect = async (uri) => {
    if (isConnecting) return false;
    isConnecting = true;
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS });
      console.log(`MongoDB Connected: ${conn.connection.host}`);

      // Wire up event handlers once connected
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
      });

      isConnecting = false;
      return true;
    } catch (err) {
      console.error('MongoDB connection error:', err);
      isConnecting = false;
      return false;
    }
  };

  // First attempt: configured URI
  const primaryOk = await tryConnect(mongoURI);
  if (primaryOk) return;

  // If the configured URI uses SRV and failed (likely DNS/SRV issue), try a local fallback
  if (mongoURI.startsWith('mongodb+srv://')) {
    console.warn('SRV (mongodb+srv) connection failed. Attempting local fallback to avoid crash.');
    const fallbackOk = await tryConnect(LOCAL_FALLBACK);
    if (fallbackOk) return;
  }

  // If we get here neither primary nor fallback connected. Start a non-blocking retry loop
  // so the server process doesn't exit (nodemon will keep running). This loop will try
  // to reconnect periodically until successful.
  console.warn('All MongoDB connection attempts failed. Will retry in background every 10 seconds.');

  const RETRY_INTERVAL_MS = 10000;
  setInterval(async () => {
    console.log('Retrying MongoDB connection...');
    // try primary first, then fallback if primary uses SRV
    const ok = await tryConnect(mongoURI);
    if (!ok && mongoURI.startsWith('mongodb+srv://')) {
      await tryConnect(LOCAL_FALLBACK);
    }
  }, RETRY_INTERVAL_MS);
};

module.exports = connectDB;