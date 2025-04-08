import { NextResponse } from 'next/server';
import { Setting, defaultSettings } from '@/models/Setting';
import connectDB from '@/lib/mongodb';

// GET endpoint to initialize settings
export async function GET() {
  try {
    console.log('Initializing settings API: Connecting to MongoDB...');
    await connectDB();
    console.log('Initializing settings API: MongoDB connection successful');
    
    // Clear existing settings first to ensure a clean state
    console.log('Initializing settings API: Clearing existing settings...');
    await Setting.deleteMany({});
    console.log('Initializing settings API: All settings cleared');
    
    // Insert default settings
    console.log('Initializing settings API: Inserting default settings...');
    await Setting.insertMany(defaultSettings);
    console.log(`Initializing settings API: Successfully inserted ${defaultSettings.length} settings`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully initialized ${defaultSettings.length} settings`,
      settings: defaultSettings.map(s => s.key)
    });
  } catch (error) {
    console.error('Error initializing settings:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to initialize settings',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 