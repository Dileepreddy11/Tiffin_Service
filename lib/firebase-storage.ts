import { database } from './firebase'
import {
  ref,
  set,
  get,
  remove,
  query,
  orderByChild,
  equalTo,
} from 'firebase/database'

/**
 * Menu Items Management
 */

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image?: string
  available: boolean
}

export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const menuRef = ref(database, 'menu_items')
    const snapshot = await get(menuRef)

    if (!snapshot.exists()) {
      return []
    }

    const items: MenuItem[] = []
    snapshot.forEach((child) => {
      items.push({
        id: child.key!,
        ...child.val(),
      })
    })

    return items
  } catch (error) {
    console.error('[v0] Error fetching menu items:', error)
    return []
  }
}

export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  try {
    const itemRef = ref(database, `menu_items/${id}`)
    const snapshot = await get(itemRef)

    if (!snapshot.exists()) {
      return null
    }

    return {
      id: snapshot.key!,
      ...snapshot.val(),
    }
  } catch (error) {
    console.error('[v0] Error fetching menu item:', error)
    return null
  }
}

export async function addMenuItem(item: Omit<MenuItem, 'id'>): Promise<string> {
  try {
    const itemId = Date.now().toString(36) + Math.random().toString(36).substr(2)
    const itemRef = ref(database, `menu_items/${itemId}`)

    await set(itemRef, {
      ...item,
      createdAt: Date.now(),
    })

    return itemId
  } catch (error) {
    console.error('[v0] Error adding menu item:', error)
    throw error
  }
}

export async function updateMenuItem(id: string, item: Partial<MenuItem>): Promise<void> {
  try {
    const itemRef = ref(database, `menu_items/${id}`)

    await set(itemRef, {
      ...item,
      updatedAt: Date.now(),
    })
  } catch (error) {
    console.error('[v0] Error updating menu item:', error)
    throw error
  }
}

export async function deleteMenuItem(id: string): Promise<void> {
  try {
    const itemRef = ref(database, `menu_items/${id}`)
    await remove(itemRef)
  } catch (error) {
    console.error('[v0] Error deleting menu item:', error)
    throw error
  }
}

/**
 * Orders Management
 */

export interface OrderItem {
  itemId: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  items: OrderItem[]
  totalPrice: number
  deliveryDate: string
  timeSlot: string
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  pointsEarned: number
  createdAt: number
}

export async function getOrders(): Promise<Order[]> {
  try {
    const ordersRef = ref(database, 'orders')
    const snapshot = await get(ordersRef)

    if (!snapshot.exists()) {
      return []
    }

    const orders: Order[] = []
    snapshot.forEach((child) => {
      orders.push({
        id: child.key!,
        ...child.val(),
      })
    })

    // Sort by creation date (newest first)
    return orders.sort((a, b) => b.createdAt - a.createdAt)
  } catch (error) {
    console.error('[v0] Error fetching orders:', error)
    return []
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const orderRef = ref(database, `orders/${id}`)
    const snapshot = await get(orderRef)

    if (!snapshot.exists()) {
      return null
    }

    return {
      id: snapshot.key!,
      ...snapshot.val(),
    }
  } catch (error) {
    console.error('[v0] Error fetching order:', error)
    return null
  }
}

export async function createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<string> {
  try {
    const orderId = Date.now().toString(36) + Math.random().toString(36).substr(2)
    const orderRef = ref(database, `orders/${orderId}`)

    await set(orderRef, {
      ...order,
      createdAt: Date.now(),
    })

    return orderId
  } catch (error) {
    console.error('[v0] Error creating order:', error)
    throw error
  }
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<void> {
  try {
    const orderRef = ref(database, `orders/${id}`)
    const currentOrder = await get(orderRef)

    if (!currentOrder.exists()) {
      throw new Error('Order not found')
    }

    await set(orderRef, {
      ...currentOrder.val(),
      ...updates,
      updatedAt: Date.now(),
    })
  } catch (error) {
    console.error('[v0] Error updating order:', error)
    throw error
  }
}

export async function updateOrderStatus(
  id: string,
  status: Order['status']
): Promise<void> {
  try {
    const orderRef = ref(database, `orders/${id}`)
    const currentOrder = await get(orderRef)

    if (!currentOrder.exists()) {
      throw new Error('Order not found')
    }

    await set(orderRef, {
      ...currentOrder.val(),
      status,
      updatedAt: Date.now(),
    })
  } catch (error) {
    console.error('[v0] Error updating order status:', error)
    throw error
  }
}

/**
 * Customers Management
 */

export interface Customer {
  id: string
  name: string
  phone: string
  totalOrders: number
  rewardPoints: number
  createdAt: number
}

export async function getCustomers(): Promise<Customer[]> {
  try {
    const customersRef = ref(database, 'customers')
    const snapshot = await get(customersRef)

    if (!snapshot.exists()) {
      return []
    }

    const customers: Customer[] = []
    snapshot.forEach((child) => {
      customers.push({
        id: child.key!,
        ...child.val(),
      })
    })

    return customers
  } catch (error) {
    console.error('[v0] Error fetching customers:', error)
    return []
  }
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  try {
    const customerRef = ref(database, `customers/${id}`)
    const snapshot = await get(customerRef)

    if (!snapshot.exists()) {
      return null
    }

    return {
      id: snapshot.key!,
      ...snapshot.val(),
    }
  } catch (error) {
    console.error('[v0] Error fetching customer:', error)
    return null
  }
}

export async function createOrUpdateCustomer(customer: Omit<Customer, 'createdAt'>): Promise<string> {
  try {
    const customerId = customer.id || Date.now().toString(36) + Math.random().toString(36).substr(2)
    const customerRef = ref(database, `customers/${customerId}`)

    await set(customerRef, {
      ...customer,
      createdAt: customer.createdAt || Date.now(),
    })

    return customerId
  } catch (error) {
    console.error('[v0] Error creating/updating customer:', error)
    throw error
  }
}

export async function updateCustomerRewards(
  customerId: string,
  pointsToAdd: number
): Promise<void> {
  try {
    const customerRef = ref(database, `customers/${customerId}`)
    const currentCustomer = await get(customerRef)

    if (!currentCustomer.exists()) {
      throw new Error('Customer not found')
    }

    const customer = currentCustomer.val()
    const newPoints = (customer.rewardPoints || 0) + pointsToAdd

    await set(customerRef, {
      ...customer,
      rewardPoints: newPoints,
      updatedAt: Date.now(),
    })
  } catch (error) {
    console.error('[v0] Error updating customer rewards:', error)
    throw error
  }
}
