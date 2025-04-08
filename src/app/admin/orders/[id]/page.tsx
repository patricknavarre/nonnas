"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const orderId = params.id;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  
  useEffect(() => {
    // First check authentication
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (!data.authenticated) {
          console.log('Not authenticated in order detail page, redirecting to login');
          router.push(`/admin/login?from=/admin/orders/${orderId}`);
          return false;
        }
        
        return true;
      } catch (err) {
        console.error('Error checking auth status:', err);
        setError('Failed to verify authentication');
        return false;
      }
    };

    // Load order data
    const loadOrder = async () => {
      try {
        setLoading(true);
        console.log(`Fetching order ${orderId} from API...`);
        
        const response = await fetch(`/api/orders/${orderId}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Order data received:', data);
        setOrder(data);
        setNewStatus(data.status);
      } catch (err) {
        console.error('Failed to load order:', err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    const initializePage = async () => {
      const authResult = await checkAuth();
      if (authResult) {
        await loadOrder();
      }
    };

    initializePage();
  }, [orderId, router]);

  const updateOrderStatus = async () => {
    if (!order || newStatus === order.status) return;
    
    try {
      setStatusUpdating(true);
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update order status: ${response.statusText}`);
      }
      
      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      
    } catch (err) {
      console.error('Error updating order status:', err);
      setError("Failed to update order status");
    } finally {
      setStatusUpdating(false);
    }
  };

  // Function to determine badge class based on order status
  function getStatusBadgeClass(status: string) {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-amber-200 text-amber-800';
      case 'processing':
        return 'bg-sky-200 text-sky-800';
      case 'shipped':
        return 'bg-violet-200 text-violet-800';
      case 'delivered':
        return 'bg-emerald-200 text-emerald-800';
      case 'cancelled':
        return 'bg-rose-200 text-rose-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-southern-cream pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-southern-beige border-t-southern-brown rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-southern-cream pt-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-southern-brown mb-4">Order Not Found</h1>
            <p className="text-gray-700 mb-4">The order you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link 
              href="/admin/orders" 
              className="inline-flex items-center text-southern-green hover:text-southern-green/80"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-southern-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-southern-brown">Order #{order.orderNumber}</h1>
              <Link 
                href="/admin/orders" 
                className="inline-flex items-center text-southern-green hover:text-southern-green/80 mt-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Orders
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Status:</span>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="text-sm border rounded px-2 py-1 mr-2"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={updateOrderStatus}
                disabled={newStatus === order.status || statusUpdating}
                className={`px-3 py-1 rounded text-sm ${newStatus !== order.status ? 'bg-southern-brown text-white hover:bg-southern-brown/90' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                {statusUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="px-3 py-1.5 bg-southern-beige text-southern-brown rounded-full text-sm">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </div>
            <div className={`px-3 py-1.5 rounded-full text-sm ${getStatusBadgeClass(order.status)}`}>
              Status: {order.status}
            </div>
          </div>
        </header>

        <main>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-southern-brown mb-4">Customer Information</h2>
              <div className="space-y-2">
                <p className="text-gray-700"><span className="font-medium">Name:</span> {order.customer.name}</p>
                <p className="text-gray-700"><span className="font-medium">Email:</span> {order.customer.email}</p>
                {order.customer.phone && (
                  <p className="text-gray-700"><span className="font-medium">Phone:</span> {order.customer.phone}</p>
                )}
              </div>
            </div>

            {order.shippingAddress && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-southern-brown mb-4">Shipping Information</h2>
                <div className="space-y-2">
                  <p className="text-gray-700"><span className="font-medium">Address:</span> {order.shippingAddress.street}</p>
                  <p className="text-gray-700"><span className="font-medium">City:</span> {order.shippingAddress.city}</p>
                  <p className="text-gray-700"><span className="font-medium">State:</span> {order.shippingAddress.state}</p>
                  <p className="text-gray-700"><span className="font-medium">ZIP:</span> {order.shippingAddress.zipCode}</p>
                  <p className="text-gray-700"><span className="font-medium">Country:</span> {order.shippingAddress.country}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <h2 className="text-xl font-semibold text-southern-brown p-6 border-b">Order Items</h2>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500">ID: {item.productId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-500">Total</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-southern-brown">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {order.notes && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-southern-brown mb-4">Notes</h2>
              <p className="text-gray-700 whitespace-pre-line">{order.notes}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 