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
  updateMarketData: (data: Partial<Pick<TradeState, 'currentPrice' | 'markPrice' | 'indexPrice' | 'lastPrice' | 'markIV' | 'volume24h' | 'openInterest'>>) => void
  resetTrade: () => void
}

const initialMarketData = {
  currentPrice: 5390.0,
  markPrice: 5385.0,
  indexPrice: 5380.0,
  lastPrice: 5390.0,
  markIV: 42.5,
  volume24h: 422270,
  openInterest: 196560,
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
