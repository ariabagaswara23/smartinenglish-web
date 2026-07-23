"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from "next/image";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Tentang Kami', href: '/about' },
    { name: 'Program', href: '/#program' },
    { name: 'Blog', href: '/blog' },
    { name: 'Galeri', href: '/gallery' },
    { name: 'Kontak', href: '/kontak' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Area */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                  src="/logo.png"
                  alt="Smart in English Logo"
                  width={80}
                  height={20}
                />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[#1e3a8a] text-sm font-medium hover:text-[#3b82f6] transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button (Desktop) */}
          <div className="hidden md:flex items-center">
            <Link
              href="/daftar"
              className="bg-primary hover:bg-blue-900 text-primary-foreground font-bold py-2.5 px-6 rounded-full transition-colors duration-300 text-sm shadow-md hover:shadow-lg"
            >
              Daftar Sekarang
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#1e3a8a] hover:text-[#3b82f6] focus:outline-none p-2 rounded-md transition-colors"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Buka menu utama</span>
              {!isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {/* Animasi sederhana dengan conditional rendering */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block px-3 py-2.5 rounded-md text-base font-medium text-[#1e3a8a] hover:text-[#3b82f6] hover:bg-blue-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 pb-2 px-3">
            <Link
              href="/daftar"
              className="flex justify-center w-full bg-primary hover:bg-blue-900 text-primary-foreground font-bold py-3 px-6 rounded-full transition-colors duration-300 shadow-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
