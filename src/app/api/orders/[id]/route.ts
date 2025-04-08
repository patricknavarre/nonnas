import { NextResponse } from 'next/server';

// Re-use the sample orders from the orders route
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
    totalAmount: 89.99,
    status: 'Processing',
    createdAt: '2023-11-10T14:30:00Z',
    updatedAt: '2023-11-10T14:30:00Z',
    shippingAddress: {
      street: '123 Main St',
      city: 'Charleston',
      state: 'SC',
      zipCode: '29401',
      country: 'USA'
    },
    paymentMethod: 'Credit Card'
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
    totalAmount: 215.50,
    status: 'Shipped',
    createdAt: '2023-11-08T10:15:00Z',
    updatedAt: '2023-11-09T09:30:00Z',
    shippingAddress: {
      street: '456 Park Ave',
      city: 'Savannah',
      state: 'GA',
      zipCode: '31401',
      country: 'USA'
    },
    paymentMethod: 'PayPal'
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
    totalAmount: 189.00,
    status: 'Delivered',
    createdAt: '2023-11-01T16:45:00Z',
    updatedAt: '2023-11-05T11:20:00Z',
    shippingAddress: {
      street: '789 Oak Dr',
      city: 'Charleston',
      state: 'SC',
      zipCode: '29412',
      country: 'USA'
    },
    paymentMethod: 'Credit Card'
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
    totalAmount: 172.49,
    status: 'Pending',
    createdAt: '2023-11-12T09:00:00Z',
    updatedAt: '2023-11-12T09:00:00Z',
    shippingAddress: {
      street: '321 Pine St',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30301',
      country: 'USA'
    },
    paymentMethod: 'Credit Card'
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
    totalAmount: 245.00,
    status: 'Cancelled',
    createdAt: '2023-11-05T13:20:00Z',
    updatedAt: '2023-11-06T10:15:00Z',
    shippingAddress: {
      street: '654 Maple Rd',
      city: 'Columbia',
      state: 'SC',
      zipCode: '29201',
      country: 'USA'
    },
    paymentMethod: 'PayPal'
  }
];

// GET a single order by ID
export async function GET(request: Request, context: { params: { id: string } }) {
  // Get the id from the context (route params)
  const id = context.params.id;
  
  // Find the order with the matching ID
  const order = sampleOrders.find(order => order._id === id);
  
  // If no order is found, return a 404 response
  if (!order) {
    return NextResponse.json(
      { error: 'Order not found' },
      { status: 404 }
    );
  }
  
  // Return the order
  return NextResponse.json(order);
}

// PATCH (update) an order
export async function PATCH(request: Request, context: { params: { id: string } }) {
  try {
    // Get the id from the context (route params)
    const id = context.params.id;
    
    // Parse the request body
    const body = await request.json();
    
    // Find the order index in the array
    const orderIndex = sampleOrders.findIndex(order => order._id === id);
    
    // If no order is found, return a 404 response
    if (orderIndex === -1) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Update the order (in a real app, this would update the database)
    const updatedOrder = {
      ...sampleOrders[orderIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    // Update the sample data array (for demo purposes)
    sampleOrders[orderIndex] = updatedOrder;
    
    // Return the updated order
    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE an order
export async function DELETE(request: Request, context: { params: { id: string } }) {
  // Get the id from the context (route params)
  const id = context.params.id;
  
  // Find the order index in the array
  const orderIndex = sampleOrders.findIndex(order => order._id === id);
  
  // If no order is found, return a 404 response
  if (orderIndex === -1) {
    return NextResponse.json(
      { error: 'Order not found' },
      { status: 404 }
    );
  }
  
  // Remove the order from the array (in a real app, this would update the database)
  sampleOrders.splice(orderIndex, 1);
  
  // Return a success message
  return NextResponse.json(
    { message: 'Order deleted successfully' },
    { status: 200 }
  );
}

// PUT (replace) an order
export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
    // Get the id from the context (route params)
    const id = context.params.id;
    
    // Parse the request body
    const body = await request.json();
    
    // Find the order index in the array
    const orderIndex = sampleOrders.findIndex(order => order._id === id);
    
    // If no order is found, return a 404 response
    if (orderIndex === -1) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Update the order (in a real app, this would replace the entire document in the database)
    const updatedOrder = {
      ...sampleOrders[orderIndex],  // Keep any fields not provided in the body
      ...body,
      _id: id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    // Update the sample data array (for demo purposes)
    sampleOrders[orderIndex] = updatedOrder;
    
    // Return the updated order
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
} 