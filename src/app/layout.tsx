import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { CartProvider } from "@/components/CartContext";
import Navigation from "@/components/Navigation";

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

// Force dynamic rendering to prevent layout caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lora.variable} bg-southern-cream`}>
        <SessionProvider>
          <CartProvider>
            <Navigation />
            {children}
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
