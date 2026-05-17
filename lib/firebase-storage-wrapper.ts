/**
 * Firebase Storage Wrapper
 * Provides the same API as localStorage but uses Firebase Realtime Database
 * This ensures all data is permanently stored and synced across devices
 */

import { database } from './firebase'
import { ref, set, get, remove, update } from 'firebase/database'

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  available: boolean
}

export interface Order {
  id: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  deliveryDate: string
  timeSlot: string
  items: { itemId: string; quantity: number }[]
  totalPrice: number
  paymentMethod: 'upi' | 'cod'
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  createdAt: string
  pointsEarned: number
}

export interface Customer {
  id: string
  phone: string
  name: string
  rewardPoints: number
  totalOrders: number
  createdAt: string
}

// Default menu items
const getDefaultMenu = (): MenuItem[] => [
  {
    id: '1',
    name: 'Idli',
    description: 'Soft, fluffy steamed rice cakes served with sambar and chutney',
    price: 40,
    image: '/menu/idli.jpg',
    available: true,
  },
  {
    id: '2',
    name: 'Dosa',
    description: 'Crispy crepe made from rice and lentil batter with potato filling',
    price: 50,
    image: '/menu/dosa.jpg',
    available: true,
  },
  {
    id: '3',
    name: 'Upma',
    description: 'Savory semolina porridge with vegetables and spices',
    price: 35,
    image: '/menu/upma.jpg',
    available: true,
  },
  {
    id: '4',
    name: 'Pesarattu',
    description: 'Green moong dal crepe served with ginger chutney',
    price: 45,
    image: '/menu/pesarattu.jpg',
    available: true,
  },
  {
    id: '5',
    name: 'Gongura Rice',
    description: 'Tangy gongura leaves mixed with rice and traditional spices',
    price: 55,
    image: '/menu/gongura.jpg',
    available: true,
  },
  {
    id: '6',
    name: 'Poha',
    description: 'Light flattened rice with peanuts and vegetables',
    price: 30,
    image: '/menu/poha.jpg',
    available: true,
  },
]

// ============= MENU ITEMS =============

export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const menuRef = ref(database, 'menuItems')
    const snapshot = await get(menuRef)

    if (snapshot.exists()) {
      const data = snapshot.val()
      return Array.isArray(data) ? data : Object.values(data)
    }

    // Initialize with default menu if empty
    const defaultMenu = getDefaultMenu()
    await setMenuItems(defaultMenu)
    return defaultMenu
  } catch (error) {
    console.error('[v0] Error fetching menu items:', error)
    return getDefaultMenu()
  }
}

export const setMenuItems = async (items: MenuItem[]): Promise<void> => {
  try {
    const menuRef = ref(database, 'menuItems')
    await set(menuRef, items)
  } catch (error) {
    console.error('[v0] Error saving menu items:', error)
  }
}

export const addMenuItem = async (item: MenuItem): Promise<void> => {
  try {
    const items = await getMenuItems()
    items.push(item)
    await setMenuItems(items)
  } catch (error) {
    console.error('[v0] Error adding menu item:', error)
  }
}

export const removeMenuItem = async (id: string): Promise<void> => {
  try {
    const items = await getMenuItems()
    const filtered = items.filter((item) => item.id !== id)
    await setMenuItems(filtered)
  } catch (error) {
    console.error('[v0] Error removing menu item:', error)
  }
}

export const updateMenuItem = async (id: string, updates: Partial<MenuItem>): Promise<void> => {
  try {
    const items = await getMenuItems()
    const updated = items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    await setMenuItems(updated)
  } catch (error) {
    console.error('[v0] Error updating menu item:', error)
  }
}

// ============= ORDERS =============

export const getOrders = async (): Promise<Order[]> => {
  try {
    const ordersRef = ref(database, 'orders')
    const snapshot = await get(ordersRef)

    if (snapshot.exists()) {
      const data = snapshot.val()
      return Array.isArray(data) ? data : Object.values(data)
    }

    return []
  } catch (error) {
    console.error('[v0] Error fetching orders:', error)
    return []
  }
}

export const setOrders = async (orders: Order[]): Promise<void> => {
  try {
    const ordersRef = ref(database, 'orders')
    await set(ordersRef, orders)
  } catch (error) {
    console.error('[v0] Error saving orders:', error)
  }
}

export const addOrder = async (order: Order): Promise<void> => {
  try {
    const orders = await getOrders()
    orders.push(order)
    await setOrders(orders)
  } catch (error) {
    console.error('[v0] Error adding order:', error)
  }
}

export const getOrdersByPhone = async (phone: string): Promise<Order[]> => {
  try {
    const orders = await getOrders()
    return orders.filter((order) => order.customerPhone === phone)
  } catch (error) {
    console.error('[v0] Error fetching orders by phone:', error)
    return []
  }
}

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
  try {
    const orders = await getOrders()
    const updated = orders.map((order) => (order.id === orderId ? { ...order, status } : order))
    await setOrders(updated)
  } catch (error) {
    console.error('[v0] Error updating order status:', error)
  }
}

// ============= CUSTOMERS =============

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const customersRef = ref(database, 'customers')
    const snapshot = await get(customersRef)

    if (snapshot.exists()) {
      const data = snapshot.val()
      return Array.isArray(data) ? data : Object.values(data)
    }

    return []
  } catch (error) {
    console.error('[v0] Error fetching customers:', error)
    return []
  }
}

export const setCustomers = async (customers: Customer[]): Promise<void> => {
  try {
    const customersRef = ref(database, 'customers')
    await set(customersRef, customers)
  } catch (error) {
    console.error('[v0] Error saving customers:', error)
  }
}

export const addCustomer = async (customer: Customer): Promise<void> => {
  try {
    const customers = await getCustomers()
    customers.push(customer)
    await setCustomers(customers)
  } catch (error) {
    console.error('[v0] Error adding customer:', error)
  }
}

export const getCustomerByPhone = async (phone: string): Promise<Customer | undefined> => {
  try {
    const customers = await getCustomers()
    return customers.find((customer) => customer.phone === phone)
  } catch (error) {
    console.error('[v0] Error fetching customer:', error)
    return undefined
  }
}

export const updateCustomerRewards = async (phone: string, points: number): Promise<void> => {
  try {
    const customers = await getCustomers()
    const updated = customers.map((customer) =>
      customer.phone === phone
        ? { ...customer, rewardPoints: customer.rewardPoints + points, totalOrders: customer.totalOrders + 1 }
        : customer
    )
    await setCustomers(updated)
  } catch (error) {
    console.error('[v0] Error updating customer rewards:', error)
  }
}

// ============= REWARDS =============

export const getRewardTiers = () => [
  { points: 10, reward: '5% Discount', icon: '🎁' },
  { points: 25, reward: 'Free Item Coupon', icon: '🏆' },
  { points: 50, reward: '15% Discount', icon: '⭐' },
  { points: 100, reward: 'Premium Member', icon: '👑' },
]
