import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';

export async function GET() {
  try {
    // Get the token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;
    
    console.log('Auth status check - token exists:', !!token);
    if (token) {
      console.log('Token length:', token.length);
    }

    if (!token) {
      console.log('No admin token found in cookies');
      return NextResponse.json(
        { 
          authenticated: false, 
          message: 'No token found',
          debug: {
            cookiesFound: cookieStore.getAll().map(c => c.name),
          }
        },
        { status: 401 }
      );
    }

    // Verify the token
    const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret';
    console.log('Using secret key:', secret.substring(0, 3) + '...');
    
    try {
      const decoded = jwt.verify(token, secret) as {
        id: string;
        name: string;
        email: string;
        role: string;
      };

      console.log('Token successfully verified for user:', decoded.name);
      
      return NextResponse.json({
        authenticated: true,
        user: {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role
        }
      });
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError);
      return NextResponse.json(
        { 
          authenticated: false, 
          message: 'Invalid token',
          debug: {
            error: String(verifyError)
          }
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth status error:', error);
    return NextResponse.json(
      { 
        authenticated: false, 
        message: 'Invalid token',
        debug: {
          error: String(error)
        }
      },
      { status: 401 }
    );
  }
} 