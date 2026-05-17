'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { Trash2, Plus, Minus, Check } from 'lucide-react'
import {
  MenuItem,
  Order,
  getMenuItems,
  initializeMenu,
  addOrder,
  createOrUpdateCustomer,
  addRewardPoints,
  getOrderDeadlineTime,
  isOrderingAvailable,
  getTimeSlots,
  getRewardTiers,
} from '@/lib/storage'

interface CartItem {
  item: MenuItem
  quantity: number
}

interface SuccessState {
  show: boolean
  pointsEarned: number
  totalPoints: number
  orderId: string
}

export default function OrderPage() {
  const searchParams = useSearchParams()
  const [loggedInPhone, setLoggedInPhone] = useState<string>('')
  const [showLoginForm, setShowLoginForm] = useState(true)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [successState, setSuccessState] = useState<SuccessState>({ show: false, pointsEarned: 0, totalPoints: 0, orderId: '' })

  // Form state
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('cod')
  const [orderingAvailable, setOrderingAvailable] = useState(true)

  useEffect(() => {
    initializeMenu()
    const stored = localStorage.getItem('loggedInPhone')
    if (stored) {
      setLoggedInPhone(stored)
      setShowLoginForm(false)
      setCustomerPhone(stored)
    }

    const items = getMenuItems()
    setMenuItems(items)

    // Set default delivery date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setDeliveryDate(tomorrow.toISOString().split('T')[0])

    // Check if ordering is available
    setOrderingAvailable(isOrderingAvailable())

    // Pre-select item from URL
    const itemId = searchParams.get('item')
    if (itemId && items.length > 0) {
      const item = items.find((i) => i.id === itemId)
      if (item && !cart.find((c) => c.item.id === itemId)) {
        addToCart(item)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('loggedInPhone')
    setLoggedInPhone('')
    setShowLoginForm(true)
    setCustomerPhone('')
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (customerPhone.match(/^\d{10}$/)) {
      localStorage.setItem('loggedInPhone', customerPhone)
      setLoggedInPhone(customerPhone)
      setShowLoginForm(false)
    }
  }

  const addToCart = (item: MenuItem) => {
    const existing = cart.find((c) => c.item.id === item.id)
    if (existing) {
      setCart(cart.map((c) => (c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)))
    } else {
      setCart([...cart, { item, quantity: 1 }])
    }
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
    } else {
      setCart(cart.map((c) => (c.item.id === itemId ? { ...c, quantity } : c)))
    }
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((c) => c.item.id !== itemId))
  }

  const calculateTotal = () => {
    return cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0)
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerName || !deliveryAddress || !timeSlot) {
      alert('Please fill all required fields')
      return
    }

    if (cart.length === 0) {
      alert('Please add items to your cart')
      return
    }

    // Create or update customer
    const customer = createOrUpdateCustomer(customerPhone, customerName)

    // Generate random points (5-9)
    const pointsEarned = Math.floor(Math.random() * 5) + 5

    // Create order
    const order: Order = {
      id: Math.random().toString(36).substr(2, 9),
      customerName,
      customerPhone,
      deliveryAddress,
      deliveryDate,
      timeSlot,
      items: cart.map((c) => ({ itemId: c.item.id, quantity: c.quantity })),
      totalPrice: calculateTotal(),
      paymentMethod,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      pointsEarned,
    }

    addOrder(order)
    addRewardPoints(customerPhone, pointsEarned)
    const updatedCustomer = createOrUpdateCustomer(customerPhone, customerName)

    // Show success popup
    setSuccessState({
      show: true,
      pointsEarned,
      totalPoints: updatedCustomer.rewardPoints,
      orderId: order.id,
    })

    // Reset form
    setCart([])
    setDeliveryAddress('')
    setTimeSlot('')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-orange-50 to-background">
      <Navigation isLoggedIn={!!loggedInPhone} customerPhone={loggedInPhone} onLogout={handleLogout} />

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-12 text-center">Place Your Order</h1>

        {!orderingAvailable && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-8 text-center">
            <p className="text-lg font-bold text-red-700 mb-2">Orders are Closed</p>
            <p className="text-red-600">
              Orders close at {getOrderDeadlineTime()} daily. Please place your order tomorrow.
            </p>
          </div>
        )}

        {/* Login Section */}
        {showLoginForm && (
          <div className="max-w-md mx-auto mb-12 bg-white rounded-xl shadow-lg border-2 border-accent p-8">
            <h2 className="text-2xl font-playfair font-bold text-primary mb-6">Login to Order</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Continue
              </button>
            </form>
          </div>
        )}

        {loggedInPhone && (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Menu and Cart Section */}
            <div className="md:col-span-2">
              {/* Menu Items */}
              <div className="bg-white rounded-xl shadow-lg border-2 border-secondary/30 p-8 mb-8">
                <h2 className="text-2xl font-playfair font-bold text-primary mb-6">Select Items</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {menuItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-border hover:bg-accent/5 transition">
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="font-semibold text-primary mt-1">₹{item.price}</p>
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition font-semibold"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary and Form */}
            <div className="space-y-8">
              {/* Cart Summary */}
              <div className="bg-white rounded-xl shadow-lg border-2 border-accent p-8">
                <h2 className="text-2xl font-playfair font-bold text-primary mb-6">Your Cart</h2>
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Add items to get started</p>
                ) : (
                  <>
                    <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                      {cart.map((c) => (
                        <div key={c.item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-semibold text-foreground">{c.item.name}</p>
                            <p className="text-sm text-muted-foreground">₹{c.item.price} x {c.quantity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(c.item.id, c.quantity - 1)}
                              className="p-1 hover:bg-red-50 rounded"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-6 text-center font-bold">{c.quantity}</span>
                            <button
                              onClick={() => updateQuantity(c.item.id, c.quantity + 1)}
                              className="p-1 hover:bg-green-50 rounded"
                            >
                              <Plus size={16} />
                            </button>
                            <button
                              onClick={() => removeFromCart(c.item.id)}
                              className="p-1 hover:bg-red-50 rounded ml-1"
                            >
                              <Trash2 size={16} className="text-destructive" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t-2 border-border pt-4">
                      <div className="flex justify-between items-center text-lg font-bold text-primary">
                        <span>Total:</span>
                        <span>₹{calculateTotal()}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Order Form */}
              <form onSubmit={handleSubmitOrder} className="bg-white rounded-xl shadow-lg border-2 border-accent p-8">
                <h2 className="text-xl font-playfair font-bold text-primary mb-4">Delivery Details</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1">Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1">Phone</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      disabled
                      className="w-full px-3 py-2 border-2 border-border rounded-lg bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1">Delivery Address</label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1">Delivery Date</label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1">Time Slot</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                      required
                    >
                      <option value="">Select a slot</option>
                      {getTimeSlots().map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Payment Method</label>
                    <div className="space-y-2">
                      <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent/5'}`}>
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                        />
                        <span className="font-semibold">Cash on Delivery</span>
                      </label>
                      <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent/5'}`}>
                        <input
                          type="radio"
                          name="payment"
                          value="online"
                          checked={paymentMethod === 'online'}
                          onChange={(e) => setPaymentMethod(e.target.value as 'online')}
                        />
                        <span className="font-semibold">UPI Payment</span>
                      </label>
                    </div>
                  </div>

                  {paymentMethod === 'online' && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 space-y-3">
                      <p className="text-sm font-semibold text-blue-900">UPI Payment Details</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Amount to Pay:</span>
                          <span className="font-bold text-primary">₹{calculateTotal()}</span>
                        </div>
                        <div className="bg-white rounded p-2 text-center">
                          <p className="text-xs text-gray-600 mb-1">UPI ID:</p>
                          <p className="font-mono font-semibold text-blue-700">freshtelugu@upi</p>
                        </div>
                        <p className="text-xs text-blue-800 text-center">
                          Pay via any UPI app (Google Pay, PhonePe, Paytm, etc.)
                        </p>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                        <p className="text-xs text-yellow-800 text-center">
                          After payment, your order will be confirmed automatically.
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={cart.length === 0 || !orderingAvailable}
                    className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    Confirm Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* Success Popup */}
      {successState.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-2 border-primary">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-playfair font-bold text-primary mb-4">Thank You for Ordering!</h2>

            <div className="bg-primary/10 rounded-xl p-6 mb-6 space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono font-bold text-primary">{successState.orderId}</p>
              </div>
              <div className="border-t-2 border-primary/20 pt-3">
                <p className="text-sm text-muted-foreground">Reward Points Earned</p>
                <p className="text-4xl font-bold text-secondary">{successState.pointsEarned}</p>
              </div>
              <div className="border-t-2 border-primary/20 pt-3">
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-4xl font-bold text-primary">{successState.totalPoints}</p>
              </div>
            </div>

            {/* Reward Progress */}
            <div className="bg-accent/10 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-primary mb-3 text-center">Your Rewards</h3>
              {getRewardTiers().map((tier) => (
                <div key={tier.points} className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold">{tier.icon} {tier.reward}</span>
                    <span className="text-xs text-muted-foreground">{tier.points} pts</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-accent h-full transition-all"
                      style={{ width: `${Math.min((successState.totalPoints / tier.points) * 100, 100)}%` }}
                    />
                  </div>
                  {successState.totalPoints >= tier.points && (
                    <div className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1">
                      <Check size={14} /> Unlocked!
                    </div>
                  )}
                </div>
              ))}
            </div>

            {paymentMethod === 'online' ? (
              <div className="space-y-2 mb-6">
                <p className="text-sm text-blue-700 font-semibold">Payment Status: Pending</p>
                <p className="text-sm text-muted-foreground">
                  Please complete your UPI payment to confirm this order. Once payment is confirmed, your order will be delivered in your selected time slot.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-6">
                Your order will be delivered in your selected time slot. Cash payment to be made at delivery.
              </p>
            )}

            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                View My Rewards
              </Link>
              <button
                onClick={() => {
                  setSuccessState({ show: false, pointsEarned: 0, totalPoints: 0, orderId: '' })
                  window.location.href = '/'
                }}
                className="w-full px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-primary text-white mt-16 py-8 text-center">
        <p className="mb-2">Fresh Telugu Inti Tiffins</p>
        <p className="text-sm opacity-90">Authentic Telugu Breakfast | Homemade Quality | Daily Delivery</p>
        <p className="text-xs opacity-75 mt-4">Delivery within selected areas in Telangana</p>
      </footer>
    </main>
  )
}
