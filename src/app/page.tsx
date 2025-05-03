import Link from 'next/link';
import Image from 'next/image';
import { getSetting, getSettingsByGroup } from '@/lib/settings';
import RefreshHandler from '@/components/RefreshHandler';

// Allow some caching to prevent constant re-renders
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds instead of every request

export default async function Home() {
  // Get homepage settings from the database
  const heroHeading = await getSetting<string>('hero_heading', 'Discover Unique Treasures');
  const heroSubheading = await getSetting<string>('hero_subheading', 'Curated vintage & handcrafted home goods with southern charm');
  const siteTitle = await getSetting<string>('site_title', "Nonna & Rue's");
  
  // Featured category settings
  const featuredCategory1Title = await getSetting<string>('featured_category_1_title', 'Home Decor');
  const featuredCategory1Image = await getSetting<string>('featured_category_1_image', '/images/categories/home-decor.jpg');
  const featuredCategory1Link = await getSetting<string>('featured_category_1_link', '/products?category=Home Decor');
  
  const featuredCategory2Title = await getSetting<string>('featured_category_2_title', 'Baby/Kids');
  const featuredCategory2Image = await getSetting<string>('featured_category_2_image', '/images/categories/baby-kids.jpg');
  const featuredCategory2Link = await getSetting<string>('featured_category_2_link', '/products?category=Baby/Kids');
  
  const featuredCategory3Title = await getSetting<string>('featured_category_3_title', 'Seasonal');
  const featuredCategory3Image = await getSetting<string>('featured_category_3_image', '/images/categories/seasonal.jpg');
  const featuredCategory3Link = await getSetting<string>('featured_category_3_link', '/products?category=Seasonal');
  
  // Featured products section settings
  const featuredProductsHeading = await getSetting<string>('featured_products_heading', 'Our Featured Products');
  const featuredProductsSubheading = await getSetting<string>('featured_products_subheading', 'Hand-selected treasures for your home');
  
  // Newsletter section settings
  const newsletterHeading = await getSetting<string>('newsletter_heading', 'Join Our Community');
  const newsletterSubheading = await getSetting<string>('newsletter_subheading', 'Subscribe for updates on new arrivals and special promotions');
  
  // We'll still use a timestamp for the refresh handler but not for each setting
  const timestamp = Date.now();
  
  return (
    <div className="min-h-screen bg-southern-cream">
      {/* Client component to handle automatic refresh - with reduced frequency */}
      <RefreshHandler lastUpdate={timestamp} />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center pt-24">
        <div className="absolute inset-0 bg-southern-brown/70">
          <Image
            src="/images/Nonna_and_Rues_BG.jpg"
            alt="Nonna & Rue's Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 py-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {heroHeading}
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 font-light">
              {heroSubheading}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                href="/products"
                className="btn text-lg py-3 px-8 bg-white text-southern-brown hover:bg-southern-cream transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl rounded-full font-semibold"
              >
                Shop Now
              </Link>
              <Link
                href="/about"
                className="btn text-lg py-3 px-8 border-2 border-white text-white hover:bg-white hover:text-southern-brown transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl rounded-full font-semibold"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* From Dream to Reality Section */}
      <section className="py-16 bg-southern-cream">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-southern-brown mb-6 text-center">
              From Dream to Reality
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none text-center">
              <p className="mb-6">
                Nonna and Rue's Unique Finds began as a God-inspired dream to create a family-inspired gift destination offering curated boutique of treasures for home décor, babies and kids, teens and adults, seasonal delights, kitchen essentials, and stationary. Founded by Rhonda Navarre and Lauren Giles, our boutique reflects our love for God and family in every detail. In just a few months since opening, we have been blessed with incredible success, becoming a cherished destination for unique, heartfelt finds. Thank you for joining our dream turned reality!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-southern-brown mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Home Decor", image: "/images/categories/home-decor.jpg", link: "/products?category=Home Decor" },
              { title: "Baby/Kids", image: "/images/categories/baby-kids.jpg", link: "/products?category=Baby/Kids" },
              { title: "Teen/Adults", image: "/images/categories/teen-adults.jpg", link: "/products?category=Teen/Adults" },
              { title: "Seasonal", image: "/images/categories/seasonal.jpg", link: "/products?category=Seasonal" },
              { title: "Kitchen", image: "/images/categories/kitchen.jpg", link: "/products?category=Kitchen" },
              { title: "Stationary", image: "/images/categories/stationary.jpg", link: "/products?category=Stationary" },
            ].map((category, index) => (
              <Link
                key={index}
                href={category.link}
                className="group relative overflow-hidden rounded-lg aspect-square"
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">
                    {category.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-southern-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-southern-brown mb-4">
              {featuredProductsHeading}
            </h2>
            <p className="text-lg text-gray-600">
              {featuredProductsSubheading}
            </p>
          </div>
          {/* Featured products grid will be added here */}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-southern-brown text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              {newsletterHeading}
            </h2>
            <p className="text-lg mb-8">
              {newsletterSubheading}
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded text-gray-900"
                required
              />
              <button
                type="submit"
                className="btn btn-primary bg-southern-green hover:bg-southern-green/90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
