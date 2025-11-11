"use client"

import { OrderBookEntry, RecentTrade } from "@/types"
import { useEffect, useState } from "react"
import { useTradeStore } from "@/store/trade-store"
import { BiChart, BiChevronDown, BiStar, BiTrendingDown, BiTrendingUp } from "react-icons/bi"
import { OrderBookRow, RecentTradeRow } from "../shared/order-book-card"
import { useAppContext } from "@/context/app-context"

type ViewMode = "all" | "buy" | "sell"

export const OrderBook = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("all")
  const [lotSize, setLotSize] = useState(0.1)
  const price = Math.random() * 1000;
  const { state, formatNumber } = useAppContext();
  const { assetPrice, isFetching, asset } = state;
  const [showLotSizeDropdown, setShowLotSizeDropdown] = useState(false)
  const [hoveredData, setHoveredData] = useState<{ price: number; size: number } | null>(null)
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null)

  // 🔥 Dynamic states - will be generated from current price
  const [sellOrders, setSellOrders] = useState<OrderBookEntry[]>([])
  const [buyOrders, setBuyOrders] = useState<OrderBookEntry[]>([])
  const [recentTrades, setRecentTrades] = useState<RecentTrade[]>([])

  const currentPriceNumber = assetPrice
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
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    const controller = new AbortController()
    const symbol = `${state.asset.toUpperCase()}USDT`

    const fetchData = async () => {
      try {
        // Depth
        const depthRes = await fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=25`, { signal: controller.signal })
        const depth = await depthRes.json()
        const newSellOrders: OrderBookEntry[] = (depth.asks || []).map((a: [string, string]) => ({ price: parseFloat(a[0]), size: parseFloat(a[1]) }))
        const newBuyOrders: OrderBookEntry[] = (depth.bids || []).map((b: [string, string]) => ({ price: parseFloat(b[0]), size: parseFloat(b[1]) }))

        // Trades
        const tradesRes = await fetch(`https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=20`, { signal: controller.signal })
        const trades = await tradesRes.json()
        const newRecentTrades: RecentTrade[] = (trades || []).map((t: any) => ({
          price: parseFloat(t.price),
          size: parseFloat(t.qty),
          time: new Date(t.time).toLocaleTimeString("en-US", { hour12: false }),
          type: t.isBuyerMaker ? "sell" : "buy",
        }))

        setSellOrders(newSellOrders)
        setBuyOrders(newBuyOrders)
        setRecentTrades(newRecentTrades)

        const bestAsk = newSellOrders[0]?.price
        const bestBid = newBuyOrders[0]?.price
        if (bestAsk && bestBid) {
          const s = bestAsk - bestBid
          setSpread(s)
          setSpreadPercent((s / ((bestAsk + bestBid) / 2)) * 100)
        }
      } catch (_) {
        // ignore aborted or transient errors
      }
    }

    fetchData()
    interval = setInterval(fetchData, 2000)

    return () => {
      if (interval) clearInterval(interval)
      controller.abort()
    }
  }, [state.asset])

  const viewModeIcons = [
    { mode: "sell" as ViewMode, icon: <BiTrendingDown />, color: "text-red-400" },
    { mode: "all" as ViewMode, icon: <BiChart />, color: "text-gray-400" },
    { mode: "buy" as ViewMode, icon: <BiTrendingUp />, color: "text-green-400" },
  ]

  return (
    <div
      className="relative w-full h-full flex flex-col border-b border-l border-gray-300"
      style={{ backgroundColor: "var(--orderbook-bg)", color: "var(--orderbook-text)" }}
    >
      {/* Header */}
      <div className="px-2 sm:px-3 py-2 border-b border-gray-300">
        <div className="flex items-center gap-1 sm:gap-2 mb-2">
          <BiStar className="text-xs" style={{ color: "var(--warning-color)" }} />
          <span
            className="text-xs font-medium truncate"
            style={{ color: "var(--orderbook-text)" }}
          >
            P-BTC-106000-281125
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1 sm:gap-2">
          <div>
            <div
              className="text-xs"
              style={{ color: "var(--orderbook-text-secondary)" }}
            >
              24h Change
            </div>
            <div className="text-xs font-medium text-green-500">14.68%</div>
          </div>
          <div className="text-right">
            <div
              className="text-[8px] sm:text-[9px]"
              style={{ color: "var(--orderbook-text-secondary)" }}
            >
              Price
            </div>
            <div className="text-xs font-medium text-green-500">
              {isFetching ? "..." : formatNumber(assetPrice)}
            </div>
          </div>
        </div>
      </div>

      {/* Order Book Title & Controls */}
      <div className="px-2 sm:px-3 py-2 border-b border-gray-300">
        <div className="flex items-center justify-between">
          <h3
            className="text-xs sm:text-xs font-medium"
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
            <div className="relative">
              <button 
                onClick={() => setShowLotSizeDropdown(!showLotSizeDropdown)}
                className="flex items-center gap-1 text-[9px] sm:text-[10px] text-black cursor-pointer"
              >
                {lotSize}
                <BiChevronDown className="w-2 h-2 sm:w-3 sm:h-3" />
              </button>
              
              {showLotSizeDropdown && (
                <div className="absolute top-6 right-0 bg-white rounded shadow-lg py-1 z-10 min-w-[80px]">
                  {[0.1, 0.5, 1.0, 2.0, 5.0].map((size) => (
                    <div
                      key={size}
                      onClick={() => {
                        setLotSize(size)
                        setShowLotSizeDropdown(false)
                      }}
                      className="px-3 py-1.5 text-[10px] hover:bg-gray-100/50 cursor-pointer"
                    >
                      {size}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-2 mt-1 sm:mt-2 text-xs text-gray-400">
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
            <div className=" flex flex-col">
              <p className="text-xs">Current Price:</p>
              <span className="text-red-400 text-sm font-bold">{isFetching ? "..." : formatNumber(assetPrice)}</span>
              </div>
            <div className="text-gray-900 text-[9px]">
              Spread: <span className="text-black">{spread.toFixed(1)}</span> (
              {spreadPercent.toFixed(2)}%)
            </div>
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-[9px]"></div>
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
          <div className="space-y-1 text-xs">
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
        <div className="grid grid-cols-3 text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
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