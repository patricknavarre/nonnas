'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import { useState, useEffect } from 'react';
import type { IProduct } from '@/models/Product';

// Convert IProduct to match the cart item format
const formatForCart = (product: IProduct) => {
  return {
    id: product._id,
    name: product.title,
    price: `$${product.price.toFixed(2)}`,
    imageSrc: product.images[0]?.url || '',
    quantity: 1,
    category: product.category
  };
};

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState<{[key: string]: boolean}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Unable to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: IProduct) => {
    const cartItem = formatForCart(product);
    addToCart(cartItem, 1);
    
    // Show "Added" status for 1.5 seconds
    setAddedToCart(prev => ({ ...prev, [product._id as string]: true }));
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product._id as string]: false }));
    }, 1500);
  };

  // Generate search suggestions
  useEffect(() => {
    if (searchTerm.trim() === '' || products.length === 0) {
      setSuggestions([]);
      return;
    }

    const allWords = products.flatMap(product => {
      return [
        ...product.title.split(' '),
        ...product.description.split(' '),
        product.category
      ];
    });

    const uniqueWords = [...new Set(allWords)].filter(word => 
      word.toLowerCase().includes(searchTerm.toLowerCase()) && 
      word.length > 2
    );

    setSuggestions(uniqueWords.slice(0, 5));
  }, [searchTerm, products]);

  // Filter products based on search term and category
  useEffect(() => {
    if (products.length === 0) return;
    
    let filtered = [...products];
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (activeCategory !== 'All Products') {
      filtered = filtered.filter(product => product.category === activeCategory);
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, activeCategory, products]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Get unique categories from products
  const categories = ['All Products', ...new Set(products.map(product => product.category))];

  return (
    <div className="min-h-screen bg-southern-cream">
      {/* Products Page Content */}
      <main className="pt-32 pb-16">
        <div className="southern-container">
          <div className="text-center mb-12">
            <h1 className="section-title">Our Collection</h1>
            <p className="section-subtitle text-center mx-auto max-w-2xl">
              Discover our carefully curated selection of Southern-inspired home décor and lifestyle pieces
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-md mx-auto mb-8 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-southern-beige rounded-md focus:outline-none focus:ring-2 focus:ring-southern-accent"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  ✕
                </button>
              )}
            </div>
            
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white mt-1 border border-southern-beige rounded-md shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className="px-4 py-2 hover:bg-southern-cream cursor-pointer"
                    onClick={() => {
                      setSearchTerm(suggestion);
                      setSuggestions([]);
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map(category => (
              <button 
                key={category}
                className={`btn btn-outline ${activeCategory === category ? 'bg-southern-brown text-white' : category === 'All Products' ? 'bg-white' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-southern-beige border-t-southern-brown rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xl text-southern-brown">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-xl text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          )}

          {/* No Results Message */}
          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-southern-brown">No products found matching your search.</p>
              <button 
                onClick={() => {setSearchTerm(''); setActiveCategory('All Products');}} 
                className="mt-4 btn btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div key={product._id} className="card overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative h-80 w-full overflow-hidden group">
                    <Image 
                      src={product.images[0]?.url || '/images/placeholder.jpg'} 
                      alt={product.images[0]?.alt || product.title} 
                      width={800}
                      height={800}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute bottom-0 left-0 bg-southern-brown/80 text-white py-1 px-3 rounded-tr-md">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="font-heading text-xl text-southern-brown">{product.title}</h2>
                      <span className="text-southern-accent font-medium">${product.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <Link href={`/products/${product._id}`} className="text-southern-brown hover:text-southern-accent transition-colors font-medium flex items-center">
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      <button 
                        onClick={() => handleAddToCart(product)} 
                        className="btn btn-primary py-1 px-3"
                      >
                        {addedToCart[product._id as string] ? '✓ Added' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-southern-brown text-white py-12">
        <div className="southern-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-heading text-xl mb-4">Nonna & Rue's</h3>
              <p className="text-southern-beige">
                Southern charm and graceful living brought to your home through our carefully 
                curated collection of home décor and lifestyle pieces.
              </p>
            </div>
            
            <div>
              <h3 className="font-heading text-xl mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/products" className="text-southern-beige hover:text-white transition-colors">
                    Our Collection
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-southern-beige hover:text-white transition-colors">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-southern-beige hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading text-xl mb-4">Connect With Us</h3>
              <p className="text-southern-beige mb-2">Follow us for inspiration and updates</p>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/profile.php?id=61572325515454" target="_blank" rel="noopener noreferrer" className="text-southern-beige hover:text-white transition-colors">
                  Facebook
                </a>
                <a href="https://www.instagram.com/nonnaandrues" target="_blank" rel="noopener noreferrer" className="text-southern-beige hover:text-white transition-colors">
                  Instagram
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-southern-beige/30 mt-8 pt-8 text-center text-southern-beige">
            <p>&copy; {new Date().getFullYear()} Nonna & Rue's. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 