'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { IProduct } from '@/models/Product';

export default function AddProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [product, setProduct] = useState<Partial<IProduct>>({
    title: '',
    description: '',
    price: 0,
    images: [{ url: '', alt: '' }],
    category: '',
    isActive: true
  });

  // Redirect if not authenticated or not admin
  if (status === 'loading') {
    return <div className="min-h-screen bg-southern-cream pt-32 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-southern-beige border-t-southern-brown rounded-full animate-spin"></div>
    </div>;
  }

  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  if (!session?.user?.role || session.user.role !== 'admin') {
    return <div className="min-h-screen bg-southern-cream pt-32 p-8">
      <h1 className="text-2xl font-bold text-southern-brown mb-4">Access Denied</h1>
      <p>You do not have permission to access this page.</p>
    </div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const handleImageChange = (index: number, field: 'url' | 'alt', value: string) => {
    const updatedImages = [...(product.images || [])];
    
    if (!updatedImages[index]) {
      updatedImages[index] = { url: '', alt: '' };
    }
    
    updatedImages[index][field] = value;
    
    setProduct(prev => ({ ...prev, images: updatedImages }));
  };

  const addImageField = () => {
    setProduct(prev => ({
      ...prev,
      images: [...(prev.images || []), { url: '', alt: '' }]
    }));
  };

  const removeImageField = (index: number) => {
    const updatedImages = [...(product.images || [])];
    updatedImages.splice(index, 1);
    setProduct(prev => ({ ...prev, images: updatedImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!product.title || !product.description || product.price <= 0) {
      setError('Please fill in all required fields');
      return;
    }

    if (!product.images?.length || !product.images[0].url) {
      setError('Please add at least one image');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Error adding product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-southern-cream pt-32 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-southern-brown">Add New Product</h1>
          <button
            onClick={() => router.push('/admin/products')}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Product Title *</label>
              <input
                type="text"
                name="title"
                value={product.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-southern-accent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-southern-accent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Price ($) *</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-southern-accent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Category *</label>
              <select
                name="category"
                value={product.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-southern-accent"
                required
              >
                <option value="">Select a category</option>
                <option value="Home Décor">Home Décor</option>
                <option value="Table & Kitchen">Table & Kitchen</option>
                <option value="Garden & Porch">Garden & Porch</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700">Images *</label>
                <button
                  type="button"
                  onClick={addImageField}
                  className="text-sm bg-southern-beige/30 px-3 py-1 rounded hover:bg-southern-beige/50"
                >
                  + Add Image
                </button>
              </div>

              {product.images?.map((image, index) => (
                <div key={index} className="mb-4 p-4 border rounded-md bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Image {index + 1}</h3>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Image URL *</label>
                      <input
                        type="text"
                        value={image.url}
                        onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-southern-accent"
                        placeholder="/images/your-image.jpg"
                        required={index === 0}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Alt Text *</label>
                      <input
                        type="text"
                        value={image.alt}
                        onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-southern-accent"
                        placeholder="Product image description"
                        required={index === 0}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={product.isActive}
                  onChange={(e) => setProduct(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-5 w-5 text-southern-accent rounded focus:ring-southern-accent"
                />
                <span>Active (visible on site)</span>
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-southern-brown text-white px-6 py-2 rounded-md hover:bg-southern-brown/90 focus:outline-none focus:ring-2 focus:ring-southern-accent disabled:bg-gray-400"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 