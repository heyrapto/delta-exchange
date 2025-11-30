"use client"

import { useState, useEffect } from "react"
import { BiChevronDown } from "react-icons/bi"
import { OrderBookEntry } from "@/types"
import { useAppContext } from "@/context/app-context"
import GNS_CONTRACTS from "@/blockchain/gns/gnsContracts"

interface FuturesOrderBookProps {
  buyOrders?: OrderBookEntry[]
  sellOrders?: OrderBookEntry[]
  currentPrice?: number
  markPrice?: number
  indexPrice?: number
}

export const FuturesOrderBook = ({ buyOrders: propBuyOrders, sellOrders: propSellOrders, currentPrice: propCurrentPrice, markPrice, indexPrice }: FuturesOrderBookProps) => {
  const [priceAggregation, setPriceAggregation] = useState(0.5)
  const [showAggregationDropdown, setShowAggregationDropdown] = useState(false)
  const { state } = useAppContext()
  
  // Real-time order book data
  const [buyOrders, setBuyOrders] = useState<OrderBookEntry[]>(propBuyOrders || [])
  const [sellOrders, setSellOrders] = useState<OrderBookEntry[]>(propSellOrders || [])
  const [currentPrice, setCurrentPrice] = useState(propCurrentPrice || state.gnsPairPrice || 0)
  const [spread, setSpread] = useState(0)
  const [spreadPercent, setSpreadPercent] = useState(0)

  // Get symbol for API based on GNS pair
  const getSymbol = () => {
    const pair = state.gnsPairIndex !== undefined 
      ? GNS_CONTRACTS.PAIRS[state.gnsPairIndex as keyof typeof GNS_CONTRACTS.PAIRS]
      : null
    if (pair) {
      return `${pair.from}USDT`
    }
    return "BTCUSDT"
  }

  // Fetch real-time data from Binance API
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    const controller = new AbortController()
    const symbol = getSymbol()

    const fetchData = async () => {
      try {
        // Depth
        const depthRes = await fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=25`, { signal: controller.signal })
        const depth = await depthRes.json()
        const newSellOrders: OrderBookEntry[] = (depth.asks || []).map((a: [string, string]) => ({ 
          price: parseFloat(a[0]), 
          size: parseFloat(a[1]) 
        }))
        const newBuyOrders: OrderBookEntry[] = (depth.bids || []).map((b: [string, string]) => ({ 
          price: parseFloat(b[0]), 
          size: parseFloat(b[1]) 
        }))

        setSellOrders(newSellOrders)
        setBuyOrders(newBuyOrders)

        const bestAsk = newSellOrders[0]?.price
        const bestBid = newBuyOrders[0]?.price
        if (bestAsk && bestBid) {
          const s = bestAsk - bestBid
          setSpread(s)
          setSpreadPercent((s / ((bestAsk + bestBid) / 2)) * 100)
          setCurrentPrice((bestAsk + bestBid) / 2)
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
  }, [state.gnsPairIndex])

  // Calculate cumulative totals
  const buyOrdersWithTotal = buyOrders.map((order, index) => ({
    ...order,
    total: buyOrders.slice(0, index + 1).reduce((sum, o) => sum + o.size, 0),
  }))

  const sellOrdersWithTotal = sellOrders.map((order, index) => {
    const prevTotal = index > 0 ? sellOrders.slice(0, index).reduce((sum, o) => sum + o.size, 0) : 0
    return {
      ...order,
      total: prevTotal + order.size,
    }
  })

  const aggregationOptions = [0.5, 1, 2, 5, 10]

  return (
    <div className="w-full h-full flex flex-col bg-white border border-gray-300">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-300">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Order Book</h3>
          <div className="flex items-center gap-2">
            {/* View mode icons - simplified for now */}
            <div className="relative">
              <button
                onClick={() => setShowAggregationDropdown(!showAggregationDropdown)}
                className="flex items-center gap-1 text-xs text-gray-600 hover:text-black"
              >
                {priceAggregation}
                <BiChevronDown className="w-3 h-3" />
              </button>
              {showAggregationDropdown && (
                <div className="absolute top-6 right-0 bg-white border border-gray-300 rounded shadow-lg py-1 z-10 min-w-[60px]">
                  {aggregationOptions.map((opt) => (
                    <div
                      key={opt}
                      onClick={() => {
                        setPriceAggregation(opt)
                        setShowAggregationDropdown(false)
                      }}
                      className="px-3 py-1.5 text-xs hover:bg-gray-100 cursor-pointer"
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Book Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sell Orders (Asks) - Red */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 text-xs px-3 py-1 bg-gray-50 border-b border-gray-200">
            <div className="text-gray-600">Price (USD)</div>
            <div className="text-gray-600 text-right">Size (BTC)</div>
            <div className="text-gray-600 text-right">Total (BTC)</div>
          </div>
          {sellOrdersWithTotal.slice().reverse().map((order, index) => (
            <div
              key={index}
              className="grid grid-cols-3 text-xs px-3 py-1 hover:bg-red-50/30 cursor-pointer border-b border-gray-100"
            >
              <div className="text-red-500">{order.price.toFixed(1)}</div>
              <div className="text-right">{order.size.toFixed(3)}</div>
              <div className="text-right text-gray-600">{order.total.toFixed(3)}</div>
            </div>
          ))}
        </div>

        {/* Current Price Separator */}
        <div className="px-3 py-2">
          <div className="text-start">
            <div className={`text-lg font-semibold ${currentPrice >= (markPrice || 0) ? "text-green-500" : "text-red-500"}`}>${currentPrice.toFixed(1)}</div>
            {markPrice && (
              <div className="text-xs text-gray-600 mt-0">
                I {indexPrice?.toFixed(1) || currentPrice.toFixed(1)} | M {markPrice.toFixed(1)}
              </div>
            )}
            {/* <div className="text-xs text-gray-600 mt-1">
              Spread: <span className="text-black">{spread.toFixed(1)}</span> ({spreadPercent.toFixed(2)}%)
            </div> */}
          </div>
        </div>

        {/* Buy Orders (Bids) - Green */}
        <div className="flex-1 overflow-y-auto">
          {buyOrdersWithTotal.map((order, index) => (
            <div
              key={index}
              className="grid grid-cols-3 text-xs px-3 py-1 hover:bg-green-50/30 cursor-pointer border-b border-gray-100"
            >
              <div className="text-green-500">{order.price.toFixed(1)}</div>
              <div className="text-right">{order.size.toFixed(3)}</div>
              <div className="text-right text-gray-600">{order.total.toFixed(3)}</div>
            </div>
          ))}
          <div className="grid grid-cols-3 text-xs px-3 py-1 bg-gray-50 border-t border-gray-200">
            <div className="text-gray-600">Price (USD)</div>
            <div className="text-gray-600 text-right">Size (BTC)</div>
            <div className="text-gray-600 text-right">Total (BTC)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
