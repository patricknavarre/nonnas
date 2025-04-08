"use client";

import { useState, useEffect, FormEvent } from "react";
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

export default function EditOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const orderId = params.id;
  
  const [formData, setFormData] = useState<{
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    status: string;
    paymentMethod: string;
    notes: string;
  }>({
    orderNumber: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    status: "Pending",
    paymentMethod: "",
    notes: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);

  // Status options
  const statusOptions = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
  ];
  
  // Payment method options
  const paymentOptions = [
    "credit_card",
    "paypal",
    "stripe",
    "cash_on_delivery",
    "bank_transfer"
  ];
  
  useEffect(() => {
    // First check authentication
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (!data.authenticated) {
          console.log('Not authenticated in order edit page, redirecting to login');
          router.push(`/admin/login?from=/admin/orders/edit/${orderId}`);
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
        
        const order = await response.json();
        console.log('Order data received:', order);
        
        // Set form data based on order
        setFormData({
          orderNumber: order.orderNumber,
          customerName: order.customer.name,
          customerEmail: order.customer.email,
          customerPhone: order.customer.phone || "",
          street: order.shippingAddress.street,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          zipCode: order.shippingAddress.zipCode,
          country: order.shippingAddress.country,
          status: order.status,
          paymentMethod: order.paymentMethod,
          notes: order.notes || ""
        });
        
        // Set order items
        setItems(order.items);
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
      // Calculate the total amount based on items
      const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Prepare order data for API
      const orderData = {
        orderNumber: formData.orderNumber,
        customer: {
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone || undefined
        },
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        status: formData.status,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes || undefined,
        items: items,
        totalAmount: totalAmount
      };

      // Submit to API
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
      
      // Navigate back to orders list
      router.push("/admin/orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order");
    } finally {
      setSaveLoading(false);
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

  return (
    <div className="min-h-screen bg-southern-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-southern-brown">Edit Order {formData.orderNumber}</h1>
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
            
            <div className="flex items-center">
              <span className={`px-3 py-1.5 rounded-full text-sm ${getStatusBadgeClass(formData.status)}`}>
                Current Status: {formData.status}
              </span>
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <main>
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Information */}
                <div>
                  <h2 className="text-xl font-semibold text-southern-brown mb-4">Order Information</h2>
                  
                  <div className="mb-4">
                    <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Order Number
                    </label>
                    <input
                      type="text"
                      id="orderNumber"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
                    >
                      {paymentOptions.map(method => (
                        <option key={method} value={method}>
                          {method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
                    />
                  </div>
                </div>
                
                {/* Customer & Shipping Information */}
                <div>
                  <h2 className="text-xl font-semibold text-southern-brown mb-4">Customer Information</h2>
                  
                  <div className="mb-4">
                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Email
                    </label>
                    <input
                      type="email"
                      id="customerEmail"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Phone
                    </label>
                    <input
                      type="tel"
                      id="customerPhone"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
                    />
                  </div>
                  
                  <h2 className="text-xl font-semibold text-southern-brown mb-4 mt-6">Shipping Information</h2>
                  
                  <div className="mb-4">
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-southern-brown mb-4 mt-8">Order Items</h2>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <p className="text-gray-600 text-sm">
                  Order items cannot be modified in this view. This is to protect order integrity.
                </p>
                
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">${item.price.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50">
                        <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">Total</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          ${items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <Link
                  href="/admin/orders"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-4 py-2 bg-southern-brown text-white rounded-md hover:bg-southern-brown/90 disabled:opacity-50"
                >
                  {saveLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
} 