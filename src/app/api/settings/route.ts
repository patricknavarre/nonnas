import { NextResponse } from 'next/server';
import { Setting, defaultSettings } from '@/models/Setting';
import connectDB from '@/lib/mongodb';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';
import { revalidatePath } from 'next/cache';

// Helper function to check admin authentication
async function isAdmin(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;
    
    if (!token) {
      return false;
    }
    
    const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret';
    const decoded = jwt.verify(token, secret) as { role: string };
    
    return decoded.role === 'admin';
  } catch (error) {
    return false;
  }
}

// Initialize default settings if they don't exist
async function initializeSettings() {
  try {
    await connectDB();
    
    // Check if settings exist
    const count = await Setting.countDocuments();
    
    if (count === 0) {
      console.log('Initializing default settings...');
      await Setting.insertMany(defaultSettings);
      console.log('Default settings initialized');
    }
  } catch (error) {
    console.error('Error initializing settings:', error);
  }
}

// GET all settings
export async function GET(request: Request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const timestamp = searchParams.get('t') || Date.now().toString();
    
    console.log(`[${timestamp}] Settings API GET: Connecting to MongoDB...`);
    await connectDB();
    console.log(`[${timestamp}] Settings API: MongoDB connection successful`);
    
    // Initialize default settings if needed
    console.log(`[${timestamp}] Settings API: Checking if settings need to be initialized...`);
    await initializeSettings();
    
    // Get all settings
    console.log(`[${timestamp}] Settings API: Fetching settings from database...`);
    const settings = await Setting.find({}).sort({ group: 1, label: 1 });
    console.log(`[${timestamp}] Settings API: Successfully fetched ${settings.length} settings`);
    
    // Return with extremely strong no-cache headers
    return NextResponse.json(settings, {
      headers: {
        'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
        'X-Cache-Timestamp': timestamp,
        'Vary': '*'
      }
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST to update settings
export async function POST(request: Request) {
  try {
    // Check admin authentication
    const adminAuth = await isAdmin(request);
    if (!adminAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    const body = await request.json();
    
    // Validate the request body
    if (!Array.isArray(body) && (!body.key || body.value === undefined)) {
      return NextResponse.json(
        { error: 'Invalid settings data' },
        { status: 400 }
      );
    }
    
    let updatedSettings;
    const timestamp = Date.now().toString();
    console.log(`[${timestamp}] Settings API POST: Updating settings...`);
    
    // Handle both single setting update and bulk update
    if (Array.isArray(body)) {
      // Bulk update
      const updateOperations = body.map(setting => ({
        updateOne: {
          filter: { key: setting.key },
          update: { $set: { value: setting.value, updatedAt: new Date() } },
          upsert: false
        }
      }));
      
      console.log(`[${timestamp}] Bulk updating ${updateOperations.length} settings:`, 
        body.map(s => s.key).join(', '));
      
      const result = await Setting.bulkWrite(updateOperations);
      updatedSettings = await Setting.find({ 
        key: { $in: body.map(s => s.key) } 
      });
      
      console.log(`[${timestamp}] Updated ${result.modifiedCount} settings successfully`);
    } else {
      // Single setting update
      console.log(`[${timestamp}] Updating single setting: ${body.key} = ${body.value}`);
      
      updatedSettings = await Setting.findOneAndUpdate(
        { key: body.key },
        { $set: { value: body.value, updatedAt: new Date() } },
        { new: true }
      );
      
      console.log(`[${timestamp}] Setting updated successfully: ${body.key}`);
    }
    
    // Revalidate important paths
    const paths = ['/', '/about', '/admin/settings'];
    paths.forEach(path => {
      console.log(`[${timestamp}] Revalidating path: ${path}`);
      revalidatePath(path);
    });
    
    // Return with no-cache headers
    return NextResponse.json(updatedSettings, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Cache-Timestamp': timestamp,
        'Vary': '*'
      }
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
} 