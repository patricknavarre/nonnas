import Image from 'next/image';
import Link from 'next/link';

// Force the page to be dynamically rendered on each request
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function About() {
  // Hard-coded content with the exact text provided by the user
  const aboutHeader = 'Our Story';
  const aboutSubheader = 'A mother-daughter journey of passion, creativity, and gracious charm';
  const sectionHeader = 'The Heart Behind Nonna & Rue\'s';
  const aboutText1 = 'Nonna & Rue\'s began as a dream shared between a mother and daughter in the heart of Shreveport, Louisiana. Rhonda "Nonna" and her daughter "Rue" always shared a special bond through their love of unique gifts.';
  const aboutText2 = 'What started as weekend adventures hunting for one-of-a-kind pieces at local places soon blossomed into something more. In March of 2025, they took a leap of faith and opened their shop in The Grove of Shreveport, a multi-vendor boutique in Shreveport\'s historic downtown.';
  const aboutText3 = '"We wanted to create a space that felt like an extension of our home," Lauren recalls. "A place where people could find gifts that are grab-n-go, wrapped & ready, or last-minute life savers."';
  const aboutText4 = 'Rhonda, affectionally known as "Nonna "to her grandchildren and now to their loyal customers, brings an eye for timeless classic elegance to their collection. Her and her husband (Paul) of over 38 years, have three adult children and five grandchildren. Lauren, or "Rue" as she has been called since a teenager, contributes a contemporary perspective that keeps their offering fresh and exciting. Lauren is a part-time pediatric nurse and a mother of two. Her husband (Colton) works for the Shreveport Fire Department and is also the proud owner of a stump grinding business.';
  const aboutText5 = 'Together, they have curated a boutique that seamlessly blends vintage charm with modern sensibilities, offering everything from home décor, baby, kids, teens, adults, and seasonal items.';

  return (
    <div className="pt-24 pb-16 bg-southern-cream">
      {/* Hero Section */}
      <section className="py-16 bg-southern-brown text-southern-cream">
        <div className="southern-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              {aboutHeader}
            </h1>
            <p className="text-xl md:text-2xl font-body">
              {aboutSubheader}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="southern-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image 
                src="/images/476039941_122105930114744183_6584762113099596052_FOUNDERS.jpg" 
                alt="Rhonda and Lauren - The founders of Nonna & Rue's" 
                width={600} 
                height={500}
                className="rounded-lg shadow-lg object-cover"
                unoptimized
              />
            </div>
            <div>
              <h2 className="text-3xl font-heading font-semibold text-southern-brown mb-6">{sectionHeader}</h2>
              <div className="prose prose-lg text-gray-700 max-w-none">
                <p className="mb-4">
                  {aboutText1}
                </p>
                <p className="mb-4">
                  {aboutText2}
                </p>
                <p className="mb-4">
                  {aboutText3}
                </p>
                <p className="mb-4">
                  {aboutText4}
                </p>
                <p>
                  {aboutText5}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy Section */}
      <section className="py-20 bg-gradient-to-b from-southern-beige/30 to-southern-beige/10 relative">
        <div className="absolute inset-0 bg-[url('/images/texture-bg.png')] opacity-5"></div>
        <div className="southern-container relative z-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-southern-brown mb-4 text-center">Our Philosophy</h2>
          <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto mb-12">The guiding principles that shape everything we do at Nonna & Rue's.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-southern-accent/20 hover:border-southern-accent transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl group">
              <div className="text-center mb-4">
                <span className="inline-block p-3 bg-southern-accent/10 rounded-full group-hover:bg-southern-accent/20 transition-colors">
                  <svg className="w-8 h-8 text-southern-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                  </svg>
                </span>
              </div>
              <h3 className="text-2xl font-heading font-semibold text-southern-brown mb-4 text-center">God First</h3>
              <p className="text-gray-700">
                We put God first in all that we do, crafting a heartfelt shopping experience rooted in faith, family, and love. Our philosophy is rooted in honoring God, infusing every treasure we offer with the warmth and values of our close-knit family.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-southern-accent/20 hover:border-southern-accent transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl group">
              <div className="text-center mb-4">
                <span className="inline-block p-3 bg-southern-accent/10 rounded-full group-hover:bg-southern-accent/20 transition-colors">
                  <svg className="w-8 h-8 text-southern-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
              </div>
              <h3 className="text-2xl font-heading font-semibold text-southern-brown mb-4 text-center">Quality Over Quantity</h3>
              <p className="text-gray-700">
                Every item in our shop is personally selected by Nonna or Rue with careful attention to craftmanship, materials, and the joy it will bring to its new home. We believe in items that last and become part of your story.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-southern-accent/20 hover:border-southern-accent transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl group">
              <div className="text-center mb-4">
                <span className="inline-block p-3 bg-southern-accent/10 rounded-full group-hover:bg-southern-accent/20 transition-colors">
                  <svg className="w-8 h-8 text-southern-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </div>
              <h3 className="text-2xl font-heading font-semibold text-southern-brown mb-4 text-center">Joy in the Unexpected</h3>
              <p className="text-gray-700">
                We delight in finding and sharing unique treasures that surprise and delight. Our collections are ever-changing, ensuring that each visit to Nonna & Rue's offers new discoveries.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/products" className="inline-block bg-southern-brown text-white px-8 py-3 rounded-full font-medium hover:bg-southern-brown/90 transition-colors transform hover:scale-105 shadow-md">
              Experience Our Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Growth Story Section */}
      <section className="py-16">
        <div className="southern-container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-heading font-semibold text-southern-brown mb-8 text-center">From Dream to Reality</h2>
            
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p className="mb-4">
                What began as a dream has become a beloved new addition to Shreveport. Nonna & Rue's found its home in The Grove, a charming location with character that perfectly matches their aesthetic.
              </p>
              
              <p className="mb-4">
                "Even though we've only been open a few months, we've already built wonderful relationships with our customers," Rhonda shares. "We're getting to know their names, their stories, and what brings them joy."
              </p>
              
              <p>
                Their shop has become more than just a place to find gifts—it's a gathering space for the community. Their popular "Sip & Shop" evenings have become eagerly anticipated social events where customers can discover new treasures while enjoying the warm hospitality that makes Nonna & Rue's special.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visit Us Section */}
      <section className="py-16 bg-southern-brown text-southern-cream">
        <div className="southern-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-semibold mb-6">Visit Our Boutique</h2>
            
            <div className="mb-8">
              <p className="text-xl mb-2">107 N Spring Street, The Grove of Shreveport, LA</p>
              <p className="text-lg mb-6">Friday: 4pm - 7pm | Saturday: 10am - 6pm | Sunday: 12pm - 4pm</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/products" className="btn btn-primary">
                  Browse Our Collection
                </Link>
                <Link href="/contact" className="btn btn-outline text-southern-cream border-southern-cream hover:bg-southern-cream hover:text-southern-brown">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 