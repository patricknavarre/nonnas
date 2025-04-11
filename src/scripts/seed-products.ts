import mongoose from 'mongoose';
import { Product } from '../models/Product';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Product data
const products = [
  {
    title: "Rustic Frame Collection",
    description: "Beautifully distressed wooden frames in various sizes to display your cherished memories.",
    price: 34.99,
    images: [
      {
        url: "/images/487936279_122120175872744183_2083276447989818708_n1.jpg",
        alt: "Rustic Frame Collection"
      }
    ],
    category: "Home Decor",
    isActive: true
  },
  {
    title: "Ceramic Vase Set",
    description: "Elegant set of handcrafted ceramic vases with a subtle cream glaze, perfect for fresh or dried flowers.",
    price: 38.99,
    images: [
      {
        url: "/images/488710333_122120175884744183_7905290102645973840_n2.jpg",
        alt: "Ceramic Vase Set"
      }
    ],
    category: "Home Decor",
    isActive: true
  },
  {
    title: "Farmhouse Table Runner",
    description: "Elevate your table setting with our premium cotton table runner, featuring classic Southern designs.",
    price: 29.99,
    images: [
      {
        url: "/images/487812383_122120175842744183_7049025500246276914_n3.jpg",
        alt: "Farmhouse Table Runner"
      }
    ],
    category: "Home Decor",
    isActive: true
  },
  {
    title: "Handwoven Basket Collection",
    description: "Versatile storage solutions with Southern charm, perfect for organizing any space in your home.",
    price: 47.99,
    images: [
      {
        url: "/images/488898200_122120175830744183_7304860668947672558_n4.jpg",
        alt: "Handwoven Basket Collection"
      }
    ],
    category: "Home Decor",
    isActive: true
  },
  {
    title: "Southern Spice Jar Set",
    description: "Keep your kitchen organized with these charming spice jars featuring hand-lettered labels.",
    price: 42.99,
    images: [
      {
        url: "/images/488492807_122120175818744183_427004679278758560_n5.jpg",
        alt: "Southern Spice Jar Set"
      }
    ],
    category: "Home Decor",
    isActive: true
  },
  {
    title: "Vintage-Inspired Wall Art",
    description: "Add character to your walls with our collection of vintage-inspired prints celebrating Southern living.",
    price: 32.99,
    images: [
      {
        url: "/images/487960451_122120175806744183_7234243251571161358_n6.jpg",
        alt: "Vintage-Inspired Wall Art"
      }
    ],
    category: "Home Decor",
    isActive: true
  },
  {
    title: "Weathered Wood Wall Shelf",
    description: "Functional and stylish, this distressed wood shelf adds rustic charm while providing display space.",
    price: 56.99,
    images: [
      {
        url: "/images/488608399_122120175722744183_514367544990633102_n7.jpg",
        alt: "Weathered Wood Wall Shelf"
      }
    ],
    category: "Home Decor",
    isActive: true
  },
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