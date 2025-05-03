"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddProductPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    images: [{ url: "", alt: "" }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    // Check authentication first
    const checkAuth = async () => {
      try {
        setAuthChecking(true);
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (!data.authenticated) {
          console.log('Not authenticated in add product page, redirecting to login');
          router.push('/admin/login?from=/admin/products/add');
          return false;
        }
        
        setIsAuthenticated(true);
        return true;
      } catch (err) {
        console.error('Error checking auth status:', err);
        setError('Failed to verify authentication');
        return false;
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "imageUrl") {
      setFormData(prev => ({
        ...prev,
        images: [{ ...prev.images[0], url: value }]
      }));
    } else if (name === "imageAlt") {
      setFormData(prev => ({
        ...prev,
        images: [{ ...prev.images[0], alt: value }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate form
      if (!formData.title || !formData.price || !formData.description || !formData.category) {
        throw new Error("Please fill all required fields");
      }

      if (!formData.images[0].url) {
        throw new Error("Please provide an image URL");
      }

      // Convert price to number
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        isActive: true
      };

      // Submit to the API
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add product");
      }
      
      const result = await response.json();
      console.log("Product added:", result);
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-southern-cream pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-southern-beige border-t-southern-brown rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pt-32">
      <div className="mb-8">
        <Link 
          href="/admin/products"
          className="text-southern-green hover:text-southern-green/80"
        >
          ← Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-southern-brown mt-2">Add New Product</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
              required
            >
              <option value="">Select a category</option>
              <option value="Home Décor">Home Décor</option>
              <option value="Baby/Kids">Baby/Kids</option>
              <option value="Teen/Adults">Teen/Adults</option>
              <option value="Seasonal">Seasonal</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Stationary">Stationary</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL *
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.images[0].url}
              onChange={handleChange}
              placeholder="/images/products/your-image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="imageAlt" className="block text-sm font-medium text-gray-700 mb-1">
              Image Alt Text *
            </label>
            <input
              type="text"
              id="imageAlt"
              name="imageAlt"
              value={formData.images[0].alt}
              onChange={handleChange}
              placeholder="Brief description of the image"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Provide a short description of the image for accessibility
            </p>
          </div>

          <div className="flex justify-end">
            <Link
              href="/admin/products"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded mr-4"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-southern-green hover:bg-southern-green/90 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 