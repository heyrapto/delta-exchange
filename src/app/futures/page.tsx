"use client"

import { PageLayout } from '@/components/layout/page-layout'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { MarketOverview } from '@/components/ui/market-overview'
import { DepthChart } from '@/components/ui/chart/depth-chart'
import { MarketOrderBook } from '@/components/ui/market-order-book'
import { RecentTrades } from '@/components/ui/recent-trades'
import { MarketTradePanel } from '@/components/ui/market-trade-panel'
import { ExchangePanel } from '@/components/exchange/exchange-panel'
import { useTradeStore } from '@/store/trade-store'
import { useEffect, useState } from 'react'

const FuturesPage = () => {
  const { currentPrice, markPrice, indexPrice } = useTradeStore()
  
  // Generate order book data
  const [buyOrders, setBuyOrders] = useState<Array<{ price: number; size: number; total: number }>>([])
  const [sellOrders, setSellOrders] = useState<Array<{ price: number; size: number; total: number }>>([])
  const [recentTrades, setRecentTrades] = useState<Array<{ price: number; size: number; time: string; type: "buy" | "sell" }>>([])

  // Generate order book and trades data
  useEffect(() => {
    const basePrice = currentPrice
    const spread = basePrice * 0.0001

    // Generate buy orders (bids) - below current price
    const newBuyOrders = Array.from({ length: 15 }, (_, i) => {
      const price = basePrice - spread - (i * spread * 5)
      const size = 0.2 + Math.random() * 2.0
      return { price, size, total: 0 }
    }).map((order, index, arr) => {
      const total = arr.slice(0, index + 1).reduce((sum, o) => sum + o.size, 0)
      return { ...order, total }
    })

    // Generate sell orders (asks) - above current price
    const newSellOrders = Array.from({ length: 15 }, (_, i) => {
      const price = basePrice + spread + (i * spread * 5)
      const size = 0.3 + Math.random() * 1.8
      return { price, size, total: 0 }
    }).map((order, index, arr) => {
      const total = arr.slice(0, index + 1).reduce((sum, o) => sum + o.size, 0)
      return { ...order, total }
    })

    // Generate recent trades
    const newRecentTrades = Array.from({ length: 20 }, (_, i) => ({
      price: basePrice + (Math.random() - 0.5) * spread * 30,
      size: 0.001 + Math.random() * 0.5,
      time: new Date(Date.now() - i * 10000).toLocaleTimeString("en-US", { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }),
      type: (Math.random() > 0.5 ? "buy" : "sell") as "buy" | "sell"
    }))

    setBuyOrders(newBuyOrders)
    setSellOrders(newSellOrders)
    setRecentTrades(newRecentTrades)
  }, [currentPrice])

  return (
    <PageLayout>
      <div className="flex flex-col h-[calc(100vh-200px)]">
        {/* Market Overview */}
        <MarketOverview />

        {/* Main Trading Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Section - Depth Chart */}
          <div className="w-full lg:w-[60%] h-[400px] lg:h-auto border-r border-gray-300">
            <DepthChart 
              currentPrice={currentPrice}
              buyOrders={buyOrders}
              sellOrders={sellOrders}
            />
          </div>

          {/* Middle Section - Order Book and Recent Trades */}
          <div className="w-full lg:w-[20%] flex flex-col border-r border-gray-300">
            {/* Order Book */}
            <div className="flex-1 min-h-0">
              <MarketOrderBook
                buyOrders={buyOrders.map(({ price, size }) => ({ price, size }))}
                sellOrders={sellOrders.map(({ price, size }) => ({ price, size }))}
                currentPrice={currentPrice}
                markPrice={markPrice}
                indexPrice={indexPrice}
              />
            </div>

            {/* Recent Trades */}
            <div className="h-[200px] border-t border-gray-300">
              <RecentTrades trades={recentTrades} />
            </div>
          </div>

          {/* Right Section - Trade Panel */}
          <div className="w-full lg:w-[20%] min-h-[400px] lg:h-auto">
            <MarketTradePanel />
          </div>
        </div>

        {/* Bottom Panel - Positions, Orders, etc. */}
        <ExchangePanel />
      </div>
    </PageLayout>
  )
}

export default FuturesPage