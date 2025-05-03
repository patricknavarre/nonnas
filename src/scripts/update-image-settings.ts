import mongoose from 'mongoose';
import { Setting } from '@/models/Setting';

// This script updates the image paths for categories in the database

async function connectDB(uri: string) {
  try {
    if (!uri) {
      throw new Error('MongoDB URI is required');
    }
    
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
}

async function run() {
  // Use environment variable or command line argument
  const uri = process.env.MONGODB_URI || process.argv[2];
  
  if (!uri) {
    console.error('Error: MONGODB_URI environment variable or command-line argument is required');
    console.error('Usage: npm run update-images -- "mongodb+srv://your-connection-string"');
    console.error('Or: MONGODB_URI="mongodb+srv://your-connection-string" npm run update-images');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    const connected = await connectDB(uri);
    if (!connected) {
      process.exit(1);
    }

    console.log('Updating category image settings...');
    
    // Update featured category settings
    const settings = [
      { 
        key: 'featured_category_1_title', 
        value: 'Home Decor'
      },
      { 
        key: 'featured_category_1_image', 
        value: '/images/categories/home-decor.jpg'
      },
      { 
        key: 'featured_category_1_link', 
        value: '/products?category=Home Decor'
      },
      { 
        key: 'featured_category_2_title', 
        value: 'Baby/Kids'
      },
      { 
        key: 'featured_category_2_image', 
        value: '/images/categories/baby-kids.jpg'
      },
      { 
        key: 'featured_category_2_link', 
        value: '/products?category=Baby/Kids'
      },
      { 
        key: 'featured_category_3_title', 
        value: 'Seasonal'
      },
      { 
        key: 'featured_category_3_image', 
        value: '/images/categories/seasonal.jpg'
      },
      { 
        key: 'featured_category_3_link', 
        value: '/products?category=Seasonal'
      }
    ];

    for (const setting of settings) {
      const result = await Setting.updateOne(
        { key: setting.key },
        { $set: { value: setting.value } },
        { upsert: true }
      );
      
      console.log(`Updated setting '${setting.key}' to '${setting.value}'`);
    }

    console.log('Image settings updated successfully');
  } catch (error) {
    console.error('Error updating image settings:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Only run the script directly (not when imported)
if (require.main === module) {
  run().catch(console.error);
} 