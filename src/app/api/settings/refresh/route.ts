import { NextResponse } from 'next/server';
import { Setting } from '@/models/Setting';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';

// Helper to forcefully revalidate multiple paths
async function forceRevalidatePaths() {
  const paths = [
    '/',
    '/about',
    '/products',
    '/contact',
    '/admin',
    '/admin/settings'
  ];
  
  // Revalidate each path individually
  for (const path of paths) {
    console.log(`Forcefully revalidating path: ${path}`);
    revalidatePath(path, 'layout');
    
    // Also try with and without trailing slash
    if (!path.endsWith('/') && path !== '/') {
      revalidatePath(`${path}/`, 'layout');
    }
  }
  
  return paths.length;
}

// GET to refresh all settings in the database
export async function GET() {
  try {
    console.log('Refreshing all settings...');
    await connectDB();
    
    // Query all settings and update the timestamps to force a refresh
    const result = await Setting.updateMany(
      {}, // Match all documents
      { $set: { updatedAt: new Date() } } // Update the timestamp
    );
    
    // Revalidate paths
    const pathCount = await forceRevalidatePaths();
    
    return NextResponse.json({
      success: true,
      message: `Refreshed ${result.modifiedCount} settings and revalidated ${pathCount} paths`,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Vary': '*'
      }
    });
  } catch (error) {
    console.error('Error refreshing settings:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to refresh settings',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// POST handler to refresh the site settings
export async function POST() {
  try {
    // Connect to the database
    await connectDB();
    
    // Define a simple model for system settings if it doesn't exist
    const SystemModel = mongoose.models.System || 
      mongoose.model('System', new mongoose.Schema({
        _id: String,
        timestamp: Date
      }));
    
    // Update the refresh timestamp
    await SystemModel.findByIdAndUpdate(
      'refresh_timestamp',
      { timestamp: new Date() },
      { upsert: true }
    );
    
    // Clear any cached data by updating all settings with their current values
    const settings = await Setting.find({});
    for (const setting of settings) {
      await Setting.updateOne(
        { _id: setting._id },
        { $set: { updatedAt: new Date() } }
      );
    }
    
    // Forcefully revalidate all important paths
    const pathCount = await forceRevalidatePaths();
    
    // Return success response with no-cache headers
    return NextResponse.json({ 
      success: true, 
      message: `Site refreshed successfully. Revalidated ${pathCount} paths.`,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Vary': '*'
      }
    });
  } catch (error) {
    console.error('Error refreshing site:', error);
    return NextResponse.json({ success: false, message: 'Failed to refresh site' }, { status: 500 });
  }
} 