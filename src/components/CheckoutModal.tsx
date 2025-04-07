'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem } from './CartContext';

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  cart: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
};

export default function CheckoutModal({
  isOpen,
  onClose,
  onComplete,
  cart,
  subtotal,
  shipping,
  total
}: CheckoutModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expDate: '',
    cvv: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    const { firstName, lastName, email, phone, address, city, state, zipCode } = formData;
    return firstName && lastName && email && phone && address && city && state && zipCode;
  };

  const validateStep2 = () => {
    const { cardNumber, cardName, expDate, cvv } = formData;
    return cardNumber && cardName && expDate && cvv;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 2 && validateStep2()) {
      setLoading(true);
      
      // Simulate Shopify API integration 
      setTimeout(() => {
        setLoading(false);
        onComplete();
        router.push('/cart?success=true');
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-southern-beige flex justify-between items-center">
          <h2 className="font-heading text-2xl text-southern-brown">
            {step === 1 ? 'Customer Information' : 'Payment Details'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-southern-brown"
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress indicator */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-southern-brown text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="text-sm mt-1">Information</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-gray-200">
              <div className={`h-full ${step >= 2 ? 'bg-southern-brown' : 'bg-gray-200'}`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-southern-brown text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="text-sm mt-1">Payment</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Content */}
          <div className="p-6">
            {step === 1 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-southern-beige rounded-md focus:outline-none focus:ring-1 focus:ring-southern-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-southern-beige rounded-md focus:outline-none focus:ring-1 focus:ring-southern-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-southern-beige rounded-md focus:outline-none focus:ring-1 focus:ring-southern-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-southern-beige rounded-md focus:outline-none focus:ring-1 focus:ring-southern-accent"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-southern-beige rounded-md focus:outline-none focus:ring-1 focus:ring-southern-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-southern-beige rounded-md focus:outline-none focus:ring-1 focus:ring-southern-accent"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-southern-beige rounded-md focus:outline-none focus:ring-1 focus:ring-southern-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-southern-beige rounded-md focus:outline-none focus:ring-1 focus:ring-southern-accent"
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="w-full px-3 py-2 border border-southern-beige rounded-md focus:outline-none focus:ring-1 focus:ring-southern-accent"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name *</label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-southern-beige rounded-md focus:outline-none focus:ring-1 focus:ring-southern-accent"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date *</label>
                    <input
                      type="text"
                      name="expDate"
                      value={formData.expDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-southern-beige rounded-md focus:outline-none focus:ring-1 focus:ring-southern-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      className="w-full px-3 py-2 border border-southern-beige rounded-md focus:outline-none focus:ring-1 focus:ring-southern-accent"
                      required
                    />
                  </div>
                </div>

                <div className="mt-8 p-4 bg-southern-beige/10 rounded-lg">
                  <h3 className="font-heading text-lg text-southern-brown mb-4">Order Summary</h3>
                  
                  <div className="space-y-2 mb-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between">
                        <span className="text-gray-700">{item.name} × {item.quantity}</span>
                        <span className="text-southern-brown">${(parseFloat(item.price.replace(/[^0-9.-]+/g, '')) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-southern-beige/50 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-southern-brown">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-southern-brown">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-southern-brown">Total</span>
                      <span className="text-southern-accent">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-southern-beige bg-southern-beige/10 flex justify-between">
            {step === 1 ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn btn-primary"
                  disabled={!validateStep1() || loading}
                >
                  Continue to Payment
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!validateStep2() || loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Complete Order'
                  )}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 