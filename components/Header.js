'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-dark-700 sticky top-0 z-50 bg-dark-900/95 backdrop-blur">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          What Men Carry
        </Link>

        {/* Desktop menu */}
        <div className="hidden sm:flex gap-8 items-center text-sm font-condensed">
          <Link href="/series" className="hover:text-amber transition-colors">
            The Series
          </Link>
          <Link href="/brotherhood" className="hover:text-amber transition-colors">
            Brotherhood
          </Link>
          <Link href="/talk" className="hover:text-amber transition-colors">
            Talk
          </Link>
          <Link href="/resources" className="hover:text-amber transition-colors">
            Resources
          </Link>
          <Link href="/about" className="hover:text-amber transition-colors">
            About
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 text-amber"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-dark-800 border-b border-dark-700 sm:hidden">
            <div className="px-4 py-4 space-y-3 text-sm font-condensed">
              <Link
                href="/series"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-amber"
              >
                The Series
              </Link>
              <Link
                href="/brotherhood"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-amber"
              >
                Brotherhood
              </Link>
              <Link
                href="/talk"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-amber"
              >
                Talk
              </Link>
              <Link
                href="/resources"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-amber"
              >
                Resources
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-amber"
              >
                About
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
