'use client';

import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/components/CartContext';

// Product data (should be moved to a shared data file in a real app)
const products = [
  {
    id: 1,
    name: "Rustic Frame Collection",
    description: "Beautifully distressed wooden frames in various sizes to display your cherished memories.",
    price: "$24.99 - $49.99",
    imageSrc: "/images/487936279_122120175872744183_2083276447989818708_n1.jpg",
    category: "Home Décor",
    details: [
      "Hand-distressed solid wood frames",
      "Available in 4x6, 5x7, and 8x10 sizes",
      "Neutral tones complement any decor style",
      "Each piece is uniquely weathered for authentic charm",
      "Tabletop or wall-mountable design"
    ],
    additionalImages: [
      "/images/488710333_122120175884744183_7905290102645973840_nonna.jpg",
      "/images/488898200_122120175830744183_7304860668947672558_n4.jpg"
    ]
  },
  {
    id: 2,
    name: "Ceramic Vase Set",
    description: "Elegant set of handcrafted ceramic vases with a subtle cream glaze, perfect for fresh or dried flowers.",
    price: "$38.99",
    imageSrc: "/images/488710333_122120175884744183_7905290102645973840_n2.jpg",
    category: "Home Décor",
    details: [
      "Set of 3 handcrafted ceramic vases",
      "Varying heights: 6\", 8\", and 10\"",
      "Soft cream glaze with subtle texture",
      "Food-safe for fresh flowers",
      "Timeless design complements any Southern home"
    ],
    additionalImages: [
      "/images/NonnaShopPic.jpg",
      "/images/488898200_122120175830744183_7304860668947672558_n4.jpg"
    ]
  },
  {
    id: 3,
    name: "Farmhouse Table Runner",
    description: "Elevate your table setting with our premium cotton table runner, featuring classic Southern designs.",
    price: "$29.99",
    imageSrc: "/images/487812383_122120175842744183_7049025500246276914_n3.jpg",
    category: "Table & Kitchen",
    details: [
      "100% premium cotton construction",
      "Measures 14\" x 72\"",
      "Classic blue and cream stripe pattern",
      "Machine washable for easy care",
      "Handcrafted with meticulous attention to detail"
    ],
    additionalImages: [
      "/images/488710333_122120175884744183_7905290102645973840_n2.jpg",
      "/images/488492807_122120175818744183_427004679278758560_n5.jpg"
    ]
  },
  {
    id: 4,
    name: "Handwoven Basket Collection",
    description: "Versatile storage solutions with Southern charm, perfect for organizing any space in your home.",
    price: "$34.99 - $59.99",
    imageSrc: "/images/488898200_122120175830744183_7304860668947672558_n4.jpg",
    category: "Home Décor",
    details: [
      "Natural seagrass with reinforced structure",
      "Available in small, medium, and large sizes",
      "Sturdy handles for easy carrying",
      "Neutral tone complements any decor",
      "Each basket features unique handwoven patterns"
    ],
    additionalImages: [
      "/images/488710333_122120175884744183_7905290102645973840_n2.jpg",
      "/images/487960451_122120175806744183_7234243251571161358_n6.jpg"
    ]
  },
  {
    id: 5,
    name: "Southern Spice Jar Set",
    description: "Keep your kitchen organized with these charming spice jars featuring hand-lettered labels.",
    price: "$42.99",
    imageSrc: "/images/488492807_122120175818744183_427004679278758560_n5.jpg",
    category: "Table & Kitchen",
    details: [
      "Set of 12 glass spice jars with airtight bamboo lids",
      "Hand-lettered waterproof labels for common spices",
      "4 oz capacity per jar",
      "Includes blank labels for customization",
      "Elegant rack for countertop display"
    ],
    additionalImages: [
      "/images/487812383_122120175842744183_7049025500246276914_n3.jpg",
      "/images/488608399_122120175722744183_514367544990633102_n7.jpg"
    ]
  },
  {
    id: 6,
    name: "Vintage-Inspired Wall Art",
    description: "Add character to your walls with our collection of vintage-inspired prints celebrating Southern living.",
    price: "$32.99",
    imageSrc: "/images/487960451_122120175806744183_7234243251571161358_n6.jpg",
    category: "Home Décor",
    details: [
      "Premium archival quality prints",
      "Measures 11\" x 14\" (frame not included)",
      "Vintage botanical and architectural designs",
      "Printed on acid-free heavyweight matte paper",
      "Perfect for creating a gallery wall"
    ],
    additionalImages: [
      "/images/487936279_122120175872744183_2083276447989818708_n1.jpg",
      "/images/488898200_122120175830744183_7304860668947672558_n4.jpg"
    ]
  },
  {
    id: 7,
    name: "Weathered Wood Wall Shelf",
    description: "Functional and stylish, this distressed wood shelf adds rustic charm while providing display space.",
    price: "$56.99",
    imageSrc: "/images/488608399_122120175722744183_514367544990633102_n7.jpg",
    category: "Home Décor",
    details: [
      "Reclaimed pine wood with weather-resistant finish",
      "36\" length with 8\" depth",
      "Includes all mounting hardware",
      "Hand-distressed for authentic weathered appearance",
      "Perfect for displaying collectibles or family photos"
    ],
    additionalImages: [
      "/images/487960451_122120175806744183_7234243251571161358_n6.jpg",
      "/images/488898200_122120175830744183_7304860668947672558_n4.jpg"
    ]
  },
];

