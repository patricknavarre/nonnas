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
  const heroLogo = await getSetting<string>('hero_logo', '/images/NonnaAndRues.jpg');
  
  // Featured category settings
  const featuredCategory1Title = await getSetting<string>('featured_category_1_title', 'Home Decor');
  const featuredCategory1Image = await getSetting<string>('featured_category_1_image', '/images/categories/home-decor.jpg');
  const featuredCategory1Link = await getSetting<string>('featured_category_1_link', '/category/home-decor');
  
  const featuredCategory2Title = await getSetting<string>('featured_category_2_title', 'Vintage');
  const featuredCategory2Image = await getSetting<string>('featured_category_2_image', '/images/categories/vintage.jpg');
  const featuredCategory2Link = await getSetting<string>('featured_category_2_link', '/category/vintage');
  
  const featuredCategory3Title = await getSetting<string>('featured_category_3_title', 'Seasonal');
  const featuredCategory3Image = await getSetting<string>('featured_category_3_image', '/images/categories/seasonal.jpg');
  const featuredCategory3Link = await getSetting<string>('featured_category_3_link', '/category/seasonal');
  
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
      <section className="relative min-h-[90vh] flex items-center justify-center pt-32">
        <div className="absolute inset-0 bg-southern-brown/70">
          <Image
            src="/images/Nonna_and_Rues_BG.jpg"
            alt="Nonna & Rue's Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 py-12 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12">
              <div className="rounded-full overflow-hidden bg-white/90 border-4 border-white shadow-lg inline-block p-2">
                <Image 
                  src={heroLogo} 
                  alt={siteTitle}
                  width={200}
                  height={200}
                  className="rounded-full"
                  priority
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {heroHeading}
            </h1>
            <p className="text-xl md:text-2xl text-white mb-12 font-light">
              {heroSubheading}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                href="/products"
                className="btn text-lg py-4 px-10 bg-white text-southern-brown hover:bg-southern-cream transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl rounded-full font-semibold"
              >
                Shop Now
              </Link>
              <Link
                href="/about"
                className="btn text-lg py-4 px-10 border-2 border-white text-white hover:bg-white hover:text-southern-brown transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl rounded-full font-semibold"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-southern-brown mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: featuredCategory1Title, image: featuredCategory1Image, link: featuredCategory1Link },
              { title: featuredCategory2Title, image: featuredCategory2Image, link: featuredCategory2Link },
              { title: featuredCategory3Title, image: featuredCategory3Image, link: featuredCategory3Link },
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
