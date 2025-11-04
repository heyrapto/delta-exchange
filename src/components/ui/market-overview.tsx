"use client"

import { useState } from "react"
import { BiChevronDown, BiStar, BiTrendingDown, BiTrendingUp } from "react-icons/bi"
import { useTradeStore } from "@/store/trade-store"

export const MarketOverview = () => {
  const { currentPrice, selectedContract } = useTradeStore()
  const [showContractDropdown, setShowContractDropdown] = useState(false)
  
  const priceChange = -3.40
  const priceChangePercent = -3.40
  const volume24h = 930.1
  const openInterest = 55.8
  const nextFunding = 0.0100
  const nextFundingTime = "06h:52m:29s"
  const high24h = 108291.0
  const low24h = 103719.0

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
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold">${currentPrice.toFixed(1)}</span>
          {priceChangePercent >= 0 ? (
            <div className="flex items-center gap-1 text-green-500">
              <BiTrendingUp />
              <span className="text-sm font-medium">{Math.abs(priceChangePercent).toFixed(2)}%</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-500">
              <BiTrendingDown />
              <span className="text-sm font-medium">{Math.abs(priceChangePercent).toFixed(2)}%</span>
            </div>
          )}
        </div>

        {/* Metrics */}
        <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-sm">
          <div>
            <span className="text-gray-600">24h Change: </span>
            <span className={priceChange >= 0 ? "text-green-500" : "text-red-500"}>
              {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
            </span>
          </div>
          <div>
            <span className="text-gray-600">24h Vol.: </span>
            <span className="text-black font-medium">${volume24h.toFixed(1)}M</span>
          </div>
          <div>
            <span className="text-gray-600">OI: </span>
            <span className="text-black font-medium">${openInterest.toFixed(1)}M</span>
          </div>
          <div>
            <span className="text-gray-600">Est. Next Funding: </span>
            <span className="text-black font-medium">{nextFunding.toFixed(4)}% / 8h</span>
          </div>
          <div>
            <span className="text-gray-600">Next Funding In: </span>
            <span className="text-black font-medium">{nextFundingTime}</span>
          </div>
          <div>
            <span className="text-gray-600">24h High: </span>
            <span className="text-black font-medium">${high24h.toFixed(1)}</span>
          </div>
          <div>
            <span className="text-gray-600">24h Low: </span>
            <span className="text-black font-medium">${low24h.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
