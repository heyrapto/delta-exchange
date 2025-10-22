import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface TradeState {
  // Trade Configuration
  tradeType: 'long' | 'short'
  leverage: number
  orderType: 'limit' | 'market' | 'stopLimit'
  stopPriceType: 'mark' | 'last' | 'index'
  stopLimitType: 'stopLimit' | 'takeProfitLimit'
  
  // Order Details
  quantity: string
  stopPrice: string
  limitPrice: string
  quantityPercent: number
  
  // Options
  reduceOnly: boolean
  maker: boolean
  setAsDefault: boolean
  
  // Market Data
  currentPrice: number
  markPrice: number
  indexPrice: number
  lastPrice: number
  markIV: number
  volume24h: number
  openInterest: number
  
  // Calculations
  fundsRequired: number
  availableMargin: number
  maxPosition: number
  
  // Instrument selection
  selectedContract: 'BTC' | 'ETH'
  
  // Orders (demo)
  openOrders: Array<{
    id: string
    side: 'long' | 'short'
    orderType: 'limit' | 'market' | 'stopLimit'
    price?: number
    quantity: number
    leverage: number
    status: 'open' | 'filled' | 'cancelled'
    time: number
  }>
  orderHistory: Array<{
    id: string
    side: 'long' | 'short'
    orderType: 'limit' | 'market' | 'stopLimit'
    price?: number
    quantity: number
    leverage: number
    status: 'filled' | 'cancelled'
    time: number
    filledPrice?: number
  }>
  
  // UI State
  showLeveragePanel: boolean
  showStopPriceDropdown: boolean
  showStopLimitDropdown: boolean
  
  // Actions
  setTradeType: (type: 'long' | 'short') => void
  setLeverage: (leverage: number) => void
  setOrderType: (type: 'limit' | 'market' | 'stopLimit') => void
  setStopPriceType: (type: 'mark' | 'last' | 'index') => void
  setStopLimitType: (type: 'stopLimit' | 'takeProfitLimit') => void
  setQuantity: (quantity: string) => void
  setStopPrice: (price: string) => void
  setLimitPrice: (price: string) => void
  setQuantityPercent: (percent: number) => void
  setReduceOnly: (value: boolean) => void
  setMaker: (value: boolean) => void
  setSetAsDefault: (value: boolean) => void
  setShowLeveragePanel: (show: boolean) => void
  setShowStopPriceDropdown: (show: boolean) => void
  setShowStopLimitDropdown: (show: boolean) => void
  updateMarketData: (data: Partial<Pick<TradeState, 'currentPrice' | 'markPrice' | 'indexPrice' | 'lastPrice' | 'markIV' | 'volume24h' | 'openInterest' | 'availableMargin'>>) => void
  resetTrade: () => void
  placeOrder: (order: { side: 'long' | 'short'; orderType: 'limit' | 'market' | 'stopLimit'; price?: number; quantity: number; }) => void
  cancelOrder: (id: string) => void
  fillOrder: (id: string, filledPrice: number) => void
  setSelectedContract: (symbol: 'BTC' | 'ETH') => void
}

const initialMarketData = {
  currentPrice: 108068.0,  
  markPrice: 108068.0,
  indexPrice: 108000.0,  // Fixed: was 5380.0, now matches BTC price range          
  lastPrice: 108068.0,          
  markIV: 42.5,                
  volume24h: 30000000000,      
  openInterest: 33100000000   
}

