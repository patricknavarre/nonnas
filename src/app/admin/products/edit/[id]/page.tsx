"use client";

import { useState, useEffect, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    imageUrl: "",
    imageAlt: ""
  });
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }

    // Load product data
    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("Product not found");
          } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
          return;
        }
        
        const product = await response.json();

        setFormData({
          title: product.title,
          price: product.price.toString(),
          description: product.description,
          category: product.category,
          imageUrl: product.images?.[0]?.url || "",
          imageAlt: product.images?.[0]?.alt || ""
        });
      } catch (err) {
        console.error("Failed to load product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      loadProduct();
    }
  }, [id, status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setError("");

    try {
      // Validate form
      if (!formData.title || !formData.price || !formData.description || !formData.category) {
        throw new Error("Please fill all required fields");
      }

      // Prepare product data for API
      const productData = {
        title: formData.title,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        images: [
          {
            url: formData.imageUrl || "/images/placeholder.png",
            alt: formData.imageAlt || formData.title
          }
        ]
      };

      // Submit to API
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
      
      // Navigate back to products list
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setSaveLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-southern-cream pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-southern-beige border-t-southern-brown rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <Link 
          href="/admin/products"
          className="text-southern-green hover:text-southern-green/80"
        >
          ← Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-southern-brown mt-2">Edit Product</h1>
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
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="/images/products/your-image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter the path to your product image
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="imageAlt" className="block text-sm font-medium text-gray-700 mb-1">
              Image Alt Text *
            </label>
            <input
              type="text"
              id="imageAlt"
              name="imageAlt"
              value={formData.imageAlt}
              onChange={handleChange}
              placeholder="Description of the image"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
              required
            />
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
              className="bg-southern-green hover:bg-southern-green/90 text-white font-medium py-2 px-4 rounded"
              disabled={saveLoading}
            >
              {saveLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 