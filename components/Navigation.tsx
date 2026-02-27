'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'

interface NavigationProps {
  isLoggedIn?: boolean
  customerPhone?: string
  onLogout?: () => void
}

export default function Navigation({ isLoggedIn = false, customerPhone = '', onLogout }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/order', label: 'Order' },
    isLoggedIn ? { href: '/dashboard', label: 'My Rewards' } : null,
    { href: '/rules', label: 'Rules' },
  ].filter(Boolean)

  const adminItems = [{ href: '/admin', label: 'Admin Panel' }]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b-2 border-accent">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Brand */}
          <Link href="/" className="flex flex-col items-start">
            <h1 className="text-2xl font-playfair font-bold text-primary">Fresh Telugu</h1>
            <p className="text-xs text-secondary font-semibold">Inti Tiffins</p>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item!.href}
                href={item!.href}
                className={`font-medium transition-colors ${
                  isActive(item!.href)
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {item!.label}
              </Link>
            ))}
            {adminItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isLoggedIn && (
              <div className="flex items-center gap-3 pl-6 border-l-2 border-border">
                <span className="text-sm font-medium text-muted-foreground">{customerPhone}</span>
                <button
                  onClick={onLogout}
                  className="p-2 hover:bg-red-50 rounded-lg transition text-destructive"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            {navItems.map((item) => (
              <Link
                key={item!.href}
                href={item!.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg transition ${
                  isActive(item!.href) ? 'bg-primary text-white' : 'hover:bg-gray-100'
                }`}
              >
                {item!.label}
              </Link>
            ))}
            {adminItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg transition ${
                  isActive(item.href) ? 'bg-primary text-white' : 'hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isLoggedIn && (
              <button
                onClick={() => {
                  onLogout?.()
                  setIsOpen(false)
                }}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-50 transition text-destructive font-medium"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
