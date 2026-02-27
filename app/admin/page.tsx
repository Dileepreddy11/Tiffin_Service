'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { Edit, Trash2, Plus, Save, X } from 'lucide-react'
import {
  MenuItem,
  Order,
  Customer,
  getMenuItems,
  setMenuItems,
  removeMenuItem,
  getOrders,
  updateOrderStatus,
  getCustomers,
  getRewardTiers,
} from '@/lib/storage'

type Tab = 'menu' | 'orders' | 'customers'

interface EditingItem extends MenuItem {
  isNew?: boolean
}

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>('menu')
  const [menuItems, setMenuItemsState] = useState<MenuItem[]>([])
  const [orders, setOrdersState] = useState<Order[]>([])
  const [customers, setCustomersState] = useState<Customer[]>([])
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setMenuItemsState(getMenuItems())
    setOrdersState(getOrders())
    setCustomersState(getCustomers())
  }

  // Menu Management
  const handleAddMenuItem = () => {
    setEditingItem({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      description: '',
      price: 0,
      image: '',
      available: true,
      isNew: true,
    })
    setShowAddForm(true)
  }

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingItem({ ...item })
    setShowAddForm(true)
  }

  const handleSaveMenuItem = () => {
    if (!editingItem || !editingItem.name || editingItem.price <= 0) {
      alert('Please fill all required fields')
      return
    }

    const items = getMenuItems()
    if (editingItem.isNew) {
      items.push(editingItem)
    } else {
      const index = items.findIndex((i) => i.id === editingItem.id)
      if (index !== -1) {
        items[index] = editingItem
      }
    }

    setMenuItems(items)
    setMenuItemsState(items)
    setEditingItem(null)
    setShowAddForm(false)
  }

  const handleDeleteMenuItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      removeMenuItem(id)
      setMenuItemsState(getMenuItems())
    }
  }

  // Order Management
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status)
    setOrdersState(getOrders())
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0)
  const totalOrders = orders.length
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-background">
      <Navigation />

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">Manage your tiffin business</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-lg border-2 border-accent p-6">
            <p className="text-muted-foreground text-sm mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-primary">{totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg border-2 border-accent p-6">
            <p className="text-muted-foreground text-sm mb-2">Delivered</p>
            <p className="text-3xl font-bold text-green-600">{deliveredOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg border-2 border-accent p-6">
            <p className="text-muted-foreground text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-secondary">₹{totalRevenue}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg border-2 border-accent p-6">
            <p className="text-muted-foreground text-sm mb-2">Total Customers</p>
            <p className="text-3xl font-bold text-primary">{customers.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b-2 border-border">
          <button
            onClick={() => setTab('menu')}
            className={`px-6 py-3 font-bold border-b-4 transition ${
              tab === 'menu'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-primary'
            }`}
          >
            Menu Items
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`px-6 py-3 font-bold border-b-4 transition ${
              tab === 'orders'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-primary'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setTab('customers')}
            className={`px-6 py-3 font-bold border-b-4 transition ${
              tab === 'customers'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-primary'
            }`}
          >
            Customers & Rewards
          </button>
        </div>

        {/* Menu Management */}
        {tab === 'menu' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-playfair font-bold text-primary">Manage Menu Items</h2>
              {!showAddForm && (
                <button
                  onClick={handleAddMenuItem}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition"
                >
                  <Plus size={20} />
                  Add Item
                </button>
              )}
            </div>

            {/* Add/Edit Form */}
            {showAddForm && editingItem && (
              <div className="bg-white rounded-xl shadow-lg border-2 border-accent p-8 mb-8">
                <h3 className="text-xl font-bold text-primary mb-6">
                  {editingItem.isNew ? 'Add New Item' : 'Edit Item'}
                </h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Item Name *</label>
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                      placeholder="e.g., Idli, Dosa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Description *</label>
                    <textarea
                      value={editingItem.description}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                      placeholder="Brief description of the item"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Price (₹) *</label>
                      <input
                        type="number"
                        value={editingItem.price}
                        onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                        min="0"
                        step="5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Available</label>
                      <select
                        value={editingItem.available ? 'yes' : 'no'}
                        onChange={(e) => setEditingItem({ ...editingItem, available: e.target.value === 'yes' })}
                        className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                      >
                        <option value="yes">Yes</option>
                        <option value="no">Coming Soon</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleSaveMenuItem}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition"
                  >
                    <Save size={18} />
                    Save Item
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem(null)
                      setShowAddForm(false)
                    }}
                    className="flex items-center gap-2 bg-gray-400 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-500 transition"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Menu Items Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-accent">
              {menuItems.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No menu items yet</p>
                  <button
                    onClick={handleAddMenuItem}
                    className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition"
                  >
                    Add First Item
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-primary/10 border-b-2 border-accent">
                      <tr>
                        <th className="px-6 py-4 text-left font-bold text-primary">Item Name</th>
                        <th className="px-6 py-4 text-left font-bold text-primary">Description</th>
                        <th className="px-6 py-4 text-left font-bold text-primary">Price</th>
                        <th className="px-6 py-4 text-left font-bold text-primary">Status</th>
                        <th className="px-6 py-4 text-left font-bold text-primary">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItems.map((item) => (
                        <tr key={item.id} className="border-b border-border hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold text-foreground">{item.name}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                            {item.description}
                          </td>
                          <td className="px-6 py-4 font-bold text-primary">₹{item.price}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                item.available
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {item.available ? 'Available' : 'Coming Soon'}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex gap-2">
                            <button
                              onClick={() => handleEditMenuItem(item)}
                              className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition text-blue-700"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item.id)}
                              className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition text-red-700"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Management */}
        {tab === 'orders' && (
          <div>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-6">All Orders</h2>

            {orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border-2 border-accent p-8 text-center">
                <p className="text-lg text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {[...orders].reverse().map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-lg border-2 border-accent p-6">
                    <div className="grid md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Order ID</p>
                        <p className="font-mono font-bold text-primary">{order.id.slice(0, 8)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Customer</p>
                        <p className="font-bold text-foreground">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Delivery</p>
                        <p className="font-bold text-foreground">{order.deliveryDate}</p>
                        <p className="text-xs text-muted-foreground">{order.timeSlot}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="font-bold text-primary">₹{order.totalPrice}</p>
                        <p className="text-xs text-muted-foreground">+{order.pointsEarned} pts</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                          className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-700 border-green-300'
                              : order.status === 'confirmed'
                                ? 'bg-blue-100 text-blue-700 border-blue-300'
                                : 'bg-gray-100 text-gray-700 border-gray-300'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-muted-foreground mb-2">Items:</p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item) => {
                          const menuItem = menuItems.find((m) => m.id === item.itemId)
                          return (
                            <span key={item.itemId} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
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
        )}

        {/* Customers & Rewards */}
        {tab === 'customers' && (
          <div>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-6">Customers & Rewards</h2>

            {customers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border-2 border-accent p-8 text-center">
                <p className="text-lg text-muted-foreground">No customers yet</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-accent">
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-primary/10 border-b-2 border-accent sticky top-0">
                      <tr>
                        <th className="px-6 py-4 text-left font-bold text-primary">Customer Name</th>
                        <th className="px-6 py-4 text-left font-bold text-primary">Phone</th>
                        <th className="px-6 py-4 text-left font-bold text-primary">Total Orders</th>
                        <th className="px-6 py-4 text-left font-bold text-primary">Reward Points</th>
                        <th className="px-6 py-4 text-left font-bold text-primary">Rewards Unlocked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => {
                        const rewardTiers = getRewardTiers()
                        const unlockedRewards = rewardTiers.filter((t) => customer.rewardPoints >= t.points)
                        return (
                          <tr key={customer.id} className="border-b border-border hover:bg-gray-50">
                            <td className="px-6 py-4 font-semibold text-foreground">{customer.name}</td>
                            <td className="px-6 py-4 font-mono text-muted-foreground">{customer.phone}</td>
                            <td className="px-6 py-4 text-center font-bold text-primary">{customer.totalOrders}</td>
                            <td className="px-6 py-4 text-center font-bold text-secondary">{customer.rewardPoints}</td>
                            <td className="px-6 py-4">
                              {unlockedRewards.length === 0 ? (
                                <span className="text-xs text-muted-foreground">-</span>
                              ) : (
                                <div className="flex flex-wrap gap-1">
                                  {unlockedRewards.map((tier) => (
                                    <span key={tier.points} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                      {tier.icon} {tier.reward}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
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
