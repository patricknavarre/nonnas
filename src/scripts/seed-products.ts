import mongoose from 'mongoose';
import { Product } from '../models/Product';
import dotenv from 'dotenv';

// Load environment variables from the appropriate file
if (process.env.NODE_ENV === 'production') {
  dotenv.config();
} else {
  dotenv.config({ path: '.env.local' });
}

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Using database:', MONGODB_URI.split('@')[1]); // Log the database host without credentials

// Product data
const products = [
  {
    title: "Brothers/Sisters Picture Frames",
    description: "Beautiful picture frame perfect for showcasing sibling photos.",
    price: 19.99,
    images: [
      {
        url: "/images/484334791_122115354848744183_8909163640246418595_nonna.jpg",
        alt: "Brothers/Sisters Picture Frames"
      }
    ],
    category: "Home Decor",
    isActive: true
  },
  {
    title: "Easter Table Center Piece",
    description: "Elegant Easter-themed table centerpiece for your holiday celebrations.",
    price: 29.99,
    images: [
      {
        url: "/images/488914455_122120175896744183_8118277209099763042_nonna.jpg",
        alt: "Easter Table Center Piece"
      }
    ],
    category: "Home Decor",
    isActive: true
  },
  {
    title: "Easter Bunny Gift Basket 1",
    description: "Easter Bunny Gift Basket for Kids.",
    price: 19.99,
    images: [
      {
        url: "/images/487812383_122120175842744183_7049025500246276914_n3.jpg",
        alt: "Easter Bunny Gift Basket 1"
      }
    ],
    category: "Seasonal",
    isActive: true
  },
  {
    title: "Fubble Gift",
    description: "Fubble Toy - Gift for Kids",
    price: 14.99,
    images: [
      {
        url: "/images/487936279_122120175872744183_2083276447989818708_n1.jpg",
        alt: "Fubble Gift Toy"
      }
    ],
    category: "Baby Goods/Kids Goods",
    isActive: true
  },
  {
    title: "Easter Bunny Gift Basket 2",
    description: "A fun gift basket for kids!",
    price: 29.99,
    images: [
      {
        url: "/images/487960451_122120175806744183_7234243251571161358_n6.jpg",
        alt: "Easter Bunny Gift Basket 2"
      }
    ],
    category: "Seasonal",
    isActive: true
  },
  {
    title: "Easter Bunny Gift Basket 3",
    description: "Delightful Easter basket featuring a plush bunny.",
    price: 24.99,
    images: [
      {
        url: "/images/488710333_122120175884744183_7905290102645973840_n2.jpg",
        alt: "Easter Bunny Gift Basket 3"
      }
    ],
    category: "Seasonal",
    isActive: true
  },
  {
    title: "Easter Bunny Gift Basket with Gold Ribbon",
    description: "Premium Easter basket with gold ribbon and special treats.",
    price: 34.99,
    images: [
      {
        url: "/images/488898200_122120175830744183_7304860668947672558_n4.jpg",
        alt: "Easter Bunny Gift Basket with Gold Ribbon"
      }
    ],
    category: "Seasonal",
    isActive: true
  },
  {
    title: "Easter Bunny Gift Basket Collection",
    description: "Our signature Easter basket with white and gold accents.",
    price: 39.99,
    images: [
      {
        url: "/images/488492807_122120175818744183_427004679278758560_n5.jpg",
        alt: "Easter Bunny Gift Basket Collection"
      }
    ],
    category: "Seasonal",
    isActive: true
  }
];

async function seedProducts() {
  try {
    // Connect to the database
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing products if needed
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert the new products
    const result = await Product.insertMany(products);
    console.log(`Successfully seeded ${result.length} products`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

// Run the seed function
seedProducts(); 