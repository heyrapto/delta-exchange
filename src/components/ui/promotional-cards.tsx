"use client"

import { useState } from "react"
import { BiChevronLeft, BiChevronRight } from "react-icons/bi"
import { Button } from "./reusable/button"

interface TopCoin {
  symbol: string
  price: number
  change24h: number
}

export const PromotionalCards = () => {
  const [topCoinsIndex, setTopCoinsIndex] = useState(0)

  const topCoins: TopCoin[][] = [
    [
      { symbol: "BTCUSD", price: 103728.5, change24h: -3.44 },
      { symbol: "ETHUSD", price: 3484, change24h: -6.26 },
      { symbol: "ARCUSD", price: 0.02867, change24h: 33.35 },
      { symbol: "ZECUSD", price: 465.14, change24h: 21.26 },
    ],
  ]

  const currentCoins = topCoins[topCoinsIndex] || topCoins[0]

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 px-4 py-6 bg-white">
      
      {/* Top Coins Card */}
      <div className="relative bg-white border border-gray-300 rounded-lg p-4 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Top Coins</h3>
            <div className="flex gap-1">
              <button
                onClick={() => setTopCoinsIndex(Math.max(0, topCoinsIndex - 1))}
                className="p-1 hover:bg-gray-100 rounded"
                disabled={topCoinsIndex === 0}
              >
                <BiChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setTopCoinsIndex(Math.min(topCoins.length - 1, topCoinsIndex + 1))
                }
                className="p-1 hover:bg-gray-100 rounded"
                disabled={topCoinsIndex === topCoins.length - 1}
              >
                <BiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {currentCoins.map((coin, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium">{coin.symbol}</div>
                  <div className="text-xs text-gray-600">${coin.price.toLocaleString()}</div>
                </div>
                <div
                  className={`text-xs font-semibold ${
                    coin.change24h >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {coin.change24h >= 0 ? "+" : ""}
                  {coin.change24h.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button variant="primary" className="w-full text-xs py-2 mt-auto">
          VIEW DETAILS &gt;
        </Button>
      </div>

      {/* Straddle Contracts Live */}
      <div className="relative bg-white border border-gray-300 rounded-lg p-4 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-sm font-semibold mb-2">Straddle Contracts Live</h3>
          <p className="text-xs text-gray-600 mb-3">
            Trade both legs in one contract, Save half the fees
          </p>
          <div className="flex items-center justify-center mb-4 h-16">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute left-0 text-xs">Calls</div>
              <div className="absolute right-0 text-xs">Puts</div>
              <div className="w-12 h-12 border-2 border-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">Strike</span>
              </div>
            </div>
          </div>
        </div>

        <Button variant="primary" className="w-full text-xs py-2 mt-auto">
          TRADE NOW &gt;
        </Button>
      </div>

      {/* Zero Closing Fee */}
      <div className="relative bg-white border border-gray-300 rounded-lg p-4 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-sm font-semibold mb-2">Zero Closing Fee</h3>
          <div className="flex items-center justify-center mb-3 h-20 bg-gray-50 rounded">
            <div className="text-xs text-gray-600">Chart Placeholder</div>
          </div>
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-gray-600">BTCUSD 30mins</span>
            <span className="text-gray-600">Other Futures 15mins</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <button className="flex-1 py-1.5 bg-red-500 text-white text-xs rounded">
              SELL
            </button>
            <div className="px-2 py-1.5 bg-[#ADFF2F] text-black text-xs font-semibold rounded">
              0 FEE
            </div>
            <button className="flex-1 py-1.5 bg-green-500 text-white text-xs rounded">
              BUY
            </button>
          </div>
        </div>

        <Button variant="primary" className="w-full text-xs py-2 mt-auto">
          TRADE NOW &gt;
        </Button>
      </div>

      {/* Trading Bot */}
      <div className="relative bg-white border border-gray-300 rounded-lg p-4 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-sm font-semibold mb-2">Trading Bot</h3>
          <p className="text-xs text-gray-600 mb-3">
            Turn Your TradingView Strategies into Action
          </p>
          <div className="flex items-center justify-center mb-4 h-16">
            <div className="w-16 h-16 bg-[#ADFF2F]/20 rounded-full flex items-center justify-center">
              <div className="text-2xl font-bold text-[#ADFF2F]">T</div>
            </div>
          </div>
        </div>

        <Button variant="primary" className="w-full text-xs py-2 mt-auto">
          TRY NOW &gt;
        </Button>
      </div>

      {/* Flat 50% Off */}
      <div className="relative bg-white border border-gray-300 rounded-lg p-4 flex flex-col justify-between h-full">
        <div>
          <div className="absolute top-2 right-2 bg-[#ADFF2F] text-black text-xs font-bold px-2 py-1 rounded">
            50% OFF
          </div>
          <h3 className="text-sm font-semibold mb-2">Flat 50% Off on Options Fees</h3>
          <div className="space-y-1 mb-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 line-through">0.03%</span>
              <span className="text-[#ADFF2F] font-semibold">0.015%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 line-through">10% Prem cap</span>
              <span className="text-[#ADFF2F] font-semibold">5% Prem Cap</span>
            </div>
          </div>
        </div>

        <Button variant="primary" className="w-full text-xs py-2 mt-auto">
          TRADE NOW &gt;
        </Button>
      </div>
    </div>
  )
}