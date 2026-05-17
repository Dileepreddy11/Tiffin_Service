// Firebase-backed storage with same API as localStorage version
import { database } from './firebase'
import { ref, set, get, remove, onValue } from 'firebase/database'

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
  customerId?: string
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

// In-memory cache for client-side operations
let menuItemsCache: MenuItem[] = []
let ordersCache: Order[] = []
let customersCache: Customer[] = []

/**
 * Menu Management
 */

export const getMenuItems = (): MenuItem[] => {
  return menuItemsCache
}

export const setMenuItems = async (items: MenuItem[]) => {
  menuItemsCache = items
  try {
    const menuRef = ref(database, 'data/menu_items')
    await set(menuRef, items)
  } catch (error) {
    console.error('[v0] Error saving menu items to Firebase:', error)
  }
}

export const addMenuItem = async (item: MenuItem) => {
  const items = getMenuItems()
  items.push(item)
  await setMenuItems(items)
}

export const removeMenuItem = async (id: string) => {
  const items = getMenuItems().filter((item) => item.id !== id)
  await setMenuItems(items)
}

export const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
  const items = getMenuItems().map((item) =>
    item.id === id ? { ...item, ...updates } : item
  )
  await setMenuItems(items)
}

/**
 * Orders Management
 */

export const getOrders = (): Order[] => {
  return ordersCache
}

export const setOrders = async (orders: Order[]) => {
  ordersCache = orders
  try {
    const ordersRef = ref(database, 'data/orders')
    await set(ordersRef, orders)
  } catch (error) {
    console.error('[v0] Error saving orders to Firebase:', error)
  }
}

export const addOrder = async (order: Order) => {
  const orders = getOrders()
  orders.push(order)
  await setOrders(orders)
}

export const getOrdersByPhone = (phone: string): Order[] => {
  return getOrders().filter((order) => order.customerPhone === phone)
}

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  const orders = getOrders().map((order) =>
    order.id === orderId ? { ...order, status } : order
  )
  await setOrders(orders)
}

/**
 * Customer Management
 */

export const getCustomers = (): Customer[] => {
  return customersCache
}

export const setCustomers = async (customers: Customer[]) => {
  customersCache = customers
  try {
    const customersRef = ref(database, 'data/customers')
    await set(customersRef, customers)
  } catch (error) {
    console.error('[v0] Error saving customers to Firebase:', error)
  }
}

export const getCustomerByPhone = (phone: string): Customer | null => {
  const customers = getCustomers()
  return customers.find((c) => c.phone === phone) || null
}

export const createOrUpdateCustomer = async (phone: string, name: string) => {
  const customers = getCustomers()
  const existingCustomer = customers.find((c) => c.phone === phone)

  if (existingCustomer) {
    return existingCustomer
  }

  const newCustomer: Customer = {
    id: Math.random().toString(36).substr(2, 9),
    phone,
    name,
    rewardPoints: 0,
    totalOrders: 0,
    createdAt: new Date().toISOString(),
  }

  customers.push(newCustomer)
  await setCustomers(customers)
  return newCustomer
}

export const addRewardPoints = async (phone: string, points: number) => {
  const customers = getCustomers()
  const customer = customers.find((c) => c.phone === phone)

  if (customer) {
    customer.rewardPoints += points
    customer.totalOrders += 1
    await setCustomers(customers)
  }
}

export const redeemReward = async (phone: string, pointsRequired: number) => {
  const customers = getCustomers()
  const customer = customers.find((c) => c.phone === phone)

  if (customer && customer.rewardPoints >= pointsRequired) {
    customer.rewardPoints -= pointsRequired
    await setCustomers(customers)
    return true
  }
  return false
}

/**
 * Data Initialization and Sync
 */

