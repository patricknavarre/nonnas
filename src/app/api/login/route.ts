import { NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  console.log('Login API called');
  try {
    const body = await request.json();
    const { username, password } = body;
    
    console.log('Credentials received:', { username, passwordProvided: !!password });
    console.log('Env variables check:', { 
      hasUsername: !!process.env.ADMIN_USERNAME, 
      hasPassword: !!process.env.ADMIN_PASSWORD,
      usernameMatch: username === process.env.ADMIN_USERNAME
    });
    
    // Check admin credentials
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      console.log('Credentials matched');
      
      // Create JWT token
      const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret';
      console.log('Using secret:', { hasSecret: !!process.env.NEXTAUTH_SECRET, usingFallback: !process.env.NEXTAUTH_SECRET });
      
      const token = jwt.sign(
        { 
          id: '1',
          name: 'Admin',
          email: 'admin@example.com',
          role: 'admin'
        },
        secret,
        { expiresIn: '1d' }
      );
      
      console.log('Token generated, length:', token.length);
      
      // Create a response
      const response = NextResponse.json({ 
        success: true,
        message: 'Login successful',
        debug: {
          tokenLength: token.length,
          cookieSet: true
        }
      });
      
      // IMPORTANT FIX: For development environments, set secure to false since we're using http
      const isProduction = process.env.NODE_ENV === 'production';
      console.log('Environment:', process.env.NODE_ENV, 'Setting secure:', isProduction);
      
      // Set the cookie directly on the response
      response.cookies.set({
        name: 'admin-token',
        value: token,
        httpOnly: true,
        secure: false, // Changed from process.env.NODE_ENV === 'production' to allow http in development
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
        sameSite: 'lax',
      });
      
      console.log('Cookie set on response, cookie settings:', {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24,
        path: '/',
        sameSite: 'lax'
      });
      return response;
    }
    
    console.log('Invalid credentials');
    // Invalid credentials
    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 