'use client';

import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCart } from '@/components/CartContext';
import type { IProduct } from '@/models/Product';

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch product');
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Unable to load product. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem = {
      id: product._id,
      name: product.title,
      price: `$${product.price.toFixed(2)}`,
      imageSrc: product.images[0]?.url || '',
      quantity: quantity,
      category: product.category
    };
    
    addToCart(cartItem, quantity);
    
    // Show "Added" status for 1.5 seconds
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-southern-cream pt-32 pb-16">
        <div className="southern-container">
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-southern-beige border-t-southern-brown rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-southern-brown">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-southern-cream pt-32 pb-16">
        <div className="southern-container">
          <div className="text-center py-16">
            <p className="text-xl text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-southern-cream">
      {/* Product Detail Content */}
      <main className="pt-32 pb-16">
        <div className="southern-container">
          <nav className="mb-8 text-sm breadcrumbs">
            <Link href="/" className="text-gray-600 hover:text-southern-accent">
              Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/products" className="text-gray-600 hover:text-southern-accent">
              Products
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-southern-accent">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="card overflow-hidden">
                <div className="relative h-[500px] w-full">
                  <Image 
                    src={product.images[0]?.url || '/images/placeholder.jpg'} 
                    alt={product.images[0]?.alt || product.title} 
                    width={800}
                    height={800}
                    className="object-contain w-full h-full"
                    unoptimized
                    priority
                  />
                </div>
              </div>
            </div>
            
            {/* Product Info */}
            <div>
              <div className="inline-block bg-southern-beige/30 text-southern-brown px-3 py-1 rounded-md mb-3">
                {product.category}
              </div>
              <h1 className="font-heading text-3xl text-southern-brown mb-2">{product.title}</h1>
              <div className="text-2xl text-southern-accent font-medium mb-6">${product.price.toFixed(2)}</div>
              
              <p className="text-gray-700 mb-8 text-lg">{product.description}</p>
              
              <div className="mb-8">
                <h3 className="font-heading text-xl text-southern-brown mb-4">Product Details</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-southern-green mr-2">•</span>
                    <span>Handcrafted with care</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-southern-green mr-2">•</span>
                    <span>Premium quality materials</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-southern-green mr-2">•</span>
                    <span>Unique Southern-inspired design</span>
                  </li>
                </ul>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center border border-gray-300 rounded-md mr-4">
                    <button 
                      onClick={decreaseQuantity}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                    <button 
                      onClick={increaseQuantity}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                    className={`btn btn-primary ${addedToCart ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  >
                    {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Free shipping on orders over $50. Standard delivery 3-5 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 