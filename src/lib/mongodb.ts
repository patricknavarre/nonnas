import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface GlobalMongo {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: GlobalMongo | undefined;
}

const cached: GlobalMongo = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Check MongoDB URI format (without revealing full credentials)
    const maskedURI = MONGODB_URI ? MONGODB_URI.replace(/:([^@]+)@/, ':***@') : 'undefined';
    console.log(`Attempting MongoDB connection with URI: ${maskedURI}`);

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connection successful');
        return mongoose;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB; 