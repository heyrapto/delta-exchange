"use client"

import { OrderBookEntry, RecentTrade } from "@/types"
import { useEffect, useState } from "react"
import { useTradeStore } from "@/store/trade-store"
import { BiChart, BiChevronDown, BiStar, BiTrendingDown, BiTrendingUp } from "react-icons/bi"
import { OrderBookRow, RecentTradeRow } from "../shared/order-book-card"

type ViewMode = "all" | "buy" | "sell"

export const OrderBook = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("all")
  const [lotSize, setLotSize] = useState(0.1)
  const [hoveredData, setHoveredData] = useState<{ price: number; size: number } | null>(null)
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null)

  // 🔥 Dynamic states - will be generated from current price
  const [sellOrders, setSellOrders] = useState<OrderBookEntry[]>([])
  const [buyOrders, setBuyOrders] = useState<OrderBookEntry[]>([])
  const [recentTrades, setRecentTrades] = useState<RecentTrade[]>([])

  const store = useTradeStore()
  const currentPrice = store.currentPrice
  const [spread, setSpread] = useState(99)
  const [spreadPercent, setSpreadPercent] = useState(0.09)

  // 🧠 Hover stats
  const handleHover = (
    data: { price: number; size: number } | null,
    pos?: { x: number; y: number }
  ) => {
    setHoveredData(data)
    setHoverPosition(pos || null)
  }

  const calculateHoverStats = () => {
    if (!hoveredData) return null
    const avgPrice = hoveredData.price * 0.9
    const amount = hoveredData.size
    const premium = hoveredData.price * hoveredData.size
    return { avgPrice, amount, premium }
  }

  const hoverStats = calculateHoverStats()


  // 🔄 Generate orderbook around current price
  useEffect(() => {
    const basePrice = store.currentPrice
    const spread = basePrice * 0.0001 // 0.01% spread for realistic trading
    
    // Generate sell orders above current price
    const newSellOrders = Array.from({ length: 7 }, (_, i) => ({
      price: basePrice + spread + (i * spread * 10),
      size: 1.2 + Math.random() * 1.5
    }))
    
    // Generate buy orders below current price  
    const newBuyOrders = Array.from({ length: 8 }, (_, i) => ({
      price: basePrice - spread - (i * spread * 10),
      size: 1.5 + Math.random() * 2.0
    }))
    
    // Generate recent trades around current price
    const newRecentTrades = Array.from({ length: 4 }, (_, i) => ({
      price: basePrice + (Math.random() - 0.5) * spread * 20,
      size: 0.001 + Math.random() * 0.05,
      time: new Date(Date.now() - i * 60000).toLocaleTimeString("en-US", { hour12: false }),
      type: Math.random() > 0.5 ? "buy" : "sell" as "buy" | "sell"
    }))
    
    setSellOrders(newSellOrders)
    setBuyOrders(newBuyOrders)
    setRecentTrades(newRecentTrades)
    setSpread(spread)
    setSpreadPercent((spread / basePrice) * 100)
  }, [store.currentPrice])

  const viewModeIcons = [
    { mode: "sell" as ViewMode, icon: <BiTrendingDown />, color: "text-red-400" },
    { mode: "all" as ViewMode, icon: <BiChart />, color: "text-gray-400" },
    { mode: "buy" as ViewMode, icon: <BiTrendingUp />, color: "text-green-400" },
  ]

  return (
    <div
      className="relative w-full h-full flex flex-col mborder border-gray-300"
      style={{ backgroundColor: "var(--orderbook-bg)", color: "var(--orderbook-text)" }}
    >
      {/* Header */}
      <div className="px-2 sm:px-3 py-2 border-b border-gray-300">
        <div className="flex items-center gap-1 sm:gap-2 mb-2">
          <BiStar className="text-xs sm:text-sm" style={{ color: "var(--warning-color)" }} />
          <span
            className="text-[10px] sm:text-xs font-medium truncate"
            style={{ color: "var(--orderbook-text)" }}
          >
            P-BTC-106000-281125
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1 sm:gap-2">
          <div>
            <div
              className="text-[8px] sm:text-[9px]"
              style={{ color: "var(--orderbook-text-secondary)" }}
            >
              24h Change
            </div>
            <div className="text-[10px] sm:text-[11px] font-medium text-green-500">14.68%</div>
          </div>
          <div className="text-right">
            <div
              className="text-[8px] sm:text-[9px]"
              style={{ color: "var(--orderbook-text-secondary)" }}
            >
              Price
            </div>
            <div className="text-[10px] sm:text-[11px] font-medium text-green-500">
              ${currentPrice.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Order Book Title & Controls */}
      <div className="px-2 sm:px-3 py-2 border-b border-gray-300">
        <div className="flex items-center justify-between">
          <h3
            className="text-[10px] sm:text-xs font-medium"
            style={{ color: "var(--orderbook-text)" }}
          >
            Order Book
          </h3>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="flex gap-1">
              {viewModeIcons.map(item => (
                <button
                  key={item.mode}
                  onClick={() => setViewMode(item.mode)}
                  className={`text-xs sm:text-sm ${
                    viewMode === item.mode ? item.color : "text-gray-600"
                  } hover:opacity-80`}
                >
                  {item.icon}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1 text-[9px] sm:text-[10px] text-black cursor-pointer">
              {lotSize}
              <BiChevronDown className="w-2 h-2 sm:w-3 sm:h-3" />
            </button>
          </div>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-2 mt-1 sm:mt-2 text-[8px] sm:text-[9px] text-gray-400">
          <div>Price (USD)</div>
          <div className="text-right">Size (BTC)</div>
        </div>
      </div>

      {/* Order Book Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {(viewMode === "all" || viewMode === "sell") && (
          <div className="overflow-y-auto px-3 py-1 flex-1">
            {sellOrders.map((order, idx) => (
              <OrderBookRow
                key={`sell-${idx}`}
                price={order.price}
                size={order.size}
                type="sell"
                onHover={handleHover}
              />
            ))}
          </div>
        )}

        {/* Current Price & Spread */}
        <div className="px-3 py-1.5 border-y border-gray-300">
          <div className="flex items-center justify-between">
            <div className="text-red-400 text-sm font-bold">${currentPrice.toFixed(1)}</div>
            <div className="text-gray-900 text-[9px]">
              Spread: <span className="text-black">{spread.toFixed(1)}</span> (
              {spreadPercent.toFixed(2)}%)
            </div>
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-[9px]">
            <div className="flex items-center gap-1">
              <span className="text-gray-900">I</span>
              <span className="text-black">{(currentPrice * 19.85).toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-900">M</span>
              <span className="text-black">{(currentPrice * 1.03).toFixed(1)}</span>
            </div>
          </div>
        </div>

        {(viewMode === "all" || viewMode === "buy") && (
          <div className="overflow-y-auto px-3 py-1 flex-1 ">
            {buyOrders.map((order, idx) => (
              <OrderBookRow
                key={`buy-${idx}`}
                price={order.price}
                size={order.size}
                type="buy"
                onHover={handleHover}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Tooltip */}
      {hoverStats && hoverPosition && (
        <div
          className="absolute z-50 bg-[#23262f] rounded-lg shadow-lg p-2 border border-gray-700 pointer-events-none transition-opacity duration-150"
          style={{
            top: hoverPosition.y,
            left: hoverPosition.x,
            transform: "translateY(-50%)",
          }}
        >
          <div className="space-y-1 text-[9px]">
            <div className="flex justify-between gap-3">
              <span className="text-gray-400">Avg. Price</span>
              <span className="text-white">~{hoverStats.avgPrice.toFixed(1)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-400">Amount (BTC)</span>
              <span className="text-white">{hoverStats.amount.toFixed(3)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-400">Premium (USD)</span>
              <span className="text-white">{hoverStats.premium.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Trades */}
      <div className="border-t border-gray-300 px-3 py-2">
        <h3 className="text-black text-xs font-medium mb-2">Recent Trades</h3>
        <div className="grid grid-cols-3 text-[9px] mb-1" style={{ color: "var(--text-secondary)" }}>
          <div>Price (USD)</div>
          <div className="text-right">Size (BTC)</div>
          <div className="text-right">Time</div>
        </div>
        <div className="max-h-24 overflow-y-auto">
          {recentTrades.map((trade, idx) => (
            <RecentTradeRow
              key={idx}
              price={trade.price}
              size={trade.size}
              time={trade.time}
              type={trade.type}
            />
          ))}
        </div>
      </div>
    </div>
  )
}