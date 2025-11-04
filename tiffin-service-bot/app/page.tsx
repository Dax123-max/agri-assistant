import ChatInterface from '@/components/ChatInterface';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative h-screen">
      <ChatInterface />
      
      {/* Cook Dashboard Link */}
      <Link 
        href="/cook"
        className="fixed bottom-24 right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all hover:shadow-xl z-50"
      >
        👨‍🍳 Cook Dashboard
      </Link>
    </div>
  );
}
