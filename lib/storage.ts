// Storage utilities for managing app data in localStorage

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

// Menu Management
export const getMenuItems = (): MenuItem[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem('menu_items')
  return data ? JSON.parse(data) : getDefaultMenu()
}

export const setMenuItems = (items: MenuItem[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('menu_items', JSON.stringify(items))
}

export const addMenuItem = (item: MenuItem) => {
  const items = getMenuItems()
  items.push(item)
  setMenuItems(items)
}

export const removeMenuItem = (id: string) => {
  const items = getMenuItems().filter((item) => item.id !== id)
  setMenuItems(items)
}

export const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
  const items = getMenuItems().map((item) => (item.id === id ? { ...item, ...updates } : item))
  setMenuItems(items)
}

// Orders Management
export const getOrders = (): Order[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem('orders')
  return data ? JSON.parse(data) : []
}

export const setOrders = (orders: Order[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('orders', JSON.stringify(orders))
}

export const addOrder = (order: Order) => {
  const orders = getOrders()
  orders.push(order)
  setOrders(orders)
}

export const getOrdersByPhone = (phone: string): Order[] => {
  return getOrders().filter((order) => order.customerPhone === phone)
}

export const updateOrderStatus = (orderId: string, status: Order['status']) => {
  const orders = getOrders().map((order) =>
    order.id === orderId ? { ...order, status } : order
  )
  setOrders(orders)
}

// Customer Management
export const getCustomers = (): Customer[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem('customers')
  return data ? JSON.parse(data) : []
}

export const setCustomers = (customers: Customer[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('customers', JSON.stringify(customers))
}

export const getCustomerByPhone = (phone: string): Customer | null => {
  const customers = getCustomers()
  return customers.find((c) => c.phone === phone) || null
}

export const createOrUpdateCustomer = (phone: string, name: string) => {
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
  setCustomers(customers)
  return newCustomer
}

export const addRewardPoints = (phone: string, points: number) => {
  const customers = getCustomers()
  const customer = customers.find((c) => c.phone === phone)

  if (customer) {
    customer.rewardPoints += points
    customer.totalOrders += 1
    setCustomers(customers)
  }
}

export const redeemReward = (phone: string, pointsRequired: number) => {
  const customers = getCustomers()
  const customer = customers.find((c) => c.phone === phone)

  if (customer && customer.rewardPoints >= pointsRequired) {
    customer.rewardPoints -= pointsRequired
    setCustomers(customers)
    return true
  }
  return false
}

// Default menu data
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

// Initialize default menu if empty
export const initializeMenu = () => {
  if (getMenuItems().length === 0) {
    setMenuItems(getDefaultMenu())
  }
}

export const getTimeSlots = () => {
  return ['7:00 AM - 7:30 AM', '7:30 AM - 8:00 AM', '8:00 AM - 8:30 AM', '8:30 AM - 9:00 AM']
}

export const getOrderDeadlineTime = () => {
  return '8:00 PM' // Orders must be placed by 8 PM for next day delivery
}

export const isOrderingAvailable = (): boolean => {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const currentTime = hours * 60 + minutes
  const deadlineTime = 20 * 60 // 8 PM in minutes
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
