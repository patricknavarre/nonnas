'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import { useSearchParams } from 'next/navigation';
import CheckoutModal from '@/components/CheckoutModal';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);
  const searchParams = useSearchParams();
  
  // Check for success parameter in URL
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setCheckoutStatus('Order placed successfully! Thank you for your purchase.');
    }
  }, [searchParams]);

  // Calculate totals
  const subtotal = cart.reduce((total, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
    return total + price * item.quantity;
  }, 0);
  
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCompleteCheckout = () => {
    setIsModalOpen(false);
    clearCart();
  };

  return (
    <div className="min-h-screen bg-southern-cream">
      <main className="pt-32 pb-16">
        <div className="southern-container">
          <h1 className="section-title mb-8">Shopping Cart</h1>
          
          {checkoutStatus ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-lg mb-6">{checkoutStatus}</p>
              <Link href="/products" className="btn btn-primary">
                Continue Shopping
              </Link>
            </div>
          ) : cart.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-southern-beige" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h2 className="text-2xl font-heading text-southern-brown mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
              <Link href="/products" className="btn btn-primary">
                Browse Our Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b border-southern-beige">
                    <h2 className="font-heading text-xl text-southern-brown">Items in Your Cart</h2>
                  </div>
                  
                  <ul className="divide-y divide-southern-beige">
                    {cart.map((item) => (
                      <li key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center">
                        <div className="sm:flex-shrink-0 mb-4 sm:mb-0">
                          <div className="relative h-24 w-24 rounded overflow-hidden">
                            <Image 
                              src={item.imageSrc} 
                              alt={item.name} 
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        </div>
                        
                        <div className="sm:ml-6 sm:flex-1">
                          <div className="flex justify-between">
                            <h3 className="text-lg font-medium text-southern-brown">{item.name}</h3>
                            <p className="text-southern-accent font-medium">{item.price}</p>
                          </div>
                          
                          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between">
                            <div className="flex items-center border border-southern-beige rounded overflow-hidden">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-3 py-1 bg-southern-beige/10 text-southern-brown"
                              >
                                −
                              </button>
                              <span className="px-3 py-1">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-3 py-1 bg-southern-beige/10 text-southern-brown"
                              >
                                +
                              </button>
                            </div>
                            
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="mt-2 sm:mt-0 text-sm text-southern-brown hover:text-southern-accent transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="p-6 bg-southern-beige/10">
                    <button 
                      onClick={() => clearCart()}
                      className="text-southern-brown hover:text-southern-accent transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-32">
                  <div className="p-6 border-b border-southern-beige">
                    <h2 className="font-heading text-xl text-southern-brown">Order Summary</h2>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-southern-brown">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-southern-brown">${shipping.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-southern-beige pt-4 flex justify-between font-medium">
                      <span className="text-southern-brown">Total</span>
                      <span className="text-southern-accent">${total.toFixed(2)}</span>
                    </div>
                    
                    <button 
                      onClick={handleCheckout}
                      className="w-full btn btn-primary mt-6"
                      disabled={cart.length === 0}
                    >
                      Proceed to Checkout
                    </button>
                    
                    <p className="text-sm text-gray-500 text-center mt-4">
                      Secured checkout powered by Shopify
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onComplete={handleCompleteCheckout}
        cart={cart}
        subtotal={subtotal}
        shipping={shipping}
        total={total}
      />
    </div>
  );
} 