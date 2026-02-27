'use client'

import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { Clock, AlertCircle, Star } from 'lucide-react'
import { MenuItem, getMenuItems, initializeMenu, getOrderDeadlineTime, isOrderingAvailable } from '@/lib/storage'

export default function HomePage() {
  const [loggedInPhone, setLoggedInPhone] = useState<string>('')
  const [todayMenu, setTodayMenu] = useState<MenuItem[]>([])
  const [orderingAvailable, setOrderingAvailable] = useState(true)

  useEffect(() => {
    initializeMenu()
    const stored = localStorage.getItem('loggedInPhone')
    if (stored) setLoggedInPhone(stored)

    // Get today's menu (first 3 items, rotating daily)
    const allItems = getMenuItems()
    const dayOfYear = Math.floor((Date.now() / (1000 * 60 * 60 * 24)) % allItems.length)
    setTodayMenu(allItems.slice(dayOfYear, dayOfYear + 3).concat(allItems.slice(0, Math.max(0, dayOfYear + 3 - allItems.length))))

    setOrderingAvailable(isOrderingAvailable())
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('loggedInPhone')
    setLoggedInPhone('')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-orange-50 to-background">
      <Navigation isLoggedIn={!!loggedInPhone} customerPhone={loggedInPhone} onLogout={handleLogout} />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-4">
            Fresh Telugu Inti Tiffins
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6">
            Authentic homemade breakfast items prepared fresh every morning
          </p>

          {!orderingAvailable && (
            <div className="bg-orange-50 border-2 border-secondary rounded-lg p-4 mb-6 flex items-start gap-3 max-w-md mx-auto">
              <AlertCircle className="text-secondary flex-shrink-0 mt-1" size={20} />
              <div className="text-left">
                <p className="font-semibold text-foreground">Orders Closed for Today</p>
                <p className="text-sm text-muted-foreground">Orders close at {getOrderDeadlineTime()} daily</p>
              </div>
            </div>
          )}

          {orderingAvailable && (
            <Link
              href="/order"
              className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition transform hover:scale-105 mb-6"
            >
              Place Your Order Now
            </Link>
          )}
        </div>

        {/* Today's Menu */}
        <div className="mb-12">
          <h2 className="text-3xl font-playfair font-bold text-primary mb-8 text-center">Today's Menu</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {todayMenu.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-accent hover:shadow-xl transition transform hover:scale-105"
              >
                <div className="h-48 bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center text-6xl">
                  {item.name === 'Idli'
                    ? '🍚'
                    : item.name === 'Dosa'
                      ? '🥘'
                      : item.name === 'Upma'
                        ? '🍲'
                        : item.name === 'Pesarattu'
                          ? '🥗'
                          : item.name === 'Gongura Rice'
                            ? '🍛'
                            : '🥞'}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-playfair font-bold text-foreground mb-2">{item.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">₹{item.price}</span>
                    <Link
                      href={`/menu#${item.id}`}
                      className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition text-sm font-semibold"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tomorrow's Preview */}
        <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl p-8 mb-12 border-2 border-secondary/30">
          <h2 className="text-2xl font-playfair font-bold text-primary mb-4 flex items-center gap-2">
            <Clock size={28} />
            Tomorrow's Preview
          </h2>
          <p className="text-muted-foreground mb-6">
            Plan ahead and see what delicious items we'll be preparing tomorrow! Pre-order now and guarantee your tiffin.
          </p>
          <Link
            href="/menu"
            className="inline-block bg-secondary text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition"
          >
            View Full Menu & Pre-order
          </Link>
        </div>

        {/* Order Cutoff Notice */}
        <div className="bg-primary/5 border-l-4 border-primary rounded-lg p-6 mb-12">
          <h3 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
            <AlertCircle size={24} />
            Important: Pre-order Notice
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="font-bold text-primary">•</span>
              <span>Orders must be placed by 8:00 PM for next-day delivery</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-primary">•</span>
              <span>Choose your preferred delivery time slot (7-9 AM)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-primary">•</span>
              <span>No cancellation after order confirmation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-primary">•</span>
              <span>Delivery available only within selected Telangana areas</span>
            </li>
          </ul>
        </div>

        {/* Rewards Section */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-8 border-2 border-primary/30">
          <h2 className="text-3xl font-playfair font-bold text-primary mb-6 flex items-center gap-2">
            <Star size={32} />
            Earn Reward Points
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 border-2 border-accent">
              <p className="text-4xl mb-2">💳</p>
              <h3 className="font-bold text-primary mb-2">Earn Points</h3>
              <p className="text-sm text-muted-foreground">Every order gives you 5-9 random reward points</p>
            </div>
            <div className="bg-white rounded-lg p-6 border-2 border-accent">
              <p className="text-4xl mb-2">🎁</p>
              <h3 className="font-bold text-primary mb-2">Unlock Rewards</h3>
              <p className="text-sm text-muted-foreground">100 pts = Keychain, 200 pts = Combo, 400 pts = Special Gift</p>
            </div>
            <div className="bg-white rounded-lg p-6 border-2 border-accent">
              <p className="text-4xl mb-2">🎊</p>
              <h3 className="font-bold text-primary mb-2">Get Gifts</h3>
              <p className="text-sm text-muted-foreground">1-2 months of regular orders = First reward!</p>
            </div>
          </div>
          {loggedInPhone ? (
            <Link
              href="/dashboard"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              View My Rewards
            </Link>
          ) : (
            <Link
              href="/order"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Start Earning Points
            </Link>
          )}
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
