import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  return (
    <div className="min-h-screen bg-southern-cream">
      {/* Hero Section - Full Height with Parallax Effect */}
      <main>
        <div className="relative min-h-screen flex items-center justify-center pt-20">
          {/* Dark background for better logo contrast */}
          <div className="absolute inset-0 bg-southern-brown"></div>
          
          {/* Content centered */}
          <div className="relative z-0 container mx-auto px-6 py-12 flex flex-col items-center">
            {/* Large logo */}
            <div className="mb-16 -mt-24">
              <Image 
                src="/images/NonnaAndRues.jpg" 
                alt="Nonna and Rue's" 
                width={350}
                height={350}
                className="object-contain rounded-full"
                priority
              />
            </div>
            
            {/* Description */}
            <div className="max-w-2xl text-center mb-10 relative z-10">
              <p className="text-xl md:text-2xl text-southern-cream leading-relaxed">
                Discover our carefully curated collection of home décor and lifestyle pieces 
                that bring warmth and elegance to your Southern home.
              </p>
            </div>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 relative z-10">
              <Link
                href="/products"
                className="btn btn-primary text-base py-3 px-8"
              >
                Browse Collection
              </Link>
              <Link
                href="/about"
                className="btn btn-outline text-base py-3 px-8 text-southern-cream border-southern-cream hover:bg-southern-cream hover:text-southern-brown"
              >
                Our Story
              </Link>
            </div>
          </div>
          
          {/* Subtle scroll indicator */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <div className="animate-bounce w-10 h-10 flex items-center justify-center">
              <svg className="w-6 h-6 text-southern-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Featured Categories - Card Grid with Hover Effects */}
        <div className="py-20 bg-white">
          <div className="southern-container">
            <h2 className="section-title text-center mb-12">Shop Our Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/products" className="group">
                <div className="relative overflow-hidden rounded-xl h-80">
                  <Image 
                    src="/images/487936279_122120175872744183_2083276447989818708_n1.jpg"
                    alt="Home Décor" 
                    width={800}
                    height={800}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-southern-brown/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-heading text-2xl text-white mb-2">Home Décor</h3>
                    <p className="text-southern-beige">
                      Timeless pieces that add Southern elegance to any room
                    </p>
                  </div>
                </div>
              </Link>
              
              <Link href="/products" className="group">
                <div className="relative overflow-hidden rounded-xl h-80">
                  <Image 
                    src="/images/487812383_122120175842744183_7049025500246276914_n3.jpg"
                    alt="Table & Kitchen" 
                    width={800}
                    height={800}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-southern-brown/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-heading text-2xl text-white mb-2">Table & Kitchen</h3>
                    <p className="text-southern-beige">
                      Beautiful essentials for gracious entertaining
                    </p>
                  </div>
                </div>
              </Link>
              
              <Link href="/products" className="group">
                <div className="relative overflow-hidden rounded-xl h-80">
                  <Image 
                    src="/images/488608399_122120175722744183_514367544990633102_n7.jpg"
                    alt="Garden & Porch" 
                    width={800}
                    height={800}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-southern-brown/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-heading text-2xl text-white mb-2">Garden & Porch</h3>
                    <p className="text-southern-beige">
                      Create an inviting outdoor living space
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
          
        {/* Featured Products Section */}
        <section className="py-20 bg-southern-cream southern-bg-pattern">
          <div className="southern-container">
            <h2 className="section-title text-center">Our Charming Collection</h2>
            <p className="section-subtitle text-center mx-auto">
              Take a peek at some of our favorite pieces and designs
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[
                {
                  src: "/images/NonnaShopPic.jpg",
                  title: "Our Charming Shop",
                  desc: "Where southern elegance meets graceful living"
                },
                {
                  src: "/images/488914455_122120175896744183_8118277209099763042_nonna.jpg",
                  title: "Graceful Living",
                  desc: "Curated pieces for your Southern home"
                },
                {
                  src: "/images/488710333_122120175884744183_7905290102645973840_nonna.jpg",
                  title: "Table & Kitchen",
                  desc: "Beautiful essentials for gracious entertaining"
                }
              ].map((item, idx) => (
                <div key={idx} className="group">
                  <div className="card overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                    <div className="relative h-72 w-full overflow-hidden">
                      <Image 
                        src={item.src}
                        alt={item.title}
                        width={800}
                        height={600}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                        unoptimized
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading text-xl text-southern-brown mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* CTA Banner */}
            <div className="mt-20">
              <div className="relative rounded-xl overflow-hidden">
                <div className="absolute inset-0">
                  <Image 
                    src="/images/484334791_122115354848744183_8909163640246418595_nonna.jpg"
                    alt="Nonna and Rue's Featured Collection"
                    width={1200}
                    height={800}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-southern-brown/60"></div>
                </div>
                <div className="relative py-20 px-6 text-center">
                  <h3 className="font-heading text-3xl text-white mb-4">Experience Southern Charm</h3>
                  <p className="text-southern-beige mt-3 max-w-2xl mx-auto text-lg">
                    Our carefully selected pieces are designed to bring the warm, inviting essence of 
                    Southern hospitality into your home.
                  </p>
                  <Link href="/products" className="btn btn-primary mt-8 py-3 px-8 text-base">
                    Explore Our Collection
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-southern-brown text-white py-16">
        <div className="southern-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-heading text-2xl mb-6">Nonna & Rue's</h3>
              <p className="text-southern-beige text-lg leading-relaxed">
                Southern charm and graceful living brought to your home through our carefully 
                curated collection of home décor and lifestyle pieces.
              </p>
            </div>
            
            <div>
              <h3 className="font-heading text-2xl mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/products" className="text-southern-beige hover:text-white transition-colors text-lg">
                    Our Collection
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-southern-beige hover:text-white transition-colors text-lg">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-southern-beige hover:text-white transition-colors text-lg">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading text-2xl mb-6">Connect With Us</h3>
              <p className="text-southern-beige mb-4 text-lg">Follow us for inspiration and updates</p>
              <div className="flex space-x-6">
                <a href="https://www.facebook.com/profile.php?id=61572325515454" target="_blank" rel="noopener noreferrer" className="text-southern-beige hover:text-white transition-colors text-lg flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  Facebook
                </a>
                <a href="https://www.instagram.com/nonnaandrues" target="_blank" rel="noopener noreferrer" className="text-southern-beige hover:text-white transition-colors text-lg flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428.247-.667.642-1.272 1.153-1.772a4.91 4.91 0 011.772-1.153c.637-.247 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.04 0 2.668.01 2.985.058 4.04.045.975.207 1.504.344 1.856.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.67 0 2.986-.01 4.04-.058.975-.045 1.504-.207 1.857-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.352.3-.88.344-1.856.048-1.055.058-1.372.058-4.04 0-2.669-.01-2.985-.058-4.04-.045-.975-.207-1.504-.344-1.856a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.352-.137-.882-.3-1.857-.344-1.054-.048-1.37-.058-4.04-.058zm0 3.063a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 8.468a3.333 3.333 0 100-6.666 3.333 3.333 0 000 6.666zm6.538-8.469a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"/>
                  </svg>
                  Instagram
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-southern-beige/30 mt-12 pt-8 text-center text-southern-beige">
            <p>&copy; {new Date().getFullYear()} Nonna & Rue's. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
