"use client"

import { useState, useEffect } from "react"
import { BiChevronDown, BiStar, BiTrendingDown, BiTrendingUp } from "react-icons/bi"
import { useTradeStore } from "@/store/trade-store"
import { useAppContext } from "@/context/app-context"
import GNS_CONTRACTS from "@/blockchain/gns/gnsContracts"
import { ArrowDown, ArrowUp } from "lucide-react"

export const MarketOverview = () => {
  const { currentPrice, selectedContract } = useTradeStore()
  const { state } = useAppContext()
  const [showContractDropdown, setShowContractDropdown] = useState(false)
  
  // Real-time market data
  const [priceChange, setPriceChange] = useState(0)
  const [priceChangePercent, setPriceChangePercent] = useState(0)
  const [volume24h, setVolume24h] = useState(0)
  const [openInterest, setOpenInterest] = useState(0)
  const [nextFunding, setNextFunding] = useState(0.0100)
  const [nextFundingTime, setNextFundingTime] = useState("06h:52m:29s")
  const [high24h, setHigh24h] = useState(0)
  const [low24h, setLow24h] = useState(0)
  const [lastPrice, setLastPrice] = useState(state.gnsPairPrice || currentPrice)

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

  // Fetch real-time market data
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    const controller = new AbortController()
    const symbol = getSymbol()

    const fetchData = async () => {
      try {
        // 24h ticker stats
        const tickerRes = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`, { signal: controller.signal })
        const ticker = await tickerRes.json()
        
        if (ticker) {
          const price = parseFloat(ticker.lastPrice)
          const prevPrice = parseFloat(ticker.openPrice)
          const change = price - prevPrice
          const changePercent = (change / prevPrice) * 100
          
          setLastPrice(price)
          setPriceChange(change)
          setPriceChangePercent(changePercent)
          setVolume24h(parseFloat(ticker.quoteVolume) / 1000000) // Convert to millions
          setHigh24h(parseFloat(ticker.highPrice))
          setLow24h(parseFloat(ticker.lowPrice))
        }
      } catch (_) {
        // ignore aborted or transient errors
      }
    }

    fetchData()
    interval = setInterval(fetchData, 5000)

    return () => {
      if (interval) clearInterval(interval)
      controller.abort()
    }
  }, [state.gnsPairIndex])

  return (
    <div className="w-full bg-white border-b border-gray-300 px-4 py-3">
      <div className="flex flex-wrap items-center gap-4 lg:gap-6">
        {/* Trading Pair */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowContractDropdown(!showContractDropdown)}
            className="flex items-center gap-1 text-sm font-semibold hover:opacity-80"
          >
            <BiStar className="text-[#ADFF2F]" />
            <span>{selectedContract}USD</span>
            <BiChevronDown className="text-gray-400" />
          </button>
        </div>

        {/* Current Price */}
        <div className={`flex items-center gap-1 ${priceChangePercent >= 0 ? "text-green-500" : "text-red-500"}`}>
          <span className="text-sm font-semibold">${lastPrice.toFixed(1)}</span>
          {priceChangePercent >= 0 ? (
            <ArrowUp size={20} />
          ) : (
            <ArrowDown size={20} />
          )}
        </div>

        {/* Metrics */}
        <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-sm">
          <div className="flex flex-col border-l pl-2 border-gray-300">
            <span className="text-gray-600 text-xs">24h Change: </span>
            <span className={priceChange >= 0 ? "text-green-500" : "text-red-500"}>
              {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
            </span>
          </div>
          <div className="flex flex-col border-l pl-2 border-gray-300">
            <span className="text-gray-600 text-xs">24h Vol.: </span>
            <span className="text-black font-medium">${volume24h.toFixed(1)}M</span>
          </div>
          <div className="flex flex-col border-l pl-2 border-gray-300">
            <span className="text-gray-600 text-xs">OI: </span>
            <span className="text-black font-medium">${openInterest.toFixed(1)}M</span>
          </div>
          <div className="flex flex-col border-l pl-2 border-gray-300">
            <span className="text-gray-600 text-xs">Est. Next Funding: </span>
            <span className="text-black font-medium">{nextFunding.toFixed(4)}% / 8h</span>
          </div>
          <div className="flex flex-col border-l pl-2 border-gray-300">
            <span className="text-gray-600 text-xs">Next Funding In: </span>
            <span className="text-black font-medium">{nextFundingTime}</span>
          </div>
          <div className="flex flex-col border-l pl-2 border-gray-300">
            <span className="text-gray-600 text-xs">24h High: </span>
            <span className="text-black font-medium">${high24h.toFixed(1)}</span>
          </div>
          <div className="flex flex-col border-l pl-2 border-gray-300">
            <span className="text-gray-600 text-xs">24h Low: </span>
            <span className="text-black font-medium">${low24h.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
