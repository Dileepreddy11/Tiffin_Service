'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { Gift, TrendingUp, History, LogOut } from 'lucide-react'
import {
  Customer,
  Order,
  getCustomerByPhone,
  getOrdersByPhone,
  getRewardTiers,
  getNextReward,
  getMenuItems,
} from '@/lib/storage'

export default function DashboardPage() {
  const router = useRouter()
  const [loggedInPhone, setLoggedInPhone] = useState<string>('')
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [unlockedRewards, setUnlockedRewards] = useState<number[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('loggedInPhone')
    if (!stored) {
      router.push('/order')
      return
    }

    setLoggedInPhone(stored)
    const customerData = getCustomerByPhone(stored)
    setCustomer(customerData)

    if (customerData) {
      const customerOrders = getOrdersByPhone(stored)
      setOrders(customerOrders)

      // Check which rewards are unlocked
      const tiers = getRewardTiers()
      const unlocked = tiers.filter((t) => customerData.rewardPoints >= t.points).map((t) => t.points)
      setUnlockedRewards(unlocked)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('loggedInPhone')
    setLoggedInPhone('')
    router.push('/')
  }

  if (!customer) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-purple-50 to-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  const rewardTiers = getRewardTiers()
  const nextReward = getNextReward(customer.rewardPoints)
  const pointsUntilNext = Math.max(0, nextReward.points - customer.rewardPoints)

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-green-50 to-background">
      <Navigation isLoggedIn={!!loggedInPhone} customerPhone={loggedInPhone} onLogout={handleLogout} />

      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-4">My Rewards Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Welcome back, <span className="font-bold">{customer.name}</span>!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Total Points */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-secondary p-8 text-center">
            <div className="text-5xl mb-4">⭐</div>
            <p className="text-muted-foreground text-sm mb-2">Total Reward Points</p>
            <p className="text-5xl font-bold text-secondary">{customer.rewardPoints}</p>
            <p className="text-xs text-muted-foreground mt-4">From {customer.totalOrders} orders</p>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-accent p-8 text-center">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-muted-foreground text-sm mb-2">Total Orders</p>
            <p className="text-5xl font-bold text-primary">{customer.totalOrders}</p>
            <p className="text-xs text-muted-foreground mt-4">Keep ordering for more rewards</p>
          </div>

          {/* Next Reward */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-primary p-8 text-center">
            <div className="text-5xl mb-4">{nextReward.icon}</div>
            <p className="text-muted-foreground text-sm mb-2">Next Reward</p>
            <p className="font-bold text-foreground">{nextReward.reward}</p>
            <p className="text-2xl font-bold text-primary mt-2">{pointsUntilNext}</p>
            <p className="text-xs text-muted-foreground">Points to go!</p>
          </div>
        </div>

        {/* Reward Progress Section */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-accent p-8 mb-12">
          <h2 className="text-2xl font-playfair font-bold text-primary mb-8 flex items-center gap-2">
            <Gift size={28} />
            Reward Levels
          </h2>

          <div className="space-y-6">
            {rewardTiers.map((tier, index) => {
              const isUnlocked = customer.rewardPoints >= tier.points
              const progress = Math.min((customer.rewardPoints / tier.points) * 100, 100)

              return (
                <div
                  key={tier.points}
                  className={`p-6 rounded-lg border-2 transition ${
                    isUnlocked
                      ? 'bg-green-50 border-green-400'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{tier.icon}</div>
                      <div>
                        <h3 className="font-bold text-foreground text-lg">{tier.reward}</h3>
                        <p className="text-sm text-muted-foreground">{tier.points} points required</p>
                      </div>
                    </div>
                    {isUnlocked && (
                      <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                        ✓ Unlocked!
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isUnlocked ? 'bg-green-500' : 'bg-primary'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {customer.rewardPoints} / {tier.points} points
                  </p>
                </div>
              )
            })}
          </div>

          {unlockedRewards.length > 0 && (
            <div className="mt-8 bg-primary/10 border-2 border-primary rounded-lg p-6">
              <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                <TrendingUp size={20} />
                Your Unlocked Rewards
              </h3>
              <div className="flex flex-wrap gap-2">
                {rewardTiers
                  .filter((t) => unlockedRewards.includes(t.points))
                  .map((tier) => (
                    <div key={tier.points} className="bg-white border-2 border-primary px-4 py-2 rounded-full">
                      <p className="font-semibold text-primary">
                        {tier.icon} {tier.reward}
                      </p>
                    </div>
                  ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Contact us to claim your rewards! Visit the Rules page for details.
              </p>
            </div>
          )}
        </div>

        {/* Order History */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-accent p-8 mb-12">
          <h2 className="text-2xl font-playfair font-bold text-primary mb-8 flex items-center gap-2">
            <History size={28} />
            Order History
          </h2>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-6">No orders yet!</p>
              <Link
                href="/order"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Place Your First Order
              </Link>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {[...orders].reverse().map((order) => (
                <div key={order.id} className="p-6 bg-gray-50 rounded-lg border-2 border-border hover:bg-accent/5 transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-foreground mb-1">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                      <p className="font-bold text-primary mt-2">+{order.pointsEarned} pts</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">Delivery</p>
                      <p className="font-semibold text-foreground">{order.deliveryDate} • {order.timeSlot}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-semibold text-primary">₹{order.totalPrice}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Items:</p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item) => {
                        const menuItem = getMenuItems().find((m) => m.id === item.itemId)
                        return (
                          <span key={item.itemId} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {menuItem?.name} x{item.quantity}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-secondary to-accent rounded-xl p-8 text-center mb-12">
          <h2 className="text-2xl font-playfair font-bold text-foreground mb-4">Keep Earning!</h2>
          <p className="text-foreground mb-6">
            Every order brings you closer to amazing rewards. Place your next order now!
          </p>
          <Link
            href="/order"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            Order Now
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