export const initializeFromFirebase = async () => {
  try {
    const menuRef = ref(database, 'data/menu_items')
    const ordersRef = ref(database, 'data/orders')
    const customersRef = ref(database, 'data/customers')

    const menuSnapshot = await get(menuRef)
    if (menuSnapshot.exists()) {
      menuItemsCache = menuSnapshot.val() || []
    } else {
      // Initialize with default menu if empty
      menuItemsCache = getDefaultMenu()
      await setMenuItems(menuItemsCache)
    }

    const ordersSnapshot = await get(ordersRef)
    if (ordersSnapshot.exists()) {
      ordersCache = ordersSnapshot.val() || []
    }

    const customersSnapshot = await get(customersRef)
    if (customersSnapshot.exists()) {
      customersCache = customersSnapshot.val() || []
    }

    console.log('[v0] Firebase data initialized')
  } catch (error) {
    console.error('[v0] Error initializing Firebase data:', error)
  }
}

/**
 * Real-time listeners for live updates
 */

export const listenToMenuItems = (callback: (items: MenuItem[]) => void) => {
  const menuRef = ref(database, 'data/menu_items')
  return onValue(menuRef, (snapshot) => {
    if (snapshot.exists()) {
      menuItemsCache = snapshot.val()
      callback(menuItemsCache)
    }
  })
}

export const listenToOrders = (callback: (orders: Order[]) => void) => {
  const ordersRef = ref(database, 'data/orders')
  return onValue(ordersRef, (snapshot) => {
    if (snapshot.exists()) {
      ordersCache = snapshot.val()
      callback(ordersCache)
    }
  })
}

export const listenToCustomers = (callback: (customers: Customer[]) => void) => {
  const customersRef = ref(database, 'data/customers')
  return onValue(customersRef, (snapshot) => {
    if (snapshot.exists()) {
      customersCache = snapshot.val()
      callback(customersCache)
    }
  })
}

/**
 * Utility functions (unchanged)
 */

export const getDefaultMenu = (): MenuItem[] => {
  return [
    {
      id: '1',
      name: 'Idli',
      description: 'Soft, fluffy steamed rice cakes served with sambar and chutney',
      price: 40,
      image: '/images/idli.jpg',
      available: true,
    },
    {
      id: '2',
      name: 'Dosa',
      description: 'Crispy crepe made from rice and lentil batter with potato filling',
      price: 50,
      image: '/images/dosa.jpg',
      available: true,
    },
    {
      id: '3',
      name: 'Upma',
      description: 'Savory semolina porridge with vegetables and spices',
      price: 35,
      image: '/images/upma.jpg',
      available: true,
    },
    {
      id: '4',
      name: 'Pesarattu',
      description: 'Green moong dal crepe served with ginger chutney',
      price: 45,
      image: '/images/pesarattu.jpg',
      available: true,
    },
    {
      id: '5',
      name: 'Gongura Rice',
      description: 'Tangy gongura leaves mixed with rice and traditional spices',
      price: 55,
      image: '/images/gongura.jpg',
      available: true,
    },
    {
      id: '6',
      name: 'Poha',
      description: 'Light flattened rice with peanuts and vegetables',
      price: 30,
      image: '/images/poha.jpg',
      available: true,
    },
  ]
}

export const getTimeSlots = () => {
  return ['7:00 AM - 7:30 AM', '7:30 AM - 8:00 AM', '8:00 AM - 8:30 AM', '8:30 AM - 9:00 AM']
}

export const getOrderDeadlineTime = () => {
  return '8:00 PM'
}

export const isOrderingAvailable = (): boolean => {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const currentTime = hours * 60 + minutes
  const deadlineTime = 20 * 60
  return currentTime < deadlineTime
}

export const getRewardTiers = () => {
  return [
    { points: 100, reward: 'Free Keychain', icon: '🔑' },
    { points: 200, reward: 'Free Tiffin Combo', icon: '🎁' },
    { points: 400, reward: 'Special Festival Gift', icon: '🎊' },
  ]
}

export const getNextReward = (currentPoints: number) => {
  const tiers = getRewardTiers()
  return tiers.find((tier) => tier.points > currentPoints) || tiers[tiers.length - 1]
}

export const initializeMenu = async () => {
  if (getMenuItems().length === 0) {
    await setMenuItems(getDefaultMenu())
  }
}
