import Link from 'next/link';
import Image from 'next/image';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-southern-cream">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b southern-border px-8 py-4 fixed w-full z-10">
        <div className="southern-container flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="rounded-full overflow-hidden bg-white border border-gray-200 shadow-sm">
              <Image 
                src="/images/NonnaAndRues.jpg" 
                alt="Nonna & Rue's" 
                width={48} 
                height={48} 
                className="h-12 w-12"
              />
            </div>
            <span className="ml-3 text-xl font-medium">Nonna & Rue's</span>
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

      {/* Not Found Content */}
      <main className="pt-32 pb-16">
        <div className="southern-container">
          <div className="text-center mb-12">
            <h1 className="section-title">Product Not Found</h1>
            <p className="section-subtitle">
              We couldn't find the product you're looking for. It may have been removed or doesn't exist.
            </p>
            
            <div className="mt-8">
              <Link href="/products" className="btn btn-primary">
                Browse Our Collection
              </Link>
            </div>
          </div>
          
          <div className="divider"></div>
          
          <div className="text-center mt-12">
            <h2 className="font-heading text-2xl text-southern-brown mb-6">
              You might be interested in these categories
            </h2>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products" className="btn btn-outline">
                All Products
              </Link>
              <Link href="/products?category=Home Décor" className="btn btn-outline">
                Home Décor
              </Link>
              <Link href="/products?category=Table & Kitchen" className="btn btn-outline">
                Table & Kitchen
              </Link>
              <Link href="/products?category=Garden & Porch" className="btn btn-outline">
                Garden & Porch
              </Link>
            </div>
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