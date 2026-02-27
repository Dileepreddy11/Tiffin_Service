'use client'

import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { MenuItem, getMenuItems, initializeMenu } from '@/lib/storage'
import { ChevronRight } from 'lucide-react'

export default function MenuPage() {
  const [loggedInPhone, setLoggedInPhone] = useState<string>('')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  useEffect(() => {
    initializeMenu()
    const stored = localStorage.getItem('loggedInPhone')
    if (stored) setLoggedInPhone(stored)
    setMenuItems(getMenuItems())
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('loggedInPhone')
    setLoggedInPhone('')
  }

  const getItemEmoji = (name: string) => {
    const emojiMap: Record<string, string> = {
      'Idli': '🍚',
      'Dosa': '🥘',
      'Upma': '🍲',
      'Pesarattu': '🥗',
      'Gongura Rice': '🍛',
      'Poha': '🥞',
    }
    return emojiMap[name] || '🍽️'
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-yellow-50 to-background">
      <Navigation isLoggedIn={!!loggedInPhone} customerPhone={loggedInPhone} onLogout={handleLogout} />

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-4">Our Complete Menu</h1>
          <p className="text-lg text-muted-foreground">
            Authentic Telugu breakfast items prepared fresh daily in our home kitchen
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <div
              key={item.id}
              id={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-secondary/30 hover:shadow-2xl hover:border-accent transition transform hover:scale-105"
            >
              {/* Image Placeholder */}
              <div className="h-56 bg-gradient-to-br from-secondary/30 to-accent/30 flex items-center justify-center text-8xl">
                {getItemEmoji(item.name)}
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-3xl font-playfair font-bold text-primary mb-2">{item.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{item.description}</p>

                {/* Price and Availability */}
                <div className="mb-6 pb-6 border-b-2 border-border flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Price per portion</p>
                    <p className="text-3xl font-bold text-primary">₹{item.price}</p>
                  </div>
                  <div className="text-center">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.available
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {item.available ? 'Available' : 'Coming Soon'}
                    </div>
                  </div>
                </div>

                {/* Order Button */}
                {item.available ? (
                  <Link
                    href={`/order?item=${item.id}`}
                    className="flex items-center justify-center gap-2 w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
                  >
                    Order Now
                    <ChevronRight size={20} />
                  </Link>
                ) : (
                  <button disabled className="w-full bg-muted text-muted-foreground px-6 py-3 rounded-lg font-semibold cursor-not-allowed">
                    Coming Soon
                  </button>
                )}

                {/* Quick Info */}
                <div className="mt-6 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div className="bg-accent/5 rounded-lg p-3 text-center">
                    <p className="font-semibold text-primary">Vegetarian</p>
                    <p>🌱</p>
                  </div>
                  <div className="bg-secondary/5 rounded-lg p-3 text-center">
                    <p className="font-semibold text-primary">Fresh Daily</p>
                    <p>✨</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* About Section */}
        <div className="mt-16 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-8 border-2 border-primary/30">
          <h2 className="text-2xl font-playfair font-bold text-primary mb-4">About Our Menu</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-foreground mb-2">Quality & Freshness</h3>
              <p className="text-muted-foreground text-sm">
                Every item is prepared fresh in our home kitchen using authentic Telugu recipes passed down through generations. We use the finest ingredients to ensure authentic taste.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">Delivery Guarantee</h3>
              <p className="text-muted-foreground text-sm">
                All items are delivered hot and fresh within your chosen time slot (7-9 AM). We prepare orders on the day of delivery to maintain quality and taste.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-secondary to-accent rounded-xl p-8 text-center">
          <h2 className="text-3xl font-playfair font-bold text-foreground mb-4">Ready to Order?</h2>
          <p className="text-foreground text-lg mb-6">
            Choose your items and place your order by 8 PM for next-day delivery
          </p>
          <Link
            href="/order"
            className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition transform hover:scale-105"
          >
            Start Your Order
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white mt-16 py-8 text-center">
        <p className="mb-2">Fresh Telugu Inti Tiffins</p>
        <p className="text-sm opacity-90">Authentic Telugu Breakfast | Homemade Quality | Daily Delivery</p>
        <p className="text-xs opacity-75 mt-4">Delivery within selected areas in Telangana</p>
      </footer>
    </main>
  )
}
