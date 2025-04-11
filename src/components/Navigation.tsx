'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import CartIcon from "@/components/CartIcon";

export default function Navigation() {
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b southern-border fixed w-full z-50">
      <div className="southern-container px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="rounded-full overflow-hidden bg-white border border-gray-200 shadow-sm">
              <Image
                src="/images/NonnaAndRues.jpg"
                alt="Nonna & Rue's"
                width={60}
                height={60}
                className="h-12 w-12"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold text-southern-brown font-display ml-3">Nonna & Rue's</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 font-body text-gray-600">
            <div className="relative">
              <button 
                className="hover:text-southern-accent transition-colors flex items-center"
                onMouseEnter={() => setIsCollectionsOpen(true)}
                onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
              >
                Shop Collections
                <svg 
                  className={`w-4 h-4 ml-1 transition-transform ${isCollectionsOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isCollectionsOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2"
                  onMouseLeave={() => setIsCollectionsOpen(false)}
                >
                  <Link 
                    href="/products"
                    className="block px-4 py-2 text-gray-600 hover:bg-southern-cream hover:text-southern-brown transition-colors"
                  >
                    All Products
                  </Link>
                  <Link 
                    href="/products?category=Home Decor" 
                    className="block px-4 py-2 text-gray-600 hover:bg-southern-cream hover:text-southern-brown transition-colors"
                  >
                    Home Decor
                  </Link>
                  <Link 
                    href="/products?category=Baby Goods/Kids Goods" 
                    className="block px-4 py-2 text-gray-600 hover:bg-southern-cream hover:text-southern-brown transition-colors"
                  >
                    Baby & Kids Goods
                  </Link>
                  <Link 
                    href="/products?category=Apparel & Clothing" 
                    className="block px-4 py-2 text-gray-600 hover:bg-southern-cream hover:text-southern-brown transition-colors"
                  >
                    Apparel & Clothing
                  </Link>
                  <Link 
                    href="/products?category=Seasonal" 
                    className="block px-4 py-2 text-gray-600 hover:bg-southern-cream hover:text-southern-brown transition-colors"
                  >
                    Seasonal
                  </Link>
                </div>
              )}
            </div>
            <Link 
              href="/about" 
              className="hover:text-southern-accent transition-colors"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="hover:text-southern-accent transition-colors"
            >
              Contact
            </Link>
            <CartIcon />
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
} 