"use client";

import { useState, useEffect, useRef } from 'react';
import { Message } from '@/lib/types';
import { TiffinBot } from '@/lib/chatbot';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [bot] = useState(() => new TiffinBot());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    const greeting = bot.getGreeting();
    addBotMessage(greeting);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userInput = inputValue.trim();
    addUserMessage(userInput);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = bot.processResponse(userInput);
      addBotMessage(response.message);
      setIsTyping(false);

      // If order is complete, send to cook
      if (response.isComplete && userInput.toLowerCase().includes('yes')) {
        sendOrderToCook();
      }
    }, 800);
  };

  const sendOrderToCook = async () => {
    const orderData = bot.getOrderData();
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          timestamp: new Date().toISOString(),
          status: 'new',
        }),
      });

      if (response.ok) {
        console.log('Order sent to cook successfully!');
      }
    } catch (error) {
      console.error('Error sending order:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">🍱 Tiffin Service Bot</h1>
        <p className="text-orange-100 mt-1">Your Smart Ordering Assistant</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-6 py-4 shadow-md ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              <p className="whitespace-pre-line leading-relaxed">{message.text}</p>
              <span className={`text-xs mt-2 block ${
                message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-6 py-4 shadow-md border border-gray-200">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="bg-white border-t border-gray-200 p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-orange-500 text-gray-800 text-lg transition-colors"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !inputValue.trim()}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-full font-semibold hover:from-orange-600 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