export default function ProductPage({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id);
  const product = products.find(p => p.id === productId);
  
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    notFound();
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    
    // Show "Added" status for 1.5 seconds
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-southern-cream">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b southern-border px-8 py-4 fixed w-full z-10">
        <div className="southern-container flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/nonna-and-rues-logo.svg" 
              alt="Nonna & Rue's" 
              width={160} 
              height={50} 
              className="h-12 w-auto"
              unoptimized
            />
          </Link>
          <div className="space-x-6 font-body text-gray-600">
            <Link 
              href="/products" 
              className="text-southern-accent transition-colors font-medium"
            >
              Our Collection
            </Link>
            <Link 
              href="/about" 
              className="hover:text-southern-accent transition-colors"
            >
              Our Story
            </Link>
            <Link 
              href="/admin/products" 
              className="hover:text-southern-accent transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>

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
            <span className="text-southern-accent">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="card overflow-hidden">
                <div className="relative h-[500px] w-full">
                  <Image 
                    src={product.imageSrc} 
                    alt={product.name} 
                    width={800}
                    height={800}
                    className="object-contain w-full h-full"
                    unoptimized
                    priority
                  />
                </div>
              </div>
              
              {/* Additional Images */}
              <div className="grid grid-cols-2 gap-4">
                {product.additionalImages.map((img, idx) => (
                  <div key={idx} className="card overflow-hidden">
                    <div className="relative h-48 w-full">
                      <Image 
                        src={img} 
                        alt={`${product.name} - view ${idx+1}`} 
                        width={400}
                        height={300}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Product Info */}
            <div>
              <div className="inline-block bg-southern-beige/30 text-southern-brown px-3 py-1 rounded-md mb-3">
                {product.category}
              </div>
              <h1 className="font-heading text-3xl text-southern-brown mb-2">{product.name}</h1>
              <div className="text-2xl text-southern-accent font-medium mb-6">{product.price}</div>
              
              <p className="text-gray-700 mb-8 text-lg">{product.description}</p>
              
              <div className="mb-8">
                <h3 className="font-heading text-xl text-southern-brown mb-4">Product Details</h3>
                <ul className="space-y-2">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-southern-green mr-2">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex border border-southern-beige rounded overflow-hidden">
                  <button 
                    onClick={decreaseQuantity} 
                    className="bg-white px-4 py-2 hover:bg-southern-beige/20"
                  >−</button>
                  <input 
                    type="text" 
                    value={quantity} 
                    readOnly 
                    className="w-12 text-center border-none focus:outline-none" 
                  />
                  <button 
                    onClick={increaseQuantity} 
                    className="bg-white px-4 py-2 hover:bg-southern-beige/20"
                  >+</button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="btn btn-primary flex-grow"
                >
                  {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
              </div>
              
              <div className="divider"></div>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2 text-southern-green">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">Free shipping on orders over $75</span>
                </div>
                <div className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2 text-southern-green">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-gray-600">Secure checkout with credit card or PayPal</span>
                </div>
                <div className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2 text-southern-green">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-gray-600">30-day easy returns</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Products Section */}
          <section className="mt-20">
            <h2 className="section-title text-center">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
              {products
                .filter(p => p.id !== product.id && p.category === product.category)
                .slice(0, 4)
                .map(relatedProduct => (
                  <div key={relatedProduct.id} className="card overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="relative h-60 w-full overflow-hidden">
                      <Image 
                        src={relatedProduct.imageSrc} 
                        alt={relatedProduct.name} 
                        width={400}
                        height={400}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading text-lg text-southern-brown mb-1">{relatedProduct.name}</h3>
                      <div className="text-southern-accent font-medium mb-2">{relatedProduct.price}</div>
                      <Link 
                        href={`/products/${relatedProduct.id}`} 
                        className="text-southern-brown hover:text-southern-accent transition-colors text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </section>
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