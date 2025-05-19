import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8">API Open Beta Docs</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2 text-black">Admin</h2>
          <p className="text-gray-600">Manage your API keys and automation settings</p>
        </Link>
        <Link href="/docs" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2 text-black">Documentation</h2>
          <p className="text-gray-600">Browse API documentation and integration guides</p>
        </Link>
        <Link href="/test" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2 text-black">Testing</h2>
          <p className="text-gray-600">Test API functionality</p>
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-md text-center hover:bg-blue-700 transition-colors">
          Login
        </Link>
        <Link href="/register" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md text-center hover:bg-gray-300 transition-colors">
          Register
        </Link>
      </div>
    </main>
  );
}