export const useTradeStore = create<TradeState>()(
    (set: any, get: any) => ({
      // Initial State
      tradeType: 'short',
      leverage: 20,
      orderType: 'limit',
      stopPriceType: 'mark',
      stopLimitType: 'stopLimit',
      quantity: '',
      stopPrice: '',
      limitPrice: '',
      quantityPercent: 0,
      reduceOnly: false,
      maker: false,
      setAsDefault: false,
      showLeveragePanel: false,
      showStopPriceDropdown: false,
      showStopLimitDropdown: false,
      availableMargin: 0,
      maxPosition: 199999.9,
      openOrders: [],
      orderHistory: [],
      selectedContract: 'BTC',
      ...initialMarketData,
      fundsRequired: 0,

      // Actions
      setTradeType: (type: any) => set({ tradeType: type }),
      setLeverage: (leverage: any) => {
        set({ leverage })
        // Calculate funds required after leverage change
        const { quantity, currentPrice } = get()
        const qty = parseFloat(quantity) || 0
        const funds = (qty * currentPrice) / leverage
        set({ fundsRequired: funds })
      },
      setOrderType: (type: any) => set({ orderType: type }),
      setStopPriceType: (type: any) => set({ stopPriceType: type }),
      setStopLimitType: (type: any) => set({ stopLimitType: type }),
      setQuantity: (quantity: any) => {
        set({ quantity })
        // Calculate funds required after quantity change
        const { currentPrice, leverage } = get()
        const qty = parseFloat(quantity) || 0
        const funds = (qty * currentPrice) / leverage
        set({ fundsRequired: funds })
      },
      setStopPrice: (price: any) => set({ stopPrice: price }),
      setLimitPrice: (price: any) => set({ limitPrice: price }),
      setQuantityPercent: (percent: any) => {
        const { maxPosition, currentPrice, leverage } = get()
        const calculatedQuantity = (maxPosition * percent / 100) / (currentPrice * leverage)
        const qty = calculatedQuantity.toFixed(3)
        const funds = (calculatedQuantity * currentPrice) / leverage
        set({ 
          quantityPercent: percent,
          quantity: qty,
          fundsRequired: funds
        })
      },
      setReduceOnly: (value: any) => set({ reduceOnly: value }),
      setMaker: (value: any) => set({ maker: value }),
      setSetAsDefault: (value: any) => set({ setAsDefault: value }),
      setShowLeveragePanel: (show: any) => set({ showLeveragePanel: show }),
      setShowStopPriceDropdown: (show: any) => set({ showStopPriceDropdown: show }),
      setShowStopLimitDropdown: (show: any) => set({ showStopLimitDropdown: show }),
      
      updateMarketData: (data: any) => {
        set(data)
        // Recalculate funds when market data changes
        const { quantity, currentPrice, leverage } = get()
        const qty = parseFloat(quantity) || 0
        const funds = (qty * currentPrice) / leverage
        set({ fundsRequired: funds })
      },
      
      setSelectedContract: (symbol: 'BTC' | 'ETH') => set({ selectedContract: symbol }),
      
      placeOrder: ({ side, orderType, price, quantity }) => {
        const { leverage, openOrders } = get()
        const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`
        const qtyNum = Number(quantity) || 0
        const newOrder = {
          id,
          side,
          orderType,
          price,
          quantity: qtyNum,
          leverage,
          status: 'open' as const,
          time: Date.now(),
        }
        set({ openOrders: [newOrder, ...openOrders] })
      },
      
      cancelOrder: (id: string) => {
        const { openOrders, orderHistory } = get()
        const order = openOrders.find((o: any) => o.id === id)
        if (order) {
          const cancelledOrder = { ...order, status: 'cancelled' as const }
          set({ 
            openOrders: openOrders.filter((o: any) => o.id !== id),
            orderHistory: [cancelledOrder, ...orderHistory]
          })
        }
      },
      
      fillOrder: (id: string, filledPrice: number) => {
        const { openOrders, orderHistory } = get()
        const order = openOrders.find((o: any) => o.id === id)
        if (order) {
          const filledOrder = { ...order, status: 'filled' as const, filledPrice }
          set({ 
            openOrders: openOrders.filter((o: any) => o.id !== id),
            orderHistory: [filledOrder, ...orderHistory]
          })
        }
      },
      
      resetTrade: () => set({
        tradeType: 'short',
        leverage: 20,
        orderType: 'limit',
        stopPriceType: 'mark',
        stopLimitType: 'stopLimit',
        quantity: '',
        stopPrice: '',
        limitPrice: '',
        quantityPercent: 0,
        reduceOnly: false,
        maker: false,
        setAsDefault: false,
        showLeveragePanel: false,
        showStopPriceDropdown: false,
        showStopLimitDropdown: false,
        fundsRequired: 0,
      }),
    }), 
)
