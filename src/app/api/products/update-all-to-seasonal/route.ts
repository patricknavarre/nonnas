import { NextResponse } from 'next/server';
import { Product } from '@/models/Product';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    
    // Update all products to have the Seasonal category
    const result = await Product.updateMany(
      {}, // Match all products
      { $set: { category: 'Seasonal' } }
    );

    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} products to Seasonal category`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating products:', error);
    return NextResponse.json(
      { error: 'Failed to update products' },
      { status: 500 }
    );
  }
} 