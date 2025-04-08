import { NextResponse } from 'next/server';
import { Product } from '@/models/Product';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({ isActive: true });
    return NextResponse.json(products);
  } catch (error) {
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
    const product = await Product.create(body);
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 