'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import { useState, useEffect } from 'react';
import type { IProduct } from '@/models/Product';
import { useSearchParams } from 'next/navigation';

// Convert IProduct to match the cart item format
const formatForCart = (product: IProduct) => {
  return {
    id: product._id,
    name: product.title,
    price: `$${product.price.toFixed(2)}`,
    imageSrc: product.images[0]?.url || '',
    quantity: 1,
    category: product.category || 'Seasonal' // Default to Seasonal if no category
  };
};

export default function ProductsPage() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const [addedToCart, setAddedToCart] = useState<{[key: string]: boolean}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Get category from URL on component mount and when URL changes
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory('All Products');
    }
  }, [searchParams]);

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
        // Set all current products to "Seasonal" category if not already set
        const updatedData = data.map((product: IProduct) => ({
          ...product,
          category: product.category || 'Seasonal'
        }));
        setProducts(updatedData);
        setFilteredProducts(updatedData);
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
      const category = product.category || 'Seasonal';
      return [
        ...product.title.split(' '),
        ...product.description.split(' '),
        category
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
        (product.category || 'Seasonal').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (activeCategory !== 'All Products') {
      filtered = filtered.filter(product => {
        const productCategory = product.category || 'Seasonal';
        console.log('Product category:', productCategory, 'Active category:', activeCategory);
        return productCategory === activeCategory;
      });
    }
    
    console.log('Filtered products:', filtered.length);
    setFilteredProducts(filtered);
  }, [searchTerm, activeCategory, products]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    // Update URL without page reload
    const url = new URL(window.location.href);
    if (category === 'All Products') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', category);
    }
    window.history.pushState({}, '', url);
  };

  // Define available categories
  const categories = [
    'All Products',
    'Home Decor',
    'Baby Goods/Kids Goods',
    'Apparel & Clothing',
    'Seasonal'
  ];

  return (
    <div className="min-h-screen bg-southern-cream">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center pt-32">
        <div className="absolute inset-0 bg-southern-brown/70">
          <Image
            src="/images/Nonna_and_Rues_BG.jpg"
            alt="Our Collection Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
            {activeCategory === 'All Products' ? 'Our Collection' : activeCategory}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light">
            Discover our carefully curated selection of Southern-inspired home décor and lifestyle pieces
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16">
        <div className="container mx-auto px-6">
          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12 -mt-16 relative z-20 max-w-4xl mx-auto">
            {/* Search Box */}
            <div className="relative mb-8">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 border-2 border-southern-brown/30 rounded-full focus:outline-none focus:ring-2 focus:ring-southern-accent text-lg"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute z-30 w-full max-w-4xl left-1/2 -translate-x-1/2 bg-white mt-1 border border-gray-200 rounded-xl shadow-xl">
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className="px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
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

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map(category => (
                <button 
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === category 
                      ? 'bg-southern-brown text-white shadow-md' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
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
            <div className="bg-white rounded-lg p-8 text-center max-w-md mx-auto shadow-lg">
              <p className="text-xl text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="btn bg-southern-brown text-white px-8 py-3 rounded-full hover:bg-southern-brown/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product._id} className="group">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.images[0]?.url || '/images/placeholder.jpg'}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.isActive === false && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">Coming Soon</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-southern-brown mb-2">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-southern-brown">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.isActive || addedToCart[product._id as string]}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                          addedToCart[product._id as string]
                            ? 'bg-southern-green text-white'
                            : product.isActive
                            ? 'bg-southern-brown text-white hover:bg-southern-brown/90'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {addedToCart[product._id as string] ? 'Added!' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && !isLoading && !error && (
            <div className="text-center py-12">
              <p className="text-xl text-southern-brown mb-4">No products found</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('All Products');
                }}
                className="btn bg-southern-brown text-white px-8 py-3 rounded-full hover:bg-southern-brown/90 transition-colors"
              >
                Clear Filters
              </button>
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