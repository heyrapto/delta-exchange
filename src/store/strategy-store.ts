import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface StrategyOrder {
  id: string
  type: 'call' | 'put'
  side: 'buy' | 'sell'
  strike: number
  price: number
  quantity: number
  contract: string
  leverage?: number
}

export interface StrategyState {
  // Strategy Builder toggle state
  isStrategyBuilderActive: boolean
  
  // Selected orders in strategy
  selectedOrders: StrategyOrder[]
  
  // Actions
  setStrategyBuilderActive: (active: boolean) => void
  addOrderToStrategy: (order: Omit<StrategyOrder, 'id'>) => void
  removeOrderFromStrategy: (id: string) => void
  clearStrategy: () => void
  updateOrderQuantity: (id: string, quantity: number) => void
  updateOrderPrice: (id: string, price: number) => void
}

export const useStrategyStore = create<StrategyState>()(
  devtools(
    (set, get) => ({
      // Initial state
      isStrategyBuilderActive: false,
      selectedOrders: [],

      // Actions
      setStrategyBuilderActive: (active: boolean) => {
        set({ isStrategyBuilderActive: active })
      },

      addOrderToStrategy: (orderData: Omit<StrategyOrder, 'id'>) => {
        const { selectedOrders } = get()
        const id = `${orderData.type}-${orderData.side}-${orderData.strike}-${Date.now()}`
        const newOrder: StrategyOrder = {
          ...orderData,
          id
        }
        
        // Check if order already exists (same type, side, strike)
        const existingIndex = selectedOrders.findIndex(
          order => 
            order.type === orderData.type && 
            order.side === orderData.side && 
            order.strike === orderData.strike
        )
        
        if (existingIndex >= 0) {
          // Update existing order
          set({
            selectedOrders: selectedOrders.map((order, index) => 
              index === existingIndex ? { ...order, quantity: order.quantity + orderData.quantity } : order
            )
          })
        } else {
          // Add new order
          set({ selectedOrders: [...selectedOrders, newOrder] })
        }
      },

      removeOrderFromStrategy: (id: string) => {
        const { selectedOrders } = get()
        set({ selectedOrders: selectedOrders.filter(order => order.id !== id) })
      },

      clearStrategy: () => {
        set({ selectedOrders: [] })
      },

      updateOrderQuantity: (id: string, quantity: number) => {
        const { selectedOrders } = get()
        set({
          selectedOrders: selectedOrders.map(order => 
            order.id === id ? { ...order, quantity } : order
          )
        })
      },

      updateOrderPrice: (id: string, price: number) => {
        const { selectedOrders } = get()
        set({
          selectedOrders: selectedOrders.map(order => 
            order.id === id ? { ...order, price } : order
          )
        })
      }
    }),
    {
      name: 'strategy-store'
    }
  )
)
