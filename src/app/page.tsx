import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="bg-black/50 p-8 rounded-lg max-w-5xl w-full backdrop-blur-md">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/images/Morpheus Logo - White.svg"
            alt="Morpheus Logo"
            width={120}
            height={120}
            className="mb-6"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">
            Morpheus Compute Marketplace API Gateway
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-white/80 text-center">
            API Open Beta Docs
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin" className="group relative p-6 bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_14px_28px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-white/30 after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-transparent after:via-transparent after:to-blue-300/10 after:opacity-0 hover:after:opacity-100 after:transition-opacity">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <h2 className="text-2xl font-semibold mb-2 text-black">Admin</h2>
            <p className="text-gray-600">Manage your API keys and automation settings</p>
          </Link>
          <Link href="/docs" className="group relative p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_14px_28px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-white/30 after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-transparent after:via-transparent after:to-blue-300/10 after:opacity-0 hover:after:opacity-100 after:transition-opacity">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            <h2 className="text-2xl font-semibold mb-2 text-black">Documentation</h2>
            <p className="text-gray-600">Browse API documentation and integration guides</p>
          </Link>
          <Link href="/test" className="group relative p-6 bg-gradient-to-br from-teal-50 via-white to-green-50 rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_14px_28px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-white/30 after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-transparent after:via-transparent after:to-green-300/10 after:opacity-0 hover:after:opacity-100 after:transition-opacity">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-green-500"></div>
            <h2 className="text-2xl font-semibold mb-2 text-black">Testing</h2>
            <p className="text-gray-600">Test API functionality</p>
          </Link>
          <Link href="/chat" className="group relative p-6 bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_14px_28px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-white/30 after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-transparent after:via-transparent after:to-green-300/10 after:opacity-0 hover:after:opacity-100 after:transition-opacity">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
            <h2 className="text-2xl font-semibold mb-2 text-black">Chat</h2>
            <p className="text-gray-600">Interactive chat with model selection</p>
          </Link>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/login" className="px-6 py-3 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-md text-center hover:shadow-lg hover:shadow-blue-500/20 transition-all hover:-translate-y-1 font-medium">
            Login
          </Link>
          <Link href="/register" className="px-6 py-3 bg-gradient-to-br from-gray-100 to-gray-300 text-gray-800 rounded-md text-center hover:shadow-lg hover:shadow-gray-500/20 transition-all hover:-translate-y-1 font-medium border border-white/20">
            Register
          </Link>
          <Link href="https://api.mor.org/docs" className="px-6 py-3 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-md text-center hover:shadow-lg hover:shadow-green-500/20 transition-all hover:-translate-y-1 font-medium">
            Swagger UI
          </Link>
        </div>
      </div>
    </main>
  );
}
