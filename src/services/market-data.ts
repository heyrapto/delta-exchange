import { useTradeStore } from '@/store/trade-store'

// Simulate live market data updates
export class MarketDataService {
  private static instance: MarketDataService
  private intervalId: NodeJS.Timeout | null = null
  private isRunning = false

  static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService()
    }
    return MarketDataService.instance
  }

  startLiveUpdates() {
    if (this.isRunning) return
    
    this.isRunning = true
    this.intervalId = setInterval(() => {
      this.updateMarketData()
    }, 2000) // Update every 2 seconds
  }

  stopLiveUpdates() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isRunning = false
  }

  private updateMarketData() {
    const store = useTradeStore.getState()
    
    // Only update non-price data to avoid overriding the correct BTC/ETH prices
    // Simulate IV changes
    const baseIV = 42.5
    const ivFluctuation = (Math.random() - 0.5) * 2 // ±1 IV fluctuation
    const newIV = Math.max(baseIV + ivFluctuation, 30) // Minimum IV floor
    
    // Simulate volume changes
    const baseVolume = 30000000000
    const volumeFluctuation = (Math.random() - 0.5) * 1000000000 // ±500M volume fluctuation
    const newVolume = Math.max(baseVolume + volumeFluctuation, 25000000000)
    
    // Simulate OI changes
    const baseOI = 33100000000
    const oiFluctuation = (Math.random() - 0.5) * 1000000000 // ±500M OI fluctuation
    const newOI = Math.max(baseOI + oiFluctuation, 30000000000)
    
    // Update store with only non-price data
    store.updateMarketData({
      markIV: newIV,
      volume24h: newVolume,
      openInterest: newOI,
    })
  }

  // Simulate order execution
  executeOrder(tradeType: 'long' | 'short', quantity: number, leverage: number) {
    const store = useTradeStore.getState()
    
    // Simulate execution delay
    setTimeout(() => {
      // Update available margin (simulate funds being used)
      const fundsUsed = (quantity * store.currentPrice) / leverage
      const newAvailableMargin = Math.max(store.availableMargin - fundsUsed, 0)
      
      store.updateMarketData({
        availableMargin: newAvailableMargin
      })
    }, 1000)
  }

  // Reset demo data - use current store values, don't override
  resetDemoData() {
    const store = useTradeStore.getState()
    // Don't reset price - keep current values from store
    store.updateMarketData({
      markIV: 42.5,
      volume24h: 422270,
      openInterest: 196560,
      availableMargin: 10000,
    })
  }
}

// Export singleton instance
export const marketDataService = MarketDataService.getInstance()
