import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    console.log('Logout API called');
    
    // Get the cookie store
    const cookieStore = await cookies();
    const existingToken = cookieStore.get('admin-token');
    
    console.log('Existing token found:', !!existingToken);
    
    // Create a response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully'
    });
    
    // Properly delete the cookie
    response.cookies.set({
      name: 'admin-token',
      value: '',
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    
    console.log('Admin token cookie cleared');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to logout' },
      { status: 500 }
    );
  }
} 