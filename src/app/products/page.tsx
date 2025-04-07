'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import { useState, useEffect } from 'react';

// Product data with dummy information
const products = [
  {
    id: 1,
    name: "Rustic Frame Collection",
    description: "Beautifully distressed wooden frames in various sizes to display your cherished memories.",
    price: "$24.99 - $49.99",
    imageSrc: "/images/487936279_122120175872744183_2083276447989818708_n1.jpg",
    category: "Home Décor",
  },
  {
    id: 2,
    name: "Ceramic Vase Set",
    description: "Elegant set of handcrafted ceramic vases with a subtle cream glaze, perfect for fresh or dried flowers.",
    price: "$38.99",
    imageSrc: "/images/488710333_122120175884744183_7905290102645973840_n2.jpg",
    category: "Home Décor",
  },
  {
    id: 3,
    name: "Farmhouse Table Runner",
    description: "Elevate your table setting with our premium cotton table runner, featuring classic Southern designs.",
    price: "$29.99",
    imageSrc: "/images/487812383_122120175842744183_7049025500246276914_n3.jpg",
    category: "Table & Kitchen",
  },
  {
    id: 4,
    name: "Handwoven Basket Collection",
    description: "Versatile storage solutions with Southern charm, perfect for organizing any space in your home.",
    price: "$34.99 - $59.99",
    imageSrc: "/images/488898200_122120175830744183_7304860668947672558_n4.jpg",
    category: "Home Décor",
  },
  {
    id: 5,
    name: "Southern Spice Jar Set",
    description: "Keep your kitchen organized with these charming spice jars featuring hand-lettered labels.",
    price: "$42.99",
    imageSrc: "/images/488492807_122120175818744183_427004679278758560_n5.jpg",
    category: "Table & Kitchen",
  },
  {
    id: 6,
    name: "Vintage-Inspired Wall Art",
    description: "Add character to your walls with our collection of vintage-inspired prints celebrating Southern living.",
    price: "$32.99",
    imageSrc: "/images/487960451_122120175806744183_7234243251571161358_n6.jpg",
    category: "Home Décor",
  },
  {
    id: 7,
    name: "Weathered Wood Wall Shelf",
    description: "Functional and stylish, this distressed wood shelf adds rustic charm while providing display space.",
    price: "$56.99",
    imageSrc: "/images/488608399_122120175722744183_514367544990633102_n7.jpg",
    category: "Home Décor",
  },
];

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState<{[key: number]: boolean}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [activeCategory, setActiveCategory] = useState('All Products');

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    
    // Show "Added" status for 1.5 seconds
    setAddedToCart(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  // Generate search suggestions
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      return;
    }

    const allWords = products.flatMap(product => {
      return [
        ...product.name.split(' '),
        ...product.description.split(' '),
        product.category
      ];
    });

    const uniqueWords = [...new Set(allWords)].filter(word => 
      word.toLowerCase().includes(searchTerm.toLowerCase()) && 
      word.length > 2
    );

    setSuggestions(uniqueWords.slice(0, 5));
  }, [searchTerm]);

  // Filter products based on search term and category
  useEffect(() => {
    let filtered = products;
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (activeCategory !== 'All Products') {
      filtered = filtered.filter(product => product.category === activeCategory);
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, activeCategory]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

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
            <button 
              className={`btn btn-outline ${activeCategory === 'All Products' ? 'bg-southern-brown text-white' : 'bg-white'}`}
              onClick={() => handleCategoryChange('All Products')}
            >
              All Products
            </button>
            <button 
              className={`btn btn-outline ${activeCategory === 'Home Décor' ? 'bg-southern-brown text-white' : ''}`}
              onClick={() => handleCategoryChange('Home Décor')}
            >
              Home Décor
            </button>
            <button 
              className={`btn btn-outline ${activeCategory === 'Table & Kitchen' ? 'bg-southern-brown text-white' : ''}`}
              onClick={() => handleCategoryChange('Table & Kitchen')}
            >
              Table & Kitchen
            </button>
            <button 
              className={`btn btn-outline ${activeCategory === 'Garden & Porch' ? 'bg-southern-brown text-white' : ''}`}
              onClick={() => handleCategoryChange('Garden & Porch')}
            >
              Garden & Porch
            </button>
          </div>

          {/* No Results Message */}
          {filteredProducts.length === 0 && (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="card overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative h-80 w-full overflow-hidden group">
                  <Image 
                    src={product.imageSrc} 
                    alt={product.name} 
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
                    <h2 className="font-heading text-xl text-southern-brown">{product.name}</h2>
                    <span className="text-southern-accent font-medium">{product.price}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <Link href={`/products/${product.id}`} className="text-southern-brown hover:text-southern-accent transition-colors font-medium flex items-center">
                      View Details
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <button 
                      onClick={() => handleAddToCart(product)} 
                      className="btn btn-primary py-1 px-3"
                    >
                      {addedToCart[product.id] ? '✓ Added' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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