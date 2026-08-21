'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-xl font-serif text-amber-500">What Men Carry</div>
            <div className="text-xs text-gray-500">by LIMEN Helix</div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-8">
            <Link href="/series" className="text-sm hover:text-amber-500 transition">
              The Series
            </Link>
            <Link href="/brotherhood" className="text-sm hover:text-amber-500 transition">
              Brotherhood
            </Link>
            <Link href="/talk" className="text-sm hover:text-amber-500 transition">
              Talk
            </Link>
            <Link href="/resources" className="text-sm hover:text-amber-500 transition">
              Resources
            </Link>
            <Link href="/about" className="text-sm hover:text-amber-500 transition">
              About
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-3">
            <Link href="/series" className="block text-sm hover:text-amber-500 transition">
              The Series
            </Link>
            <Link href="/brotherhood" className="block text-sm hover:text-amber-500 transition">
              Brotherhood
            </Link>
            <Link href="/talk" className="block text-sm hover:text-amber-500 transition">
              Talk
            </Link>
            <Link href="/resources" className="block text-sm hover:text-amber-500 transition">
              Resources
            </Link>
            <Link href="/about" className="block text-sm hover:text-amber-500 transition">
              About
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
