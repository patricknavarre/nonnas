"use client";

import { useState, useEffect, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

// Sample products data (in a real app, this would come from a database)
const productsData: Product[] = [
  {
    id: "1",
    name: "Vintage Table Lamp",
    price: 89.99,
    description: "A beautiful vintage-inspired table lamp with brass accents and a linen shade.",
    image: "/images/products/lamp.jpg",
    category: "Lighting"
  },
  {
    id: "2",
    name: "Handcrafted Ceramic Vase",
    price: 45.00,
    description: "Unique handcrafted ceramic vase with an organic shape and earthy tones.",
    image: "/images/products/vase.jpg",
    category: "Home Decor"
  },
  {
    id: "3",
    name: "Woven Cotton Throw Pillow",
    price: 34.99,
    description: "Soft cotton throw pillow with handwoven texture and natural dyes.",
    image: "/images/products/pillow.jpg",
    category: "Textiles"
  },
];

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: ""
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
        // In a real app, fetch from API
        // For now, use our sample data
        const product = productsData.find(p => p.id === id);
        
        if (!product) {
          setError("Product not found");
          return;
        }

        setFormData({
          name: product.name,
          price: product.price.toString(),
          description: product.description,
          category: product.category,
          image: product.image
        });
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
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
      if (!formData.name || !formData.price || !formData.description || !formData.category) {
        throw new Error("Please fill all required fields");
      }

      // Here you would normally submit to an API
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Product updated:", { id, ...formData });
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setSaveLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
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
              <option value="Home Decor">Home Decor</option>
              <option value="Furniture">Furniture</option>
              <option value="Lighting">Lighting</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Art">Art</option>
              <option value="Textiles">Textiles</option>
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

          <div className="mb-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL *
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="/images/products/your-image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter the path to your product image
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
              disabled={saveLoading}
              className="bg-southern-green hover:bg-southern-green/90 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
            >
              {saveLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 