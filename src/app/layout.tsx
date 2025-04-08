import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { CartProvider } from "@/components/CartContext";
import CartIcon from "@/components/CartIcon";
import Link from "next/link";
import Image from "next/image";

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
});

const lora = Lora({ 
  subsets: ["latin"],
  variable: '--font-lora',
});

export const metadata: Metadata = {
  title: "Nonna & Rue's",
  description: "Southern charm and graceful living",
};

// Shared Navigation Component
function Navigation() {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b southern-border px-8 py-4 fixed w-full z-50">
      <div className="southern-container flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/NonnaAndRues.jpg"
            alt="Nonna & Rue's"
            width={50}
            height={50}
            className="mr-3 rounded-full"
          />
          <h1 className="text-2xl font-bold text-southern-brown font-display">Nonna & Rue's</h1>
        </Link>
        <div className="flex items-center space-x-6 font-body text-gray-600">
          <Link 
            href="/products" 
            className="hover:text-southern-accent transition-colors"
          >
            Our Collection
          </Link>
          <Link 
            href="/about" 
            className="hover:text-southern-accent transition-colors"
          >
            Our Story
          </Link>
          <CartIcon />
        </div>
      </div>
    </nav>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lora.variable} bg-southern-cream`}>
        <CartProvider>
          <Navigation />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
