import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Order } from '@/lib/types';

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read orders from file
async function readOrders(): Promise<Order[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Write orders to file
async function writeOrders(orders: Order[]) {
  await ensureDataDir();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// GET - Fetch all orders
export async function GET() {
  try {
    const orders = await readOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error reading orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orders = await readOrders();
    
    const newOrder: Order = {
      id: Date.now().toString(),
      customerName: body.customerName || '',
      phoneNumber: body.phoneNumber || '',
      address: body.address || '',
      mealType: body.mealType || '',
      quantity: parseInt(body.quantity) || 1,
      deliveryTime: body.deliveryTime || '',
      dietaryPreferences: body.dietaryPreferences || 'None',
      specialInstructions: body.specialInstructions || 'None',
      timestamp: body.timestamp || new Date().toISOString(),
      status: 'new',
    };

    orders.unshift(newOrder); // Add to beginning of array
    await writeOrders(orders);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// PATCH - Update order status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const orders = await readOrders();
    const orderIndex = orders.findIndex(order => order.id === id);

    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    orders[orderIndex].status = status;
    await writeOrders(orders);

    return NextResponse.json(orders[orderIndex]);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
