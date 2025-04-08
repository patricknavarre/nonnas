import { NextResponse } from 'next/server';
import { defaultSettings } from '@/models/Setting';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';

// Mock settings data (using the default settings)
const mockSettings = [...defaultSettings].map((setting, index) => ({
  ...setting,
  _id: `setting_${index + 1}`,
  updatedAt: new Date().toISOString()
}));

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

// GET all settings
export async function GET() {
  try {
    // Return the mock settings
    return NextResponse.json(mockSettings);
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
      body.forEach(update => {
        const settingIndex = mockSettings.findIndex(s => s.key === update.key);
        if (settingIndex >= 0) {
          mockSettings[settingIndex].value = update.value;
          mockSettings[settingIndex].updatedAt = new Date().toISOString();
        }
      });
      
      updatedSettings = mockSettings.filter(setting => 
        body.some(update => update.key === setting.key)
      );
    } else {
      // Single setting update
      const settingIndex = mockSettings.findIndex(s => s.key === body.key);
      
      if (settingIndex >= 0) {
        mockSettings[settingIndex].value = body.value;
        mockSettings[settingIndex].updatedAt = new Date().toISOString();
        updatedSettings = mockSettings[settingIndex];
      } else {
        updatedSettings = null;
      }
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