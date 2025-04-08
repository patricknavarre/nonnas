import { NextResponse } from 'next/server';
import { Product } from '@/models/Product';
import connectDB from '@/lib/mongodb';

interface Params {
  params: {
    id: string;
  };
}

// Get a single product by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const id = params.id;
    await connectDB();
    
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// Update a product
export async function PUT(request: Request, { params }: Params) {
  try {
    // For now, we'll skip authentication checks
    const id = params.id;
    const body = await request.json();
    
    await connectDB();
    
    const product = await Product.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// Delete a product
export async function DELETE(request: Request, { params }: Params) {
  try {
    // For now, we'll skip authentication checks
    const id = params.id;
    
    await connectDB();
    
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 