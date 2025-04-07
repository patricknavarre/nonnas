'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { IProduct } from '@/models/Product';
import type { Session } from 'next-auth';

export default function AdminProducts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    // Fetch products
    const fetchProducts = async () => {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session?.user?.role || session.user.role !== 'admin') {
    return <div>Access Denied</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button
          onClick={() => router.push('/admin/products/add')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            {product.images[0] && (
              <img
                src={product.images[0].url}
                alt={product.images[0].alt}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            <p className="text-gray-600 mb-2">${product.price}</p>
            <p className="text-gray-500 mb-4 line-clamp-2">{product.description}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => router.push(`/admin/products/edit/${product._id}`)}
                className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 