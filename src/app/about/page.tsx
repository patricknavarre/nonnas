import Image from 'next/image';
import Link from 'next/link';
import { getSetting } from '@/lib/settings';

export default async function About() {
  // Get about page settings from the database
  const aboutHeader = await getSetting<string>('about_header', 'Our Story');
  const aboutSubheader = await getSetting<string>('about_subheader', 'A mother-daughter journey of passion, creativity, and Southern hospitality');
  const sectionHeader = await getSetting<string>('about_section_header', 'The Heart Behind Nonna & Rue\'s');
  const aboutText1 = await getSetting<string>('about_text', 'Nonna & Rue\'s began as a dream shared between a mother and daughter in the heart of Shreveport, Louisiana. Rhonda "Nonna" and her daughter Lauren "Rue" always shared a special bond through their love of unique, handcrafted treasures.');
  const aboutText2 = await getSetting<string>('about_text_2', 'What started as weekend adventures hunting for one-of-a-kind pieces at local markets and estate sales soon blossomed into something more. In early 2024, they took a leap of faith and opened their shop in The Grove, a charming district in Shreveport\'s historic downtown.');
  const aboutText3 = await getSetting<string>('about_text_3', '"We wanted to create a space that felt like an extension of our home," Lauren recalls. "A place where people could find gifts that tell stories and bring joy, regardless of their age."');
  const aboutText4 = await getSetting<string>('about_text_4', 'Rhonda, affectionately known as "Nonna" to her grandchildren and now to their loyal customers, brings decades of Southern hospitality and an eye for timeless elegance to their collection. Lauren, or "Rue" as she\'s been called since childhood, contributes a contemporary perspective that keeps their offerings fresh and exciting.');
  const aboutText5 = await getSetting<string>('about_text_5', 'Together, they\'ve curated a boutique that seamlessly blends vintage charm with modern sensibilities, offering everything from handcrafted home décor to artisanal kitchenware, unique jewelry, and whimsical gifts that bring smiles to faces young and old.');

  return (
    <div className="pt-24 pb-16 bg-southern-cream">
      {/* Hero Section */}
      <section className="py-16 bg-southern-brown text-southern-cream">
        <div className="southern-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">{aboutHeader}</h1>
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
      <section className="py-16 bg-southern-beige/20">
        <div className="southern-container">
          <h2 className="text-3xl font-heading font-semibold text-southern-brown mb-12 text-center">Our Philosophy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-heading font-semibold text-southern-brown mb-4">Community First</h3>
              <p className="text-gray-700">
                We believe in supporting local artisans and craftspeople. Over 70% of our products are sourced from creators within Louisiana, creating a network of support that strengthens our community.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-heading font-semibold text-southern-brown mb-4">Quality Over Quantity</h3>
              <p className="text-gray-700">
                Every item in our shop is personally selected by Nonna or Rue with careful attention to craftsmanship, materials, and the joy it will bring to its new home. We believe in items that last and become part of your story.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-heading font-semibold text-southern-brown mb-4">Joy in the Unexpected</h3>
              <p className="text-gray-700">
                We delight in finding and sharing unique treasures that surprise and delight. Our collection is ever-changing, ensuring that each visit to Nonna & Rue's offers new discoveries.
              </p>
            </div>
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