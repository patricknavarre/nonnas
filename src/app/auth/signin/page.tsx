'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignInPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to admin login page
    router.push('/admin/login');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-southern-cream">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-southern-beige border-t-southern-brown rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-southern-brown">Redirecting to login...</p>
      </div>
    </div>
  );
} 