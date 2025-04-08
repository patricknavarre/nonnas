import React from 'react';
import { Playfair_Display, Lora } from "next/font/google";
import Link from 'next/link';
import Image from 'next/image';

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
});

const lora = Lora({ 
  subsets: ["latin"],
  variable: '--font-lora',
});

// Admin-specific navigation component
function AdminNav() {
  return (
    <nav className="bg-white border-b px-8 py-4 fixed top-[72px] w-full z-40">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/admin" className="flex items-center">
          <span className="text-xl font-bold text-southern-brown font-display">Admin Dashboard</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link 
            href="/admin" 
            className="px-3 py-1 text-gray-600 hover:text-southern-accent transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            href="/admin/products" 
            className="px-3 py-1 text-gray-600 hover:text-southern-accent transition-colors"
          >
            Products
          </Link>
          <Link 
            href="/admin/settings" 
            className="px-3 py-1 text-gray-600 hover:text-southern-accent transition-colors"
          >
            Settings
          </Link>
          <Link 
            href="/" 
            className="px-3 py-1 bg-southern-brown text-white rounded-md hover:bg-southern-brown/90 transition-colors flex items-center"
            target="_blank"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            View Site
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${playfair.variable} ${lora.variable}`}>
      <AdminNav />
      <div className="pt-[144px]">
        {children}
      </div>
    </div>
  );
} 