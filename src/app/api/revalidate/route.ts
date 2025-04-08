import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// GET endpoint to revalidate paths
export async function GET(request: NextRequest) {
  try {
    // Get the path to revalidate
    const path = request.nextUrl.searchParams.get('path') || '/';
    const secret = request.nextUrl.searchParams.get('secret');
    
    // If a secret was provided and it doesn't match, return unauthorized
    if (process.env.REVALIDATE_SECRET && secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Invalid secret' },
        { status: 401 }
      );
    }
    
    console.log(`Revalidating path: ${path}`);
    
    // Revalidate the specified path
    revalidatePath(path);
    
    // Return success
    return NextResponse.json({
      success: true, 
      revalidated: true, 
      path,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error revalidating path:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error revalidating', 
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 