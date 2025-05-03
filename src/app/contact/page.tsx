import Image from 'next/image';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-southern-cream">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center pt-32">
        <div className="absolute inset-0 bg-southern-brown/70">
          <Image
            src="/images/Nonna_and_Rues_BG.jpg"
            alt="Contact Us Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto font-light">
            We'd love to hear from you
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-southern-brown mb-6">Visit Our Boutique</h2>
                
                <div className="space-y-6">
                  {/* Location */}
                  <div className="flex items-start space-x-4">
                    <div className="text-southern-accent">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-southern-brown mb-1">Location</h3>
                      <p className="text-gray-600">The Grove of Shreveport</p>
                      <p className="text-gray-600">107 N Spring Street</p>
                      <p className="text-gray-600">Shreveport, LA 71101</p>
                      <p className="text-gray-600 mt-2 italic">Enjoy free parking reserved exclusively for The Grove customers!</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start space-x-4">
                    <div className="text-southern-accent">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-southern-brown mb-1">Store Hours</h3>
                      <p className="text-gray-600 font-medium">First & Third Weekends of Each Month</p>
                      <p className="text-gray-600">Friday: 4pm - 7pm</p>
                      <p className="text-gray-600">Saturday: 10am - 6pm</p>
                      <p className="text-gray-600">Sunday: 12pm - 4pm</p>
                      <p className="text-gray-600 mt-2 italic">Special Events/Holiday Shopping posted on Website & Facebook</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="text-southern-accent">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-southern-brown mb-1">Email</h3>
                      <a href="mailto:nonnaandrue@gmail.com" className="text-southern-accent hover:text-southern-accent/80 transition-colors">
                        nonnaandrue@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="flex items-start space-x-4">
                    <div className="text-southern-accent">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-southern-brown mb-1">Our Categories</h3>
                      <p className="text-gray-600">Home Décor</p>
                      <p className="text-gray-600">Baby/Kids</p>
                      <p className="text-gray-600">Teen/Adults</p>
                      <p className="text-gray-600">Seasonal</p>
                      <p className="text-gray-600">Kitchen</p>
                      <p className="text-gray-600">Stationary</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-southern-brown mb-6">Send Us a Message</h2>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-southern-accent focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-southern-accent focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-southern-accent focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-southern-accent focus:border-transparent"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-southern-brown text-white py-3 px-6 rounded-md hover:bg-southern-brown/90 transition-colors font-medium"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-southern-brown mb-8 text-center">Find Us</h2>
            <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3351.0446475700392!2d-93.7518493!3d32.866899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8636d2e2c1402f2d%3A0x58d73d6a0e43df10!2s107%20N%20Spring%20St%2C%20Shreveport%2C%20LA%2071101!5e0!3m2!1sen!2sus!4v1710367161099!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 