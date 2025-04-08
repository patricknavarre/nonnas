import { NextResponse } from 'next/server';

// Sample orders data
const sampleOrders = [
  {
    _id: '1',
    orderNumber: '1001',
    customer: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com'
    },
    items: [
      {
        productId: 'p1',
        title: 'Vintage Lamp',
        price: 89.99,
        quantity: 1
      }
    ],
    total: 89.99,
    status: 'Processing',
    createdAt: '2023-11-10T14:30:00Z',
    updatedAt: '2023-11-10T14:30:00Z',
    shippingAddress: {
      street: '123 Main St',
      city: 'Charleston',
      state: 'SC',
      zipCode: '29401'
    }
  },
  {
    _id: '2',
    orderNumber: '1002',
    customer: {
      name: 'John Davis',
      email: 'john.davis@example.com'
    },
    items: [
      {
        productId: 'p2',
        title: 'Antique Mirror',
        price: 125.50,
        quantity: 1
      },
      {
        productId: 'p3',
        title: 'Ceramic Vase',
        price: 45.00,
        quantity: 2
      }
    ],
    total: 215.50,
    status: 'Shipped',
    createdAt: '2023-11-08T10:15:00Z',
    updatedAt: '2023-11-09T09:30:00Z',
    shippingAddress: {
      street: '456 Park Ave',
      city: 'Savannah',
      state: 'GA',
      zipCode: '31401'
    }
  },
  {
    _id: '3',
    orderNumber: '1003',
    customer: {
      name: 'Mary Johnson',
      email: 'mary.johnson@example.com'
    },
    items: [
      {
        productId: 'p4',
        title: 'Handcrafted Quilt',
        price: 189.00,
        quantity: 1
      }
    ],
    total: 189.00,
    status: 'Delivered',
    createdAt: '2023-11-01T16:45:00Z',
    updatedAt: '2023-11-05T11:20:00Z',
    shippingAddress: {
      street: '789 Oak Dr',
      city: 'Charleston',
      state: 'SC',
      zipCode: '29412'
    }
  },
  {
    _id: '4',
    orderNumber: '1004',
    customer: {
      name: 'Robert Wilson',
      email: 'robert.wilson@example.com'
    },
    items: [
      {
        productId: 'p5',
        title: 'Vintage Bookends',
        price: 65.99,
        quantity: 1
      },
      {
        productId: 'p6',
        title: 'Decorative Pillow',
        price: 35.50,
        quantity: 3
      }
    ],
    total: 172.49,
    status: 'Pending',
    createdAt: '2023-11-12T09:00:00Z',
    updatedAt: '2023-11-12T09:00:00Z',
    shippingAddress: {
      street: '321 Pine St',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30301'
    }
  },
  {
    _id: '5',
    orderNumber: '1005',
    customer: {
      name: 'Sarah Brown',
      email: 'sarah.brown@example.com'
    },
    items: [
      {
        productId: 'p7',
        title: 'Antique Clock',
        price: 245.00,
        quantity: 1
      }
    ],
    total: 245.00,
    status: 'Cancelled',
    createdAt: '2023-11-05T13:20:00Z',
    updatedAt: '2023-11-06T10:15:00Z',
    shippingAddress: {
      street: '654 Maple Rd',
      city: 'Columbia',
      state: 'SC',
      zipCode: '29201'
    }
  }
];

export async function GET() {
  // In a real application, you would fetch this data from a database
  // For now, we're returning sample data
  return NextResponse.json(sampleOrders);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real application, you would validate and save to database
    // For now, just return success with the submitted data
    return NextResponse.json({ 
      success: true, 
      message: 'Order created successfully',
      order: {
        ...body,
        _id: `${Date.now()}`, // Generate a fake ID
        orderNumber: `${1000 + sampleOrders.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'Pending'
      }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create order'
    }, { status: 400 });
  }
} 