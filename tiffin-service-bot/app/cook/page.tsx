"use client";

import { useState, useEffect } from 'react';
import { Order } from '@/lib/types';
import Link from 'next/link';

export default function CookDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [lastOrderCount, setLastOrderCount] = useState(0);

  useEffect(() => {
    fetchOrders();
    // Poll for new orders every 5 seconds
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
      
      // Show notification for new orders
      if (data.length > lastOrderCount && lastOrderCount > 0) {
        showNotification('🔔 New order received!');
        playNotificationSound();
      }
      setLastOrderCount(data.length);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 5000);
  };

  const playNotificationSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: orderId, status }),
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'new':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusEmoji = (status: Order['status']) => {
    switch (status) {
      case 'new':
        return '🆕';
      case 'preparing':
        return '👨‍🍳';
      case 'delivered':
        return '✅';
      default:
        return '📦';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">👨‍🍳 Cook Dashboard</h1>
            <p className="text-green-100 mt-1">Manage your tiffin orders</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 px-6 py-3 rounded-full">
              <span className="text-2xl font-bold">{orders.length}</span>
              <span className="ml-2 text-green-100">Total Orders</span>
            </div>
            <Link 
              href="/"
              className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-green-50 transition-all"
            >
              ← Back to Chat
            </Link>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed top-24 right-6 bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl z-50 animate-bounce">
          {notification}
        </div>
      )}

      {/* Orders Grid */}
      <div className="max-w-7xl mx-auto p-6">
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🍱</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-gray-600">New orders will appear here automatically</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-gray-100"
              >
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(order.status)}`}>
                    {getStatusEmoji(order.status)} {order.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(order.timestamp).toLocaleString()}
                  </span>
                </div>

                {/* Order Details */}
                <div className="space-y-3 mb-6">
                  <div>
                    <span className="text-gray-600 text-sm">Customer:</span>
                    <p className="font-semibold text-gray-800 text-lg">{order.customerName}</p>
                  </div>

                  <div>
                    <span className="text-gray-600 text-sm">📞 Phone:</span>
                    <p className="font-medium text-gray-800">{order.phoneNumber}</p>
                  </div>

                  <div>
                    <span className="text-gray-600 text-sm">📍 Address:</span>
                    <p className="font-medium text-gray-800">{order.address}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-gray-600 text-sm">🍽️ Meal:</span>
                      <p className="font-medium text-gray-800">{order.mealType}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">🔢 Quantity:</span>
                      <p className="font-medium text-gray-800">{order.quantity}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-600 text-sm">⏰ Delivery Time:</span>
                    <p className="font-medium text-gray-800">{order.deliveryTime}</p>
                  </div>

                  <div>
                    <span className="text-gray-600 text-sm">🥗 Dietary Preferences:</span>
                    <p className="font-medium text-gray-800">{order.dietaryPreferences}</p>
                  </div>

                  <div>
                    <span className="text-gray-600 text-sm">📝 Special Instructions:</span>
                    <p className="font-medium text-gray-800">{order.specialInstructions}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {order.status === 'new' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all"
                    >
                      Mark Delivered
                    </button>
                  )}
                  {order.status === 'delivered' && (
                    <div className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg font-semibold text-center">
                      Completed ✓
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
