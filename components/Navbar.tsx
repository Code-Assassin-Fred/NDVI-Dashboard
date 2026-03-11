'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold text-slate-900 tracking-tight">NDVI <span className="text-green-600">Dashboard</span></span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-600 hover:text-green-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="/dashboard" className="text-slate-600 hover:text-green-600 transition-colors font-medium">
              Dashboard
            </Link>
            <Link href="/analysis" className="text-slate-600 hover:text-green-600 transition-colors font-medium">
              Field Analysis
            </Link>
            <Link href="/about" className="text-slate-600 hover:text-green-600 transition-colors font-medium">
              About
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 rounded-md p-2"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-lg absolute w-full left-0 origin-top animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-2 pb-4 space-y-1 sm:px-3 flex flex-col">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-green-600 hover:bg-green-50 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-green-600 hover:bg-green-50 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/analysis"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-green-600 hover:bg-green-50 transition-colors"
            >
              Field Analysis
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-green-600 hover:bg-green-50 transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
