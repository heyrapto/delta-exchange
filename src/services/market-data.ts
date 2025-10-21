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
    
    // Simulate price fluctuations
    const basePrice = 5390
    const fluctuation = (Math.random() - 0.5) * 20 // ±10 price fluctuation
    const newPrice = Math.max(basePrice + fluctuation, 5000) // Minimum price floor
    
    // Simulate IV changes
    const baseIV = 42.5
    const ivFluctuation = (Math.random() - 0.5) * 2 // ±1 IV fluctuation
    const newIV = Math.max(baseIV + ivFluctuation, 30) // Minimum IV floor
    
    // Simulate volume changes
    const baseVolume = 422270
    const volumeFluctuation = (Math.random() - 0.5) * 50000 // ±25K volume fluctuation
    const newVolume = Math.max(baseVolume + volumeFluctuation, 300000)
    
    // Simulate OI changes
    const baseOI = 196560
    const oiFluctuation = (Math.random() - 0.5) * 20000 // ±10K OI fluctuation
    const newOI = Math.max(baseOI + oiFluctuation, 150000)
    
    // Update store with new data
    store.updateMarketData({
      currentPrice: newPrice,
      markPrice: newPrice - (Math.random() * 5), // Mark price slightly below current
      indexPrice: newPrice - (Math.random() * 10), // Index price below mark
      lastPrice: newPrice,
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

  // Reset demo data
  resetDemoData() {
    const store = useTradeStore.getState()
    store.updateMarketData({
      currentPrice: 5390.0,
      markPrice: 5385.0,
      indexPrice: 5380.0,
      lastPrice: 5390.0,
      markIV: 42.5,
      volume24h: 422270,
      openInterest: 196560,
      availableMargin: 10000, // Demo available margin
    })
  }
}

// Export singleton instance
export const marketDataService = MarketDataService.getInstance()
