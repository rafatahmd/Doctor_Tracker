const mongoose = require('mongoose');

// In serverless (Vercel) each cold start boots a fresh module. Cache the
// connection on the global object so warm invocations reuse one pool.
let cached = global.__mongoose;
if (!cached) {
  cached = global.__mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set');
    }
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        // Fail fast on cold start instead of buffering 10s.
        serverSelectionTimeoutMS: 8000,
      })
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
      })
      .catch((error) => {
        // Reset so a later request can retry instead of being stuck on a dead promise.
        cached.promise = null;
        console.error(`MongoDB connection error: ${error.message}`);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;
