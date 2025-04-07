'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';

export default function CartIcon() {
  const { itemCount } = useCart();
  
  return (
    <Link href="/cart" className="relative flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 hover:text-southern-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-southern-accent text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {itemCount}
        </span>
      )}
    </Link>
  );
} 