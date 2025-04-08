import { NextResponse } from 'next/server';
import { Setting, defaultSettings } from '@/models/Setting';
import connectDB from '@/lib/mongodb';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';

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
export async function GET() {
  try {
    await connectDB();
    
    // Initialize default settings if needed
    await initializeSettings();
    
    // Get all settings
    const settings = await Setting.find({}).sort({ group: 1, label: 1 });
    
    return NextResponse.json(settings);
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
    
    // Handle both single setting update and bulk update
    if (Array.isArray(body)) {
      // Bulk update
      const updateOperations = body.map(setting => ({
        updateOne: {
          filter: { key: setting.key },
          update: { $set: { value: setting.value } },
          upsert: false
        }
      }));
      
      const result = await Setting.bulkWrite(updateOperations);
      updatedSettings = await Setting.find({ 
        key: { $in: body.map(s => s.key) } 
      });
    } else {
      // Single setting update
      updatedSettings = await Setting.findOneAndUpdate(
        { key: body.key },
        { $set: { value: body.value } },
        { new: true }
      );
    }
    
    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
} 