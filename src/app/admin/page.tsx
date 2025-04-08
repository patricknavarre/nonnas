'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// Define stats type
interface Stats {
  totalProducts: number;
  pendingOrders: number;
  totalSales: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    pendingOrders: 0,
    totalSales: 0
  });
  const [error, setError] = useState('');

  // Check authentication and fetch stats when session is available
  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        
        // Fetch product count
        const productsResponse = await fetch('/api/products');
        if (productsResponse.ok) {
          const products = await productsResponse.json();
          setStats(prev => ({
            ...prev,
            totalProducts: products.length
          }));
        }
        
        // Fetch pending orders count (using hardcoded demo data for now)
        setStats(prev => ({
          ...prev,
          pendingOrders: 2
        }));
        
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    }

    // Only fetch stats if authenticated and has admin role
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchStats();
    } else if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status, session]);

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === "loading" || (isLoading && status === 'authenticated')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-southern-cream">
        <div className="w-12 h-12 border-4 border-southern-beige border-t-southern-brown rounded-full animate-spin"></div>
      </div>
    );
  }

  // Check if the user has admin privileges
  if (session && session.user && session.user.role !== "admin") {
    return (
      <div className="min-h-screen bg-southern-cream p-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-southern-brown mb-4">Access Denied</h1>
          <p className="text-gray-700 mb-4">
            You do not have permission to access the admin dashboard.
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-southern-green text-white rounded hover:bg-southern-green/80"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Return null while loading to prevent flash of redirect
  if (status !== 'authenticated') {
    return null;
  }

  const adminSections = [
    {
      title: "Products",
      description: "Add, edit, and manage your product catalog",
      link: "/admin/products",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      title: "Orders",
      description: "View and manage customer orders",
      link: "/admin/orders",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      title: "Settings",
      description: "Configure website settings and preferences",
      link: "/admin/settings",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-southern-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-southern-brown">Admin Dashboard</h1>
              <p className="mt-1 text-lg text-gray-600">
                Welcome, {session.user.name || 'Admin'}! Manage your boutique from here.
              </p>
            </div>
            <Link
              href="/api/auth/signout"
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
            >
              Logout
            </Link>
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {adminSections.map((section, index) => (
              <Link key={index} href={section.link} className="block h-full">
                <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow h-full flex flex-col p-6 border border-gray-100">
                  <div className="text-southern-accent mb-4">{section.icon}</div>
                  <h2 className="text-xl font-bold text-southern-brown mb-2">{section.title}</h2>
                  <p className="text-gray-600 mb-4 flex-grow">{section.description}</p>
                  <div className="text-southern-accent font-medium flex items-center">
                    Go to {section.title}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-southern-brown mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-southern-cream rounded-lg p-4">
                <p className="text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-southern-brown">{stats.totalProducts}</p>
              </div>
              <div className="bg-southern-cream rounded-lg p-4">
                <p className="text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-southern-brown">{stats.pendingOrders}</p>
              </div>
              <div className="bg-southern-cream rounded-lg p-4">
                <p className="text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-southern-brown">${stats.totalSales.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 