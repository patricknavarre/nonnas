import { NextResponse } from 'next/server';
import { Product } from '@/models/Product';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({ isActive: true });
    
    // Ensure all products have a category, defaulting to 'Seasonal' if not set
    const productsWithCategories = products.map(product => {
      const productObj = product.toObject();
      return {
        ...productObj,
        category: productObj.category || 'Seasonal'
      };
    });
    
    return NextResponse.json(productsWithCategories);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // For now, we'll skip authentication checks
    await connectDB();
    const body = await request.json();
    
    // Ensure category is set, default to 'Seasonal' if not provided
    if (!body.category) {
      body.category = 'Seasonal';
    }
    
    const product = await Product.create(body);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 