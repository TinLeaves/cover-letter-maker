'use client'

import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { HiMail, HiMenu, HiX } from 'react-icons/hi'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-12 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 cursor-pointer group">
            <div className="h-8 w-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center group-hover:bg-neutral-200 transition-colors">
              <HiMail className="h-4 w-4 text-neutral-600 group-hover:text-neutral-900 transition-colors" />
            </div>
            <span className="text-xl font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors">
              Cover Letter Maker
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav id="navigation" className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Main navigation">
            <Link 
              href="/how-it-works" 
              className="text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              How It Works
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? (
              <HiX className="h-6 w-6" />
            ) : (
              <HiMenu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-neutral-200 animate-slide-down">
            <nav className="flex flex-col space-y-4" role="navigation" aria-label="Mobile navigation">
              <Link 
                href="/how-it-works" 
                className="text-neutral-600 hover:text-neutral-900 transition-colors px-4 py-2 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}