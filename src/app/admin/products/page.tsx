"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: Array<{
    url: string;
    alt: string;
  }>;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsAdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load products after authentication check
    const loadProducts = async () => {
      try {
        setLoading(true);
        console.log('Fetching products from API...');
        
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`Fetched ${data.length} products from database`);
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError("Failed to load products from database");
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated' && session?.user?.role === 'admin') {
      loadProducts();
    } else if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, session, router]);

  // Show loading state while checking authentication
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-southern-cream pt-32 flex items-center justify-center">
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setDeleteId(id);
    setDeleteLoading(true);
    setError("");

    try {
      // Call the API to delete the product
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      setProducts(prev => prev.filter(product => product._id !== id));
      console.log("Product deleted:", id);
    } catch (err) {
      console.error('Delete error:', err);
      setError("Failed to delete product");
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-southern-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-southern-brown">Products</h1>
              <Link 
                href="/admin" 
                className="inline-flex items-center text-southern-green hover:text-southern-green/80 mt-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
            <Link
              href="/admin/products/add"
              className="bg-southern-green hover:bg-southern-green/90 text-white font-medium py-2 px-4 rounded"
            >
              Add New Product
            </Link>
          </div>
        </header>

        <main>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {products.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <p className="text-gray-500">No products found. Add your first product!</p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-4">
                            <Image
                              src={product.images?.[0]?.url || "/images/placeholder.png"}
                              alt={product.images?.[0]?.alt || product.title}
                              width={40}
                              height={40}
                              className="h-10 w-10 object-cover rounded"
                            />
                          </div>
                          <div className="text-sm font-medium text-gray-900">{product.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/products/edit/${product._id}`}
                          className="text-southern-green hover:text-southern-green/80 mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deleteLoading && deleteId === product._id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {deleteLoading && deleteId === product._id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 