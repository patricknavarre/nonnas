'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import CartIcon from "@/components/CartIcon";

export default function Navigation() {
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Don't close if clicking the Shop Collections button or its children
      if (target.closest('button') && target.closest('button')?.textContent?.includes('Shop Collections')) {
        return;
      }
      
      // Only close mobile menu when clicking outside both the menu and button
      if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
      
      // Only close collections menu in desktop mode
      if (window.innerWidth >= 768 && !target.closest('.collections-menu') && !target.closest('.collections-button')) {
        setIsCollectionsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close mobile menu on navigation
  const handleMobileNavigation = () => {
    setIsMobileMenuOpen(false);
    setIsCollectionsOpen(false);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b southern-border fixed w-full z-50">
      <div className="southern-container px-4 sm:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center" onClick={handleMobileNavigation}>
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
            <h1 className="text-xl sm:text-2xl font-bold text-southern-brown font-display ml-3">Nonna & Rue's</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 font-body text-gray-600">
            <div className="relative collections-menu">
              <button 
                className="hover:text-southern-accent transition-colors flex items-center collections-button"
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
              
              {/* Desktop Dropdown Menu */}
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
                    href="/products?category=Baby/Kids" 
                    className="block px-4 py-2 text-gray-600 hover:bg-southern-cream hover:text-southern-brown transition-colors"
                  >
                    Baby/Kids
                  </Link>
                  <Link 
                    href="/products?category=Teen/Adults" 
                    className="block px-4 py-2 text-gray-600 hover:bg-southern-cream hover:text-southern-brown transition-colors"
                  >
                    Teen/Adults
                  </Link>
                  <Link 
                    href="/products?category=Seasonal" 
                    className="block px-4 py-2 text-gray-600 hover:bg-southern-cream hover:text-southern-brown transition-colors"
                  >
                    Seasonal
                  </Link>
                  <Link 
                    href="/products?category=Kitchen" 
                    className="block px-4 py-2 text-gray-600 hover:bg-southern-cream hover:text-southern-brown transition-colors"
                  >
                    Kitchen
                  </Link>
                  <Link 
                    href="/products?category=Stationary" 
                    className="block px-4 py-2 text-gray-600 hover:bg-southern-cream hover:text-southern-brown transition-colors"
                  >
                    Stationary
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
          <div className="flex items-center space-x-4 md:hidden">
            <CartIcon />
            <button 
              className="text-gray-600 mobile-menu-button focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden mobile-menu ${
            isMobileMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="py-2 space-y-1 bg-white rounded-lg shadow-lg mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsCollectionsOpen(!isCollectionsOpen);
              }}
              className="w-full text-left px-4 py-2 text-gray-600 hover:bg-southern-cream hover:text-southern-brown transition-colors flex items-center justify-between"
            >
              Shop Collections
              <svg 
                className={`w-4 h-4 transition-transform ${isCollectionsOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Mobile Collections Dropdown */}
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isCollectionsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="bg-southern-cream/20">
                <Link
                  href="/products"
                  className="block px-8 py-2 text-gray-600 hover:bg-southern-cream hover:text-southern-brown transition-colors"
                  onClick={handleMobileNavigation}
                >
                  All Products
                </Link>
                <Link
                  href="/products?category=Home Decor"
                  className="block px-8 py-2 text-gray-600 hover:bg-southern-cream hover:text-southern-brown transition-colors"
                  onClick={handleMobileNavigation}
                >
                  Home Decor
                </Link>
                <Link
                  href="/products?category=Baby/Kids"
                  className="block px-8 py-2 text-gray-600 hover:bg-southern-cream hover:text-southern-brown transition-colors"
                  onClick={handleMobileNavigation}
                >
                  Baby/Kids
                </Link>
                <Link
                  href="/products?category=Teen/Adults"
                  className="block px-8 py-2 text-gray-600 hover:bg-southern-cream hover:text-southern-brown transition-colors"
                  onClick={handleMobileNavigation}
                >
                  Teen/Adults
                </Link>
                <Link
                  href="/products?category=Seasonal"
                  className="block px-8 py-2 text-gray-600 hover:bg-southern-cream hover:text-southern-brown transition-colors"
                  onClick={handleMobileNavigation}
                >
                  Seasonal
                </Link>
                <Link
                  href="/products?category=Kitchen"
                  className="block px-8 py-2 text-gray-600 hover:bg-southern-cream hover:text-southern-brown transition-colors"
                  onClick={handleMobileNavigation}
                >
                  Kitchen
                </Link>
                <Link
                  href="/products?category=Stationary"
                  className="block px-8 py-2 text-gray-600 hover:bg-southern-cream hover:text-southern-brown transition-colors"
                  onClick={handleMobileNavigation}
                >
                  Stationary
                </Link>
              </div>
            </div>

            <Link
              href="/about"
              className="block px-4 py-2 text-gray-600 hover:bg-southern-cream hover:text-southern-brown transition-colors"
              onClick={handleMobileNavigation}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 text-gray-600 hover:bg-southern-cream hover:text-southern-brown transition-colors"
              onClick={handleMobileNavigation}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 