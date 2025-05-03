import mongoose from 'mongoose';
import { Product } from '@/models/Product';
import { Setting } from '@/models/Setting';

// This script normalizes category names across the database
// to ensure consistency between the development and production environments

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
    console.error('Usage: npm run update-categories -- "mongodb+srv://your-connection-string"');
    console.error('Or: MONGODB_URI="mongodb+srv://your-connection-string" npm run update-categories');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    const connected = await connectDB(uri);
    if (!connected) {
      process.exit(1);
    }

    // 1. Update product categories for consistency
    console.log('Updating product categories...');
    const productsResult = await Product.updateMany(
      { category: 'Home Décor' },
      { $set: { category: 'Home Decor' } }
    );

    console.log(`Updated ${productsResult.modifiedCount} products with 'Home Décor' to 'Home Decor'`);

    // 2. Update settings that might contain category references
    console.log('Checking settings...');
    
    // Update featured category titles and links if needed
    const settingsToCheck = [
      'featured_category_1_title',
      'featured_category_1_link',
      'featured_category_2_title',
      'featured_category_2_link', 
      'featured_category_3_title',
      'featured_category_3_link'
    ];

    for (const key of settingsToCheck) {
      const setting = await Setting.findOne({ key });
      if (setting && typeof setting.value === 'string') {
        if (setting.value.includes('Home Décor')) {
          const updatedValue = setting.value.replace('Home Décor', 'Home Decor');
          await Setting.updateOne(
            { key },
            { $set: { value: updatedValue } }
          );
          console.log(`Updated setting '${key}' from '${setting.value}' to '${updatedValue}'`);
        }
      }
    }

    console.log('Category name normalization completed successfully');
  } catch (error) {
    console.error('Error normalizing category names:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Only run the script directly (not when imported)
if (require.main === module) {
  run().catch(console.error);
} 